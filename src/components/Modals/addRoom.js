import React, { useContext, useState } from 'react';
import { Form, Modal, Input, message } from 'antd';

import { AppContext } from '../../context/appProvider';
import { AuthContext } from '../../context/authProvider';
import { addDocument } from '../../firebase/services';

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const roomData = {
        ...values,
        members: [user.uid],
      };

      await addDocument('rooms', roomData);
      message.success('Tạo phòng thành công!');
      form.resetFields();
      setIsAddRoomVisible(false);
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsAddRoomVisible(false);
  };

  return (
    <Modal
      title="Tạo phòng"
      open={isAddRoomVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="add-room-form">
        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả (tùy chọn)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
