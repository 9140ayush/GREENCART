import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('gc-theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('gc-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gc-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex items-center w-[52px] h-[28px] rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-inner outline-none border-none group"
      style={{
        backgroundColor: theme === 'dark' ? '#166534' : '#e5e7eb',
      }}
    >
      {/* Moving Circle */}
      <div
        className="absolute w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-md"
        style={{
          left: '3px',
          top: '3px',
          transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0px)',
        }}
      >
        <span style={{ fontSize: '14px', filter: 'brightness(1.1)' }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </span>
      </div>
    </button>
  );
};

export default DarkModeToggle;
