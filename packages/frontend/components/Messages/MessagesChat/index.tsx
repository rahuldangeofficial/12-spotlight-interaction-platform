import React, { FC, KeyboardEvent, useEffect, useState, useRef, FormEvent } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Root,
  Header,
  Container,
  FullName,
  MessageWrapper,
  MessagesConversation,
  Conversation,
  Form,
  Message,
  MessageDate,
  Textarea,
  ScrollWrapper,
} from './style';
import { Avatar, Link, Spacing, Button, Text } from '../../ui';
import Search from '../../Search';
import { SendIcon, DeleteIcon } from '../../ui/icons';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket, date, useNotifications } from '../../../utils';
import { Events } from '../../../constants';
import { addToMessagesList } from '../cache';
import { NotificationType } from '../../../constants/Notification';
import { removeUserNotification } from '../../../store/auth';
import Linkify from '../../Linkify';
import { useRouter } from 'next/router';

interface MessagesChatProps {
  onSearchItemClick: (user: any) => void;
  userId?: string;
  user: any;
}

const fetchMessages = async ({ queryKey }) => {
  const [, userId] = queryKey;
  const { data } = await axios.get(`/messages?userId=${userId}`);
  return data;
};

const createMessage = async ({ message, receiver }) => {
  const newMessage = await axios.post('/messages/create', { message, receiver });
  return newMessage;
};

const updateMessagesSeen = async (userId) => {
  const { data } = await axios.put('/notifications/messages-seen', { userId });
  return data;
};

const MessagesChat: FC<MessagesChatProps> = ({ onSearchItemClick, userId, user }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const scrollToBottomRef = useRef(null);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: messages } = useQuery(['messages', userId], fetchMessages, {
    enabled: userId !== undefined,
  });
  const { mutateAsync: sendMessage } = useMutation(createMessage);
  const { mutateAsync: updateMessagesSeenMutation } = useMutation(updateMessagesSeen);
  const socket = useSocket();
  const dispatch = useDispatch();
  const { createNotification } = useNotifications();

  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const isCurrentlyTypingRef = useRef(false);

  useEffect(() => {
    setIsReceiverTyping(false);
    isCurrentlyTypingRef.current = false;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, [userId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const sendMessageListener = (data: any) => {
      if (data.sender._id === userId && data.receiver._id === authUser._id) {
        addToMessagesList(queryClient, data, userId);
      }
    };

    const startTypingListener = (data: any) => {
      if (data.senderId === userId) {
        setIsReceiverTyping(true);
      }
    };

    const stopTypingListener = (data: any) => {
      if (data.senderId === userId) {
        setIsReceiverTyping(false);
      }
    };

    socket.on(Events.SEND_MESSAGE, sendMessageListener);
    socket.on(Events.START_TYPING, startTypingListener);
    socket.on(Events.STOP_TYPING, stopTypingListener);

    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView();
    }

    return () => {
      socket.off(Events.SEND_MESSAGE, sendMessageListener);
      socket.off(Events.START_TYPING, startTypingListener);
      socket.off(Events.STOP_TYPING, stopTypingListener);
    };
  }, [socket, queryClient, messages, authUser, userId]);

  useEffect(() => {
    if (authUser.notifications.length < 1) {
      return;
    }

    const notification = authUser.notifications.find((n) => {
      if (n?.author?._id === userId && n?.user === authUser._id && n.message) {
        return n;
      }
    });

    const clearMessageNotifications = async () => {
      dispatch(removeUserNotification(notification._id));
      await updateMessagesSeenMutation(userId);
    };

    if (notification) {
      clearMessageNotifications();
    }
  }, [updateMessagesSeenMutation, userId, authUser, dispatch]);

  const onSubmit = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<Element>) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    isCurrentlyTypingRef.current = false;
    if (socket && userId) {
      socket.emit(Events.STOP_TYPING, { senderId: authUser._id, receiverId: userId });
    }

    try {
      const newMessageResponse = await sendMessage({ message, receiver: user._id });
      const newMessage = {
        _id: newMessageResponse.data._id,
        message,
        seen: false,
        createdAt: newMessageResponse.data.createdAt,
        sender: authUser,
        receiver: user,
      };
      addToMessagesList(queryClient, newMessage, userId);
      socket.emit(Events.CREATE_MESSAGE, newMessage);
      setMessage('');
      const notificationExists = await axios.get(`/notifications/author-and-user/${user._id}`);
      if (!notificationExists.data) {
        createNotification({
          user: user,
          postId: null,
          notificationType: NotificationType.MESSAGE,
          notificationTypeId: newMessageResponse?.data?._id,
          queryKey: ['messages', userId],
          disableCacheUpdate: true,
        });
      }
    } catch (error) {
      console.error('An error occurred while sending a message: ', error);
    }
  };

  const onEnterPress = (e: KeyboardEvent<Element>) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      onSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (!socket || !userId) return;

    if (!isCurrentlyTypingRef.current) {
      isCurrentlyTypingRef.current = true;
      socket.emit(Events.START_TYPING, { senderId: authUser._id, receiverId: userId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      isCurrentlyTypingRef.current = false;
      socket.emit(Events.STOP_TYPING, { senderId: authUser._id, receiverId: userId });
    }, 2000);
  };

  const onClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete('/messages/clear', { data: { userId } });
      queryClient.setQueryData(['messages', userId], []);
      queryClient.invalidateQueries(['conversations']);
      router.push('/messages');
    } catch (error) {
      console.error('An error occurred while clearing chat: ', error);
    }
  };

  return (
    <Root>
      <Header>
        {user ? (
          <>
            <Container>
              <Link href={`/profile/${user._id}`} disableBorderOnHover>
                <Avatar isOnline={user.isOnline} image={user.image} size={1.5} />
                <FullName>{user.fullName}</FullName>
              </Link>
            </Container>
            <Spacing right="sm">
              <Button onClick={onClearChat} text color="error">
                <DeleteIcon width="16" color="error" />
                <Spacing left="xxs">Clear Chat</Spacing>
              </Button>
            </Spacing>
          </>
        ) : (
          <Container>
            To:
            <Spacing left="xs">
              <Search
                onlyUsers
                onItemClick={(user: any) => onSearchItemClick(user)}
                hideBorder
                hideIcon
                placeholder="Name of a member"
              />
            </Spacing>
          </Container>
        )}
      </Header>
      <ScrollWrapper>
        <MessagesConversation>
          <Conversation>
            {messages &&
              messages.map((m) => {
                const isSender = m.sender._id === authUser._id;
                return (
                  <MessageWrapper isSender={isSender} key={m._id}>
                    {!isSender && (
                      <Spacing right="xxs">
                        <Avatar image={m.sender.image} />
                      </Spacing>
                    )}

                    <Message isSender={isSender}>
                      <Linkify>{m.message}</Linkify>
                    </Message>

                    <MessageDate isSender={isSender}>{date(m.createdAt)}</MessageDate>
                  </MessageWrapper>
                );
              })}

            <div ref={scrollToBottomRef} />
          </Conversation>
        </MessagesConversation>

        {router.pathname !== '/messages' && (
          <>
            {isReceiverTyping && (
              <Spacing left="sm" bottom="xxs">
                <Text size="xxs" color="textSecondary" style={{ fontStyle: 'italic' }}>
                  {user.fullName} is typing...
                </Text>
              </Spacing>
            )}
            <Form onSubmit={onSubmit}>
              <Textarea value={message} onChange={handleInputChange} onKeyDown={onEnterPress} />
              <Spacing left="xs" top="xxs">
                <Button type="submit" ghost>
                  <SendIcon width="28" />
                </Button>
              </Spacing>
            </Form>
          </>
        )}
      </ScrollWrapper>
    </Root>
  );
};

export default MessagesChat;
