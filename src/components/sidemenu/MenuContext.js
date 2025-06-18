import { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState(() => {
    // First check sessionStorage
    const stored = sessionStorage.getItem('activeMenu');
    if (stored) return stored;

    // If not found, check URL param
    const params = new URLSearchParams(window.location.search);
    const menuFromURL = params.get('menu');
    if (menuFromURL) {
      sessionStorage.setItem('activeMenu', menuFromURL);
      return menuFromURL;
    }

    // Fallback default
    return 'oandm';
  });

  useEffect(() => {
    sessionStorage.setItem('activeMenu', activeMenu);
  }, [activeMenu]);

  return (
    <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
