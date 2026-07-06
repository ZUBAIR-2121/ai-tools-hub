import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

// ── Global styles (ALL-IN-ONE — no other CSS imports needed anywhere) ──
import './styles/global.css';
import './components/Components.css';   // Modal, Footer, AIChatbot
import './pages/AllPages.css';          // Auth, Tour, Profile, Compare, Saved, Roadmaps, News

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function BackButtonGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handle = () => {
      if (location.pathname === '/') window.history.pushState(null, '', window.location.href);
      else navigate(-1);
    };
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
  }, [location.pathname, navigate]);
  return null;
}

function Layout() {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);
  return (
    <>
      <ScrollToTop />
      <BackButtonGuard />
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/profile"   element={<Profile />} />
        <Route path="/saved"     element={<Saved />} />
        <Route path="/compare"   element={<Compare />} />
        <Route path="/roadmaps"  element={<Roadmaps />} />
        <Route path="/news"      element={<News />} />
        <Route path="*"          element={<Home />} />
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
