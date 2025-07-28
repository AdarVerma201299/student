import { LogoutHandler } from "./utils/function";
let inactivityTimer;

export const startInactivityTimer = (
  dispatch,
  navigate,
  timeout = 30 * 60 * 1000
) => {
  // Set the timeout (default: 30 minutes)
  const logoutHandler = LogoutHandler(dispatch, navigate);

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutHandler, timeout);
  };

  // Events that reset the timer
  const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
  events.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });

  // Start the initial timer
  resetTimer();

  // Return cleanup function
  return () => {
    clearTimeout(inactivityTimer);
    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
  };
};
