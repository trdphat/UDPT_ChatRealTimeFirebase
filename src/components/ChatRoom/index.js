import React from 'react';
import { Row, Col } from 'antd';
import Sidebar from './SideBar';
import ChatWindow from './ChatWindow';

export default function ChatRoom() {
  return (
    <Row style={{ height: '100vh' }}>
      <Col span={6}>
        <Sidebar />
      </Col>
      <Col span={18}>
        <ChatWindow />
      </Col>
    </Row>
  );
}
