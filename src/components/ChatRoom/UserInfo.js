import React from 'react';
import { Button, Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { LogoutOutlined } from '@ant-design/icons';

import { auth } from '../../firebase/config';
import { AuthContext } from '../../context/authProvider';
import { AppContext } from '../../context/appProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .ant-avatar {
      width: 40px;
      height: 40px;
      border: 2px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      
      img {
        object-fit: cover;
      }
    }
  }

  .username {
    color: white;
    font-weight: 500;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .ant-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 4px 12px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    .anticon {
      font-size: 14px;
    }
  }
`;

export default function UserInfo() {
  const { user = {} } = React.useContext(AuthContext);
  const { displayName = '', photoURL = '' } = user;

  const { clearState } = React.useContext(AppContext);

  const handleLogout = () => {
    if (clearState) clearState();
    auth.signOut();
  };

  return (
    <WrapperStyled>
      <div className="user-info">
        <Avatar src={photoURL} size="large">
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='username'>{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}
