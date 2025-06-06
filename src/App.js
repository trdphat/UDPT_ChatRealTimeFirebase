import 'antd/dist/reset.css';
import './App.css';
import Login from './components/Login';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './context/authProvider';
import AppProvider from './context/appProvider';
import AddRoom from './components/Modals/addRoom';
import InviteMem from './components/Modals/inviteMem';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ChatRoom />} />
          </Routes>
          <AddRoom />
          <InviteMem />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
