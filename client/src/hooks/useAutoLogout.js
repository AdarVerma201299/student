// hooks/useAutoLogout.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { API } from "../redux/api/utils";

const useAutoLogout = (timeout = 25 * 60 * 1000) => {
  // 25 minutes (refresh at 25, expire at 30)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    let refreshInterval;
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(logout());
        localStorage.clear();
        navigate("/login");
      }, timeout);
    };

    const refreshToken = async () => {
      try {
        await API.post("/auth/refresh-token");
        resetTimer();
      } catch (err) {
        dispatch(logout());
        navigate("/");
      }
    };

    resetTimer();
    refreshInterval = setInterval(refreshToken, 25 * 60 * 1000);
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    return () => {
      clearTimeout(timer);
      clearInterval(refreshInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [dispatch, navigate, timeout]);
};

export default useAutoLogout;
