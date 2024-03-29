import { useState } from "react";
import styles from "./Toast.module.css";
import PropTypes from "prop-types";
import { capitalize } from "../../components/utils/text-manipulation";
import info from "@assets/info.svg";
import success from "@assets/success.svg";
import warning from "@assets/warning.svg";
import close from "@assets/close.svg"
import { ToastContext } from "../../Contexts";

export const ToastProvider = ({ children }) => {

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", options = {}) => {
    const { duration = 5000 } = options;
    const toast = {
      id: Date.now(),
      message,
      type,
      duration
    };

    setToasts([...toasts, toast]);

    setTimeout(() => {
      removeToast(toast.id)
    }, duration)

  };

  const removeToast = (id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  const setIcons = (type) => {
    const icons = [
      info,
      success,
      warning,
      close
    ]
    if (type === "info") {
      return icons[0];
    } else if (type === "success") {
      return icons[1];
    } else if (type === "warning") {
      return icons[2];
    }
    return icons[3];
  }

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[`toast-${toast.type}`]}`}>
            <div className={styles.toastHeader}>
              <h4>{capitalize(toast.type)}</h4>
              <img src={setIcons(toast.type)} onClick={() => removeToast(toast.id)}></img>
            </div>
            <div>
              <p>{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}


ToastProvider.propTypes = {
  children: PropTypes.node
}
