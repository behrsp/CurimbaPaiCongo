
import React from 'react';
import { View, User } from '../types';
import { APP_NAME } from '../constants';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setView, 
  user, 
  onLogout, 
  isSidebarOpen,
  setSidebarOpen 
}) => {
  // Sidebar items
  const menuItems = [
    { id: View.PROFILE, label: 'Meu Perfil', icon: 'fa-user' },
    { 
      id: View.REQUEST_PONTO, 
      label: user?.role === 'ADMIN' ? 'Pontos Solicitados' : 'Pedir um Ponto', 
      icon: 'fa-music' 
    },
    { id: View.HOUSE_PHOTOS, label: 'Fotos da Casa', icon: 'fa-camera-retro' },
    { id: View.CURIMBA_ARCHIVES, label: 'Arquivos Curimba', icon: 'fa-folder-open' },
    { id: View.CALENDAR, label: 'Calendário', icon: 'fa-calendar-days' },
    { id: View.MY_GUIDES, label: 'Meus Guias', icon: 'fa-hands-praying' },
  ];

  // Add Admin specific items
  if (user?.role === 'ADMIN') {
    menuItems.push({ id: View.MANAGE_MEMBERS, label: 'Gerenciar Membros', icon: 'fa-users-gear' });
  }

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out transform
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center justify-between px-6 py-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-900 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-crown"></i>
              </div>
              <span className="text-xl font-bold text-gray-800">{APP_NAME}</span>
            </div>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 mb-8">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                {user?.role}
              </div>
              <div className="text-sm font-bold text-gray-800 truncate">
                {user?.name}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-xl ${
                  activeView === item.id
                    ? 'bg-amber-900 text-white shadow-lg shadow-amber-200'
                    : 'text-gray-500 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <i className={`fas ${item.icon} w-5 mr-3`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 transition-colors rounded-xl hover:bg-red-50"
            >
              <i className="fas fa-sign-out-alt w-5 mr-3"></i>
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
