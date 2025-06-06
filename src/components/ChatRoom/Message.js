import React, { useContext } from 'react';
import { Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { formatRelative } from 'date-fns';
import { AuthContext } from '../../context/authProvider';

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${props => props.isMe ? 'row-reverse' : 'row'};
  align-items: flex-start;

  .message-content {
    max-width: 60%;
    display: flex;
    flex-direction: ${props => props.isMe ? 'row-reverse' : 'row'};
    align-items: flex-start;
    gap: 8px;
  }

  .author {
    margin: ${props => props.isMe ? '0 0 0 5px' : '0 5px 0 0'};
    font-weight: 500;
    font-size: 13px;
    color: #65676B;
  }

  .date {
    font-size: 11px;
    color: #65676B;
    margin-top: 4px;
    text-align: ${props => props.isMe ? 'right' : 'left'};
  }

  .bubble {
    padding: 8px 12px;
    border-radius: 18px;
    background-color: ${props => props.isMe ? '#0084ff' : '#E4E6EB'};
    color: ${props => props.isMe ? 'white' : 'black'};
    font-size: 14px;
    max-width: 100%;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .avatar {
    margin: ${props => props.isMe ? '0 0 0 8px' : '0 8px 0 0'};
  }
`;

// Hàm định dạng thời gian gửi tin nhắn
function formatDate(seconds) {
  if (!seconds) return '';
  const formatted = formatRelative(new Date(seconds * 1000), new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function Message({ text, displayName, createdAt, photoURL, uid }) {
  const { user: { uid: currentUserId } } = useContext(AuthContext);
  const isMe = uid === currentUserId;

  return (
    <WrapperStyled isMe={isMe}>
      <div className="message-content">
        {!isMe && (
          <Avatar className="avatar" size="small" src={photoURL}>
            {!photoURL && displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        )}
        <div>
          {!isMe && <Typography.Text className="author">{displayName}</Typography.Text>}
          <div className="bubble">{text}</div>
          <Typography.Text className="date">
            {formatDate(createdAt?.seconds)}
          </Typography.Text>
        </div>
      </div>
    </WrapperStyled>
  );
}
