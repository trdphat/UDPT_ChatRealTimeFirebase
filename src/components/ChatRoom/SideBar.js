import React from 'react';
import { Row, Col } from 'antd';
import UserInfo from './UserInfo';
import RoomList from './RoomList';
import styled from 'styled-components';

const SidebarStyled = styled.div`
  background: linear-gradient(180deg, #1a2942 0%, #0f1724 100%);
  color: white;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.15);
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const SidebarContent = styled.div`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default function Sidebar() {
  return (
    <SidebarStyled>
      <SidebarContent>
        <Row>
          <Col span={24}>
            <UserInfo />
          </Col>
          <Col span={24}>
            <RoomList />
          </Col>
        </Row>
      </SidebarContent>
    </SidebarStyled>
  );
}
