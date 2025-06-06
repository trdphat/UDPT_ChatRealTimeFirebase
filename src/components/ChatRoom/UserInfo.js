import React from 'react';
import { Button, Avatar, Typography } from 'antd';
import styled from 'styled-components';

import { auth } from '../../firebase/config';
import { AuthContext } from '../../context/authProvider';
import { AppContext } from '../../context/appProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
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
      <div>
        <Avatar src={photoURL}>
          {photoURL ? '' : displayName ? displayName.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Typography.Text className='username'>{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={handleLogout}>
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}
