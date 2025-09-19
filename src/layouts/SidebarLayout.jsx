// src/layouts/SidebarLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import './SidebarLayout.css';


/**
 * 반응형 규칙
 * - window.innerWidth <= screen.width / 2  → 접힘(closed)
 * - window.innerWidth >  screen.width / 2  → 펼침(open)
 */
export default function SidebarLayout() {
  const [open, setOpen] = React.useState(true);
  

  React.useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const sw = window.screen?.width || vw;
      setOpen(vw > sw / 2);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div className={`app-shell ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* 좌측 사이드바 (open 상태 전달) */}
      <Sidebar open={open} />

      {/* 메인 컨텐츠 (사이드바 상태에 따라 그리드로 자연스럽게 밀림/확장) */}
      <main className="app-main">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}