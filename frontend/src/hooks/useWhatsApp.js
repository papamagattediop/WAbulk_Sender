import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useWhatsApp = () => {
  const [status,      setStatus]      = useState({ connected: false });
  const [qrCode,      setQrCode]      = useState(null);
  const [pairingCode, setPairingCode] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/status");
      setStatus(data);
      if (data.connected) { setQrCode(null); setPairingCode(null); }
    } catch (_) {}
  }, []);

  const fetchQR = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/qr");
      if (data.qr) setQrCode(data.qr);
    } catch (_) {}
  }, []);

  const requestPairing = useCallback(async (numero) => {
    setLoading(true);
    setError("");
    setPairingCode(null);
    try {
      const { data } = await axios.post("/api/pairing", { numero });
      if (data.code) setPairingCode(data.code);
    } catch (e) {
      setError(e.response?.data?.error || "Erreur — réessayez");
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await axios.post("/api/disconnect");
      setStatus({ connected: false });
      setQrCode(null);
      setPairingCode(null);
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchQR();
    intervalRef.current = setInterval(() => {
      fetchStatus();
      fetchQR();
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [fetchStatus, fetchQR]);

  return { status, qrCode, pairingCode, loading, error, requestPairing, disconnect };
};