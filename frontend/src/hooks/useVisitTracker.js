import { useEffect, useRef } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SESSION_KEY = "veritech_session_id";
const SESSION_START_KEY = "veritech_session_start";

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem(SESSION_KEY, sid);
    sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
  }
  if (!sessionStorage.getItem(SESSION_START_KEY)) {
    sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
  }
  return sid;
}

export function useVisitTracker(path = "/") {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const sid = getSessionId();

    // record visit
    axios
      .post(`${API}/track/visit`, {
        session_id: sid,
        path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      })
      .catch(() => {});

    const sendHeartbeat = () => {
      const startMs = Number(sessionStorage.getItem(SESSION_START_KEY)) || Date.now();
      const duration = Math.floor((Date.now() - startMs) / 1000);
      const body = JSON.stringify({ session_id: sid, duration_seconds: duration, path });
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(`${API}/track/heartbeat`, blob);
      } else {
        axios.post(`${API}/track/heartbeat`, { session_id: sid, duration_seconds: duration, path }).catch(() => {});
      }
    };

    const interval = setInterval(sendHeartbeat, 30000);
    const onVisibility = () => { if (document.visibilityState === "hidden") sendHeartbeat(); };
    const onUnload = () => sendHeartbeat();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onUnload);
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onUnload);
      window.removeEventListener("beforeunload", onUnload);
      sendHeartbeat();
    };
  }, [path]);
}
