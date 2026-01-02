import { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close in 3 sec

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const inlineStyle = {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#16a34a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 10000,
  };

  return (
    <div style={inlineStyle} className="px-4 py-3">
      {message}
    </div>
  );
};

export default Toast;
