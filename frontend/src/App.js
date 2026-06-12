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
import './styles/global.css';

// ── Scroll to top on every route change ──────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ── Back button guard ─────────────────────────────────────────────────────────
// Pushes a dummy history entry on first load so the browser back button
// navigates within the app instead of closing the tab / going to a blank page.
function BackButtonGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Push a duplicate entry so there's always something to go back to
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // If we're already at root, push state again to prevent tab close
      if (location.pathname === '/') {
        window.history.pushState(null, '', window.location.href);
      } else {
        // Otherwise navigate back within the React app
        navigate(-1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, navigate]);

  return null;
}

// ── Layout ────────────────────────────────────────────────────────────────────
function Layout() {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <BackButtonGuard />
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
        {/* Catch-all — redirect unknown routes to home */}
        <Route path="*" element={<Home />} />
      </Routes>
      {!hideNav && <MobileBottomNav />}
      <PWAInstallBanner />
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
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