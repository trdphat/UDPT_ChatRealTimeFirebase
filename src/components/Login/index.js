import React, { useState, useCallback } from 'react';
import { Row, Col, Button, Typography, message } from 'antd';
import styled from 'styled-components';
import { signInWithPopup } from 'firebase/auth';

import { auth, googleProvider, fbProvider } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;

const LoginWrapper = styled.div`
  background: #f0f5ff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 12px;
  border: none;

  &:last-child {
    margin-bottom: 0;
  }
`;

const GoogleButton = styled(StyledButton)`
  background-color: #db4437;
  color: white;

  &:hover {
    background-color: #c33c2e;
    color: white;
  }
`;

const FacebookButton = styled(StyledButton)`
  background-color: #4267b2;
  color: white;

  &:hover {
    background-color: #365899;
    color: white;
  }
`;

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      if (result._tokenResponse?.isNewUser) {
        await addDocument('users', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: provider.providerId,
          keywords: generateKeywords(user.displayName?.toLowerCase()),
        });
      }

      message.success(`Đăng nhập thành công với ${provider.providerId}`);
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col span={8}>
        <LoginWrapper>
          <Title level={3}>Ứng dụng phân tán - Nhóm 05</Title>
          <Title level={5} style={{ color: '#555', marginBottom: 24 }}>
            Firebase Chat Realtime Demo 🚀
          </Title>

          <GoogleButton
            onClick={() => handleLogin(googleProvider)}
            loading={loading}
            disabled={loading}
          >
            Đăng nhập bằng Google
          </GoogleButton>

          <FacebookButton
            onClick={() => handleLogin(fbProvider)}
            loading={loading}
            disabled={loading}
          >
            Đăng nhập bằng Facebook
          </FacebookButton>
        </LoginWrapper>
      </Col>
    </Row>
  );
}
