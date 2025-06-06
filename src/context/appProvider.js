import React, { useState, useMemo, useContext, useEffect } from 'react';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from './authProvider';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const { user } = useContext(AuthContext);
  const uid = user?.uid || '';

  // Điều kiện truy vấn các room mà user là thành viên
  const roomsCondition = useMemo(() => {
    if (!uid) return null;
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);

  // Lấy danh sách rooms theo điều kiện
  const rooms = useFirestore('rooms', roomsCondition);

  // Tự động chọn phòng đầu tiên khi rooms load xong mà chưa có phòng nào được chọn
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  // Room đang được chọn
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  // Điều kiện truy vấn user là thành viên của room đang chọn
  const usersCondition = useMemo(() => {
    if (!selectedRoom.members || selectedRoom.members.length === 0) return null;
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore('users', usersCondition);

  const clearState = () => {
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
