import React, { createContext, useContext, useState } from 'react';
import Toaster from './Toaster';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
  };

  const handleClose = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toaster
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
};
export default ToastContext;