import { useState, useRef } from "react";
import axios from "axios";

export default function UploadCSV({ onContacts }) {
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [file,     setFile]     = useState(null);
  const [count,    setCount]    = useState(0);
  const [error,    setError]    = useState("");
  const inputRef = useRef();

  const upload = async (f) => {
    if (!f) return;
    setLoading(true); setError("");
    const form = new FormData();
    form.append("file", f);
    try {
      const { data } = await axios.post("/api/upload", form);
      setFile(f.name); setCount(data.count);
      onContacts(data.contacts);
    } catch (e) {
      setError(e.response?.data?.error || "Erreur lors du parsing du fichier");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ marginBottom: "28px" }}>
      <StepLabel number="1">Importer les contacts</StepLabel>
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${dragging ? "var(--green)" : file ? "var(--green-light)" : "var(--gray-200)"}`,
          borderRadius: "var(--radius-sm)", padding: "32px 24px", textAlign: "center",
          cursor: loading ? "wait" : "pointer",
          background: dragging ? "var(--green-bg)" : file ? "var(--green-bg)" : "var(--white)",
          transition: "all 0.2s",
        }}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => upload(e.target.files[0])} />

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", border: "3px solid var(--gray-200)", borderTop: "3px solid var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "var(--gray-500)", fontSize: "14px" }}>Analyse en cours...</p>
          </div>
        ) : file ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{ fontWeight: 600, color: "var(--gray-900)", fontSize: "14px" }}>{file}</p>
            <span style={{ background: "var(--green)", color: "white", borderRadius: "99px", padding: "4px 14px", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-d)" }}>
              {count} contact{count > 1 ? "s" : ""} importés
            </span>
            <p style={{ color: "var(--gray-400)", fontSize: "12px" }}>Cliquer pour changer de fichier</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "var(--gray-900)", fontSize: "14px", marginBottom: "3px" }}>Glisser-déposer ou cliquer pour parcourir</p>
              <p style={{ color: "var(--gray-400)", fontSize: "13px" }}>CSV, Excel (.xlsx, .xls)</p>
            </div>
            <p style={{ color: "var(--gray-400)", fontSize: "12px" }}>
              Colonnes requises : <code style={{ color: "var(--green-dark)", background: "var(--green-bg)", padding: "1px 6px", borderRadius: "3px", fontFamily: "monospace" }}>nom</code> et <code style={{ color: "var(--green-dark)", background: "var(--green-bg)", padding: "1px 6px", borderRadius: "3px", fontFamily: "monospace" }}>numero</code>
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: "var(--red-light)", border: "1px solid #FECACA", borderRadius: "var(--radius-xs)", padding: "10px 14px", color: "var(--red)", fontSize: "13px", marginTop: "8px" }}>
          {error}
        </div>
      )}
    </div>
  );
}

const StepLabel = ({ number, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 800, fontFamily: "var(--font-d)", flexShrink: 0 }}>{number}</div>
    <span style={{ fontFamily: "var(--font-d)", fontSize: "14px", fontWeight: 700, color: "var(--gray-900)" }}>{children}</span>
  </div>
);