import { useState } from "react";
import { useWhatsApp }  from "./hooks/useWhatsApp";
import QRConnect        from "./components/QRConnect";
import UploadCSV        from "./components/UploadCSV";
import MessageEditor    from "./components/MessageEditor";
import ContactTable     from "./components/ContactTable";
import SendProgress     from "./components/SendProgress";

export default function App() {
  const { status, qrCode, pairingCode, loading, error, requestPairing, disconnect } = useWhatsApp();
  const [contacts, setContacts] = useState([]);
  const [message,  setMessage]  = useState("");
  const [delay,    setDelay]    = useState(4000);
  const [sending,  setSending]  = useState(false);
  const [progress, setProgress] = useState([]);
  const [report,   setReport]   = useState(null);

  if (!status.connected) {
    return <QRConnect qrCode={qrCode} pairingCode={pairingCode} loading={loading} error={error} onRequestPairing={requestPairing} />;
  }

  const canSend = contacts.length > 0 && message.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true); setProgress([]); setReport(null);
    try {
      const res = await fetch("/api/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contacts, template: message, delay }) });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter((l) => l.startsWith("data:"));
        for (const line of lines) {
          const data = JSON.parse(line.slice(6));
          if (data.type === "progress") setProgress((p) => [...p, data]);
          if (data.type === "done")     setReport(data.report);
        }
      }
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const steps = [contacts.length > 0, message.trim().length > 0];
  const completedSteps = steps.filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--gray-50)" }}>
      {/* Header */}
      <header style={{ background: "var(--white)", borderBottom: "1px solid var(--gray-200)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }} />
          <span style={{ fontFamily: "var(--font-d)", fontSize: "17px", fontWeight: 800, color: "var(--gray-900)" }}>
            WA<span style={{ color: "var(--green)" }}>Bulk</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--gray-400)" }}>Progression</span>
            <div style={{ width: "80px", height: "4px", background: "var(--gray-200)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(completedSteps / 2) * 100}%`, background: "var(--green)", borderRadius: "99px", transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: "11px", color: "var(--gray-400)", fontWeight: 600 }}>{completedSteps}/2</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green-bg)", border: "1px solid var(--green-light)", borderRadius: "99px", padding: "5px 12px", fontSize: "12px", color: "var(--green-dark)", fontWeight: 600 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
            Connecté
          </div>

          <button onClick={disconnect} style={{ background: "var(--white)", border: "1.5px solid var(--gray-200)", color: "var(--gray-500)", borderRadius: "var(--radius-xs)", padding: "6px 12px", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-d)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "var(--red-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gray-200)"; e.currentTarget.style.color = "var(--gray-500)"; e.currentTarget.style.background = "var(--white)"; }}
          >Déconnecter</button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ marginBottom: "32px", animation: "fadeUp 0.4s var(--ease)" }}>
          <h1 style={{ fontFamily: "var(--font-d)", fontSize: "24px", fontWeight: 800, color: "var(--gray-900)", lineHeight: 1.2, marginBottom: "6px" }}>
            Envoi massif <span style={{ color: "var(--green)" }}>WhatsApp</span>
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: "14px" }}>
            Importez vos contacts, rédigez votre message et envoyez avec personnalisation automatique.
          </p>
        </div>

        <UploadCSV     onContacts={setContacts} />
        <MessageEditor message={message} onChange={setMessage} firstContact={contacts[0]} />
        <ContactTable  contacts={contacts} progress={progress} />

        {contacts.length > 0 && message && !report && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--white)", border: "1.5px solid var(--gray-200)", borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: "20px", boxShadow: "var(--shadow-sm)" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "13px", color: "var(--gray-900)", marginBottom: "2px" }}>Délai entre les messages</p>
              <p style={{ fontSize: "11px", color: "var(--gray-400)" }}>Recommandé pour éviter le blocage par WhatsApp</p>
            </div>
            <select value={delay} onChange={(e) => setDelay(Number(e.target.value))} style={{ background: "var(--gray-50)", border: "1.5px solid var(--gray-200)", borderRadius: "var(--radius-xs)", padding: "7px 12px", color: "var(--gray-900)", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-d)", cursor: "pointer" }}>
              <option value={2000}>2 secondes</option>
              <option value={4000}>4 secondes</option>
              <option value={6000}>6 secondes</option>
              <option value={10000}>10 secondes</option>
            </select>
          </div>
        )}

        <SendProgress sending={sending} progress={progress} total={contacts.length} report={report} />

        {!report ? (
          <button onClick={handleSend} disabled={!canSend} style={{ width: "100%", padding: "15px", background: canSend ? "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)" : "var(--gray-100)", color: canSend ? "white" : "var(--gray-400)", borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: "15px", fontFamily: "var(--font-d)", cursor: canSend ? "pointer" : "not-allowed", transition: "all 0.25s", boxShadow: canSend ? "0 4px 18px rgba(37,211,102,0.3)" : "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
            onMouseEnter={(e) => canSend && (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {sending ? (
              <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Envoi en cours... ({progress.length}/{contacts.length})</>
            ) : contacts.length > 0 ? (
              `Envoyer à ${contacts.length} contact${contacts.length > 1 ? "s" : ""}`
            ) : (
              "Importez des contacts pour commencer"
            )}
          </button>
        ) : (
          <button onClick={() => { setReport(null); setProgress([]); setContacts([]); setMessage(""); }} style={{ width: "100%", padding: "14px", background: "var(--white)", color: "var(--green-dark)", border: "2px solid var(--green)", borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-d)", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--green-bg)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--white)"}
          >Nouvel envoi</button>
        )}

        <p style={{ textAlign: "center", color: "var(--gray-400)", fontSize: "11px", marginTop: "20px" }}>
          Connexion sécurisée · WA Bulk Sender v2.0
        </p>
      </main>
    </div>
  );
}