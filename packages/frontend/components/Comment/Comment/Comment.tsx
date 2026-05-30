import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Root, UserName, Container, StyledButton, CreatedAt } from './style';
import { Link, Avatar, Confirm } from '../../ui';
import { CloseIcon, PinnedIcon } from '../../ui/icons';
import { RootState } from '../../../store';
import { useNotifications, timeAgo } from '../../../utils';
import { UserRole } from '../../../constants';
import Linkify from '../../Linkify';

const deleteComment = async (id: string) => {
  const like = await axios.delete('/comments/delete', { data: { id } });
  return like.data;
};

const pinComment = async (id: string) => {
  const res = await axios.put('/comments/pin', { id });
  return res.data;
};

interface CommentProps {
  comment: any;
  author: any;
  queryKey: any;
  post: any;
}

const Comment: FC<CommentProps> = ({ comment, author, queryKey, post }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { mutateAsync } = useMutation(deleteComment);
  const queryClient = useQueryClient();
  const { deleteNotification } = useNotifications();

  const remove = async () => {
    try {
      const deletedComment = await mutateAsync(comment._id);
      queryClient.setQueryData(queryKey, (existingPosts: any) => {
        if (!existingPosts.pages) {
          return {
            ...existingPosts,
            comments: existingPosts.comments.filter((comment) => comment._id !== deletedComment._id),
          };
        }

        return {
          ...existingPosts,
          pages: existingPosts.pages.map((posts) => {
            return posts.map((p) => {
              if (p._id === post._id) {
                return {
                  ...p,
                  comments: p.comments.filter((comment) => comment._id !== deletedComment._id),
                };
              } else {
                return p;
              }
            });
          }),
        };
      });
      const notification = post.author.notifications.find((n) => n?.comment?._id === deletedComment?._id);
      if (notification) {
        deleteNotification({
          id: notification._id,
          postId: post._id,
          user: post.author,
          queryKey,
        });
      }
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('An error occurred while deleting a comment: ', error);
    }
  };

  const { mutateAsync: pinMutate } = useMutation(pinComment);

  const handlePinToggle = async () => {
    try {
      const updatedComment = await pinMutate(comment._id);
      queryClient.setQueryData(queryKey, (existingPosts: any) => {
        if (!existingPosts.pages) {
          return {
            ...existingPosts,
            comments: existingPosts.comments.map((c) => (c._id === updatedComment._id ? updatedComment : c)),
          };
        }

        return {
          ...existingPosts,
          pages: existingPosts.pages.map((posts) => {
            return posts.map((p) => {
              if (p._id === post._id) {
                return {
                  ...p,
                  comments: p.comments.map((c) => (c._id === updatedComment._id ? updatedComment : c)),
                };
              } else {
                return p;
              }
            });
          }),
        };
      });
    } catch (error) {
      console.error('An error occurred while toggling comment pin: ', error);
    }
  };

  const isPinAuthorized = authUser && (
    authUser._id === post.author._id ||
    authUser.role === UserRole.Admin ||
    authUser.role === UserRole.SuperAdmin
  );

  return (
    <Root>
      <Link disableBorderOnHover href={`/profile/${author._id}`}>
        <Avatar image={author?.image} />
      </Link>

      <Container>
        <UserName>
          <Link color="text" weight="bold" size="tiny" href={`/profile/${author._id}`}>
            {author.fullName}
          </Link>
          <CreatedAt>
            &middot; {timeAgo(comment.createdAt)}
            {comment.pinned && (
              <span style={{ marginLeft: '6px', color: '#00AB66', display: 'inline-flex', alignItems: 'center' }}>
                &middot;&nbsp;<PinnedIcon width="10" />&nbsp;Pinned
              </span>
            )}
          </CreatedAt>
        </UserName>
        <Linkify>{comment.comment}</Linkify>
      </Container>

      <Confirm
        onConfirm={remove}
        close={() => setIsConfirmOpen(false)}
        isOpen={isConfirmOpen}
        title="Remove the comment permanently?"
      />

      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto', alignSelf: 'start' }}>
        {isPinAuthorized && (
          <StyledButton ghost onClick={handlePinToggle}>
            <PinnedIcon width="10" color={comment.pinned ? 'primary' : 'textSecondary'} />
          </StyledButton>
        )}
        {authUser && authUser._id === author._id && (
          <StyledButton ghost onClick={() => setIsConfirmOpen(true)}>
            <CloseIcon width="10" />
          </StyledButton>
        )}
      </div>
    </Root>
  );
};

export default Comment;
