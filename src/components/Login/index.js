import React, { useState, useCallback } from 'react';
import { Row, Col, Button, Typography, message } from 'antd';
import styled from 'styled-components';
import { signInWithPopup } from 'firebase/auth';
import { GoogleOutlined, FacebookFilled } from '@ant-design/icons';

import { auth, googleProvider, fbProvider } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;

const LoginWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const AppTitle = styled(Title)`
  && {
    color: #1a2942;
    margin-bottom: 8px;
    font-size: 24px;
  }
`;

const AppSubtitle = styled(Title)`
  && {
    color: #65676B;
    margin-bottom: 32px;
    font-size: 16px;
    font-weight: normal;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 46px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  .anticon {
    font-size: 20px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GoogleButton = styled(StyledButton)`
  && {
    background-color: #f3f4f6;
    color: #1a2942;
    border: 1px solid #e4e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      background-color: #e5e7eb;
      border-color: #d1d5db;
      color: #1a2942;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .anticon {
      color: #db4437;
    }
  }
`;

const FacebookButton = styled(StyledButton)`
  && {
    background-color: #0084ff;
    color: white;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 132, 255, 0.2);

    &:hover {
      background-color: #0073e6;
      color: white;
    }
  }
`;

const AppLogo = styled.div`
  width: 64px;
  height: 64px;
  background: #1a2942;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 4px 12px rgba(26, 41, 66, 0.1);

  &:before {
    content: "💬";
    font-size: 32px;
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

      message.success(`Đăng nhập thành công!`);
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <LoginContainer>
      <LoginWrapper>
        <AppLogo />
        <AppTitle level={3}>Ứng dụng phân tán - Nhóm 05</AppTitle>
        <AppSubtitle level={5}>
          Firebase Chat Realtime Demo 🚀
        </AppSubtitle>

        <GoogleButton
          onClick={() => handleLogin(googleProvider)}
          loading={loading}
          disabled={loading}
          icon={<GoogleOutlined />}
        >
          Đăng nhập bằng Google
        </GoogleButton>

        <FacebookButton
          onClick={() => handleLogin(fbProvider)}
          loading={loading}
          disabled={loading}
          icon={<FacebookFilled />}
        >
          Đăng nhập bằng Facebook
        </FacebookButton>
      </LoginWrapper>
    </LoginContainer>
  );
}
