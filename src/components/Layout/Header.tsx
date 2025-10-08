import React from 'react';
import { Menu, Bell, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { logout } = useAuth();

  return (
    <header 
      className="shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl"
      style={{ 
        background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.95), rgba(35, 39, 41, 0.95))',
        borderColor: 'rgba(120, 120, 120, 0.3)'
      }}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: 'rgba(80, 80, 80, 0.2)',
            border: '1px solid rgba(120, 120, 120, 0.3)'
          }}
        >
          <Menu className="w-5 h-5" style={{ color: '#c0c0c0' }} />
        </button>
        <h1 className="text-xl font-heading" style={{ color: '#c0c0c0' }}>{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 rounded-lg transition-all duration-300 hover:scale-110 relative"
          style={{ 
            backgroundColor: 'rgba(80, 80, 80, 0.2)',
            border: '1px solid rgba(120, 120, 120, 0.3)'
          }}
        >
          <Bell className="w-5 h-5" style={{ color: '#c0c0c0' }} />
          <span 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#c08080' }}
          ></span>
        </button>
        
        <button 
          className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: 'rgba(80, 80, 80, 0.2)',
            border: '1px solid rgba(120, 120, 120, 0.3)'
          }}
        >
          <Settings className="w-5 h-5" style={{ color: '#c0c0c0' }} />
        </button>
        
        <button 
          className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: 'rgba(80, 80, 80, 0.2)',
            border: '1px solid rgba(120, 120, 120, 0.3)'
          }}
        >
          <User className="w-5 h-5" style={{ color: '#c0c0c0' }} />
        </button>

        <button 
          onClick={logout}
          className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: 'rgba(200, 80, 80, 0.2)',
            border: '1px solid rgba(200, 100, 100, 0.3)'
          }}
          title="Выйти"
        >
          <LogOut className="w-5 h-5" style={{ color: '#c08080' }} />
        </button>
      </div>
    </header>
  );
};
