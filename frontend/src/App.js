import React, { useEffect } from 'react';
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

// ── Global custom cursor — runs once, works on every page ──
function GlobalCursor() {
  useEffect(() => {
    // Create cursor elements if they don't exist yet
    let cursor = document.getElementById('cursor');
    let ring   = document.getElementById('cursor-ring');

    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'cursor';
      document.body.appendChild(cursor);
    }
    if (!ring) {
      ring = document.createElement('div');
      ring.id = 'cursor-ring';
      document.body.appendChild(ring);
    }

    let ringX = 0, ringY = 0;
    let curX  = 0, curY  = 0;
    let raf;

    const onMove = (e) => {
      curX = e.clientX;
      curY = e.clientY;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
    };

    // Smooth ring follow via rAF
    const animate = () => {
      ringX += (curX - ringX) * 0.15;
      ringY += (curY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      raf = requestAnimationFrame(animate);
    };

    // Grow cursor on hover over clickable elements
    const onEnter = () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursor.style.opacity = '0.7';
      ring.style.width  = '52px';
      ring.style.height = '52px';
    };
    const onLeave = () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      cursor.style.opacity = '1';
      ring.style.width  = '36px';
      ring.style.height = '36px';
    };

    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    // Attach hover listeners to all interactive elements
    const attach = () => {
      document.querySelectorAll('a, button, input, textarea, select, [role="button"]')
        .forEach(el => {
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
    };
    attach();

    // Re-attach when DOM changes (new components mount)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return null; // renders nothing — cursor divs are in the DOM directly
}

function Layout() {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);
  return (
    <>
      <GlobalCursor />
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