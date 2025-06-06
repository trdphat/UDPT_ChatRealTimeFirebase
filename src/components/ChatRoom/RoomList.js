import React, { useContext } from 'react';
import { Collapse, Typography, Button } from 'antd';
import styled from 'styled-components';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { AppContext } from '../../context/appProvider';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    background: transparent;
    border: none;
    margin-bottom: 8px;

    .ant-collapse-header {
      padding: 12px 16px !important;
      color: rgba(255, 255, 255, 0.9) !important;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      margin: 0 8px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .ant-collapse-arrow {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .ant-collapse-content {
      background: transparent;
      color: white;

      .ant-collapse-content-box {
        padding: 8px 0 0 0 !important;
      }
    }
  }
`;

const RoomListWrapper = styled.div`
  padding: 0 8px;
`;

const RoomItem = styled(Typography.Link)`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  margin: 0 -8px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  gap: 12px;

  .room-icon {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    .anticon {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }
  }

  .room-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 500;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    transform: translateX(4px);

    .room-icon {
      background: rgba(255, 255, 255, 0.12);

      .anticon {
        color: white;
        transform: scale(1.1);
      }
    }
  }

  &.active {
    background: rgba(255, 255, 255, 0.12);
    color: white;

    .room-icon {
      background: rgba(255, 255, 255, 0.15);

      .anticon {
        color: white;
      }
    }
  }
`;

const AddRoomButton = styled(Button)`
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 16px;
  margin: 16px 8px 8px;
  height: auto;
  width: calc(100% - 16px);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);

  .anticon {
    font-size: 16px;
  }

  &:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function RoomList() {
  const { rooms, setIsAddRoomVisible, selectedRoomId, setSelectedRoomId } =
    useContext(AppContext);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  return (
    <Collapse ghost defaultActiveKey={['1']}>
      <PanelStyled header="Danh sách các phòng" key="1">
        <RoomListWrapper>
          {rooms.map((room) => (
            <RoomItem
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={selectedRoomId === room.id ? 'active' : ''}
            >
              <div className="room-icon">
                <MessageOutlined />
              </div>
              <span className="room-name">{room.name}</span>
            </RoomItem>
          ))}
          <AddRoomButton
            type="text"
            icon={<PlusOutlined />}
            onClick={handleAddRoom}
          >
            Thêm phòng
          </AddRoomButton>
        </RoomListWrapper>
      </PanelStyled>
    </Collapse>
  );
}
