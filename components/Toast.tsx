import React from 'react';

interface ToastProps {
  message: string;
  type?: 'normal' | 'achievement';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'normal' }) => {
  const isAchievement = type === 'achievement';
  
  const containerClasses = isAchievement
    ? "bg-gradient-to-r from-yellow-500 to-amber-500 achievement-toast-in-out"
    : "bg-gradient-to-r from-green-500 to-teal-500 animate-toast-in-out";
  
  const icon = isAchievement ? "fas fa-trophy" : "fas fa-check-circle";

  return (
    <div className={`fixed bottom-12 right-5 text-white py-3 px-6 rounded-lg shadow-lg z-50 font-semibold flex items-center gap-3 ${containerClasses}`}>
      <i className={`${icon} text-xl`}></i>
      <div>
        {isAchievement && <div className="text-xs font-bold uppercase tracking-wider">Conquista Desbloqueada!</div>}
        {message}
      </div>
    </div>
  );
};
