import { UserAddOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert } from 'antd';
import Message from './Message';
import { AppContext } from '../../context/appProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/authProvider';
import useFirestore from '../../hooks/useFirestore';

const HeaderStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 64px;
  padding: 0 24px;
  align-items: center;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid #E4E6EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .header {
    &__info {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    &__title {
      margin: 0;
      font-weight: 600;
      font-size: 16px;
      color: #1a2942;
      letter-spacing: 0.2px;
    }

    &__description {
      font-size: 12px;
      color: #65676B;
      margin-top: 2px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  .ant-btn {
    color: #0084ff;
    border: 1px solid #0084ff;
    background: rgba(0, 132, 255, 0.05);
    border-radius: 8px;
    padding: 4px 16px;
    height: 36px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;

    &:hover {
      color: white;
      background: #0084ff;
      border-color: #0084ff;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 132, 255, 0.25);
    }

    &:active {
      transform: translateY(0);
      background: #0073e6;
      border-color: #0073e6;
    }

    .anticon {
      font-size: 16px;
    }
  }

  .ant-avatar-group {
    .ant-avatar {
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
      }
    }
  }
`;

const WrapperStyled = styled.div`
  height: 100vh;
  background: #FFFFFF;
`;

const ContentStyled = styled.div`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
  background: #FFFFFF;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #E4E6EB;
  border-radius: 24px;
  background: #F0F2F5;
  margin-top: 12px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
    margin-right: 8px;

    .ant-input {
      padding: 8px 12px;
      border: none;
      background: transparent;
      font-size: 14px;

      &:focus {
        box-shadow: none;
      }
    }
  }

  .ant-btn {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0084ff;
    border: none;

    &:hover {
      background: #0073e6;
    }

    svg {
      font-size: 18px;
    }
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });

    form.resetFields(['message']);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore('messages', condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className='header__info'>
              <p className='header__title'>{selectedRoom.name}</p>
              <span className='header__description'>
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                ghost
                icon={<UserAddOutlined />}
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size='small' maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ''
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                  uid={mes.uid}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Aa'
                  bordered={false}
                  autoComplete='off'
                />
              </Form.Item>
              <Button type='primary' onClick={handleOnSubmit} icon={<i className="fas fa-paper-plane" />} />
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
