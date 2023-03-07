import { Route, Routes, BrowserRouter as Router, BrowserRouter, } from 'react-router-dom';
import { Chat, Status } from '@/pages';

export const AppRoutes = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Status />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};