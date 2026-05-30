import React, { FC } from 'react';
import styled from 'styled-components';

interface MarkdownProps {
  children: string;
}

const Pre = styled.pre`
  background-color: ${(p) => p.theme.colors.grey[10]};
  padding: ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radius.sm};
  overflow-x: auto;
  font-family: monospace;
  font-size: ${(p) => p.theme.font.size.xxs};
  margin: ${(p) => p.theme.spacing.xs} 0;
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Code = styled.code`
  background-color: ${(p) => p.theme.colors.grey[10]};
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Blockquote = styled.blockquote`
  border-left: 4px solid ${(p) => p.theme.colors.general.primary};
  margin: ${(p) => p.theme.spacing.xs} 0;
  padding-left: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.general.textSecondary};
  font-style: italic;
`;

const Ul = styled.ul`
  margin: ${(p) => p.theme.spacing.xs} 0;
  padding-left: ${(p) => p.theme.spacing.sm};
`;

const Li = styled.li`
  margin-bottom: 4px;
  font-size: ${(p) => p.theme.font.size.xs};
`;

const P = styled.p`
  margin-bottom: ${(p) => p.theme.spacing.xxs};
  line-height: 1.5;
  font-size: ${(p) => p.theme.font.size.xs};
`;

const parseInline = (text: string): React.ReactNode[] => {
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const splitParts = text.split(regex);

  return splitParts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <Code key={i}>{part.slice(1, -1)}</Code>;
    }
    return part;
  });
};

const Markdown: FC<MarkdownProps> = ({ children }) => {
  if (!children) return null;

  const blocks = children.split(/(```[\s\S]*?```)/g);
  let key = 0;

  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith('```') && block.endsWith('```')) {
          const codeContent = block.slice(3, -3).trim();
          return (
            <Pre key={index}>
              <code>{codeContent}</code>
            </Pre>
          );
        }

        const lines = block.split('\n');
        const renderedLines = [];
        let listItems = [];
        let insideQuote = false;
        let quoteContent = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line.startsWith('>')) {
            insideQuote = true;
            quoteContent.push(line.slice(1).trim());
            continue;
          } else if (insideQuote) {
            renderedLines.push(
              <Blockquote key={key++}>
                {quoteContent.map((q, idx) => (
                  <P key={idx}>{parseInline(q)}</P>
                ))}
              </Blockquote>
            );
            insideQuote = false;
            quoteContent = [];
          }

          if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(line.slice(2));
            continue;
          } else if (listItems.length > 0) {
            renderedLines.push(
              <Ul key={key++}>
                {listItems.map((item, idx) => (
                  <Li key={idx}>{parseInline(item)}</Li>
                ))}
              </Ul>
            );
            listItems = [];
          }

          if (line.trim() === '') {
            renderedLines.push(<div key={key++} style={{ height: '8px' }} />);
            continue;
          }

          renderedLines.push(<P key={key++}>{parseInline(line)}</P>);
        }

        if (insideQuote) {
          renderedLines.push(
            <Blockquote key={key++}>
              {quoteContent.map((q, idx) => (
                <P key={idx}>{parseInline(q)}</P>
              ))}
            </Blockquote>
          );
        }
        if (listItems.length > 0) {
          renderedLines.push(
            <Ul key={key++}>
              {listItems.map((item, idx) => (
                <Li key={idx}>{parseInline(item)}</Li>
              ))}
            </Ul>
          );
        }

        return <React.Fragment key={index}>{renderedLines}</React.Fragment>;
      })}
    </>
  );
};

export default Markdown;
