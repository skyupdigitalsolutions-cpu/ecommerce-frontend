import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [msg, setMsg] = useState(null);

  const toast = useCallback((text) => {
    setMsg(text);
    window.clearTimeout(window.__toastT);
    window.__toastT = window.setTimeout(() => setMsg(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {msg && (
        <div className="toast-wrap">
          <div className="toast">{msg}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
