import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarkProvider } from './context/BookmarkContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import PWAInstallBanner from './components/PWAInstallBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Saved from './pages/Saved/Saved';
import Compare from './pages/Compare/Compare';
import Roadmaps from './pages/Roadmaps/Roadmaps';
import News from './pages/News/News';
import './styles/global.css';



function Layout() {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);
  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/news" element={<News />} />
      </Routes>
      {!hideNav && <MobileBottomNav />}
      <PWAInstallBanner />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}