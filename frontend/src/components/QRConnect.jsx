import { useState } from "react";

export default function QRConnect({ qrCode, pairingCode, loading, error, onRequestPairing }) {
  const [tab,   setTab]   = useState("qr");
  const [phone, setPhone] = useState("");
  const [err,   setErr]   = useState("");

  const handlePairing = async () => {
    if (!phone.trim()) return setErr("Veuillez entrer votre numéro de téléphone");
    setErr("");
    await onRequestPairing(phone.trim());
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 20px", background: "var(--gray-50)",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp 0.5s var(--ease)" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "16px", margin: "0 auto 16px", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", boxShadow: "0 8px 24px rgba(37,211,102,0.25)" }} />
        <h1 style={{ fontFamily: "var(--font-d)", fontSize: "26px", fontWeight: 800, color: "var(--gray-900)", letterSpacing: "-0.5px", marginBottom: "4px" }}>
          WA<span style={{ color: "var(--green)" }}>Bulk</span> Sender
        </h1>
        <p style={{ color: "var(--gray-500)", fontSize: "13px" }}>Connectez votre WhatsApp pour commencer</p>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: "420px", background: "var(--white)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", overflow: "hidden", animation: "fadeUp 0.5s 0.1s var(--ease) both" }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--gray-100)" }}>
          {[{ id: "qr", label: "QR Code" }, { id: "pairing", label: "Code pairage" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "15px 12px", fontFamily: "var(--font-d)", fontWeight: tab === t.id ? 700 : 500, fontSize: "13px", color: tab === t.id ? "var(--green)" : "var(--gray-400)", background: "transparent", borderBottom: tab === t.id ? "2px solid var(--green)" : "2px solid transparent", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "28px 32px 32px" }}>

          {/* ── Onglet QR Code ── */}
          {tab === "qr" && (
            <div>
              {/* QR affiché */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--white)", border: "1.5px solid var(--gray-200)", borderRadius: "var(--radius-sm)", padding: "20px", minHeight: "220px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {qrCode ? (
                  <div style={{ textAlign: "center" }}>
                    <img src={qrCode} alt="QR Code" width={190} height={190} style={{ display: "block", borderRadius: "6px" }} />
                    <p style={{ color: "var(--gray-400)", fontSize: "11px", marginTop: "10px" }}>Se rafraîchit automatiquement</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "36px", height: "36px", border: "3px solid var(--gray-200)", borderTop: "3px solid var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                    <p style={{ color: "var(--gray-400)", fontSize: "13px" }}>Génération du QR code...</p>
                  </div>
                )}
              </div>

              {/* Étapes QR */}
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--gray-500)", fontFamily: "var(--font-d)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                Comment scanner
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Ouvre WhatsApp sur ton téléphone",
                  "Va dans Paramètres → Appareils liés",
                  "Appuie sur Lier un appareil",
                  "Pointe la caméra vers le QR code ci-dessus",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "var(--white)", borderRadius: "var(--radius-xs)", boxShadow: "0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 800, fontFamily: "var(--font-d)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--gray-700)", fontWeight: i === 3 ? 600 : 400 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Onglet Code pairage ── */}
          {tab === "pairing" && (
            <div>
              {(err || error) && (
                <div style={{ background: "var(--red-light)", border: "1px solid #FECACA", borderRadius: "var(--radius-xs)", padding: "10px 14px", color: "var(--red)", fontSize: "13px", marginBottom: "14px" }}>
                  {err || error}
                </div>
              )}

              {/* Formulaire numéro */}
              {!pairingCode && (
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--gray-700)", fontFamily: "var(--font-d)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Numéro de téléphone
                  </label>
                  <input
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePairing()}
                    placeholder="Ex: 221785411482"
                    style={{ width: "100%", padding: "12px 14px", background: "var(--gray-50)", border: "1.5px solid var(--gray-200)", borderRadius: "var(--radius-sm)", color: "var(--gray-900)", fontSize: "15px", marginBottom: "12px", transition: "border-color 0.2s, box-shadow 0.2s" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--green)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,211,102,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "var(--gray-200)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button onClick={handlePairing} disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "var(--gray-200)" : "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", color: loading ? "var(--gray-400)" : "white", borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-d)", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: loading ? "none" : "0 4px 14px rgba(37,211,102,0.3)" }}>
                    {loading ? "Génération en cours..." : "Obtenir le code"}
                  </button>
                </div>
              )}

              {/* Code généré */}
              {pairingCode && (
                <div style={{ fontFamily: "var(--font-d)", fontSize: "38px", fontWeight: 800, letterSpacing: "8px", color: "var(--green)", background: "var(--white)", borderRadius: "var(--radius-sm)", padding: "24px", marginBottom: "20px", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)", border: "none" }}>
                  {pairingCode}
                </div>
              )}

              {/* Étapes pairage — toujours visibles */}
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--gray-500)", fontFamily: "var(--font-d)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                Comment saisir le code
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Ouvre WhatsApp sur ton téléphone",
                  "Va dans Paramètres → Appareils liés",
                  "Appuie sur Lier un appareil",
                  "Choisis Lier avec un numéro et saisis le code",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "var(--white)", borderRadius: "var(--radius-xs)", boxShadow: "0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 800, fontFamily: "var(--font-d)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--gray-700)", fontWeight: i === 3 ? 600 : 400 }}>{step}</span>
                  </div>
                ))}
              </div>

              {pairingCode && (
                <p style={{ fontSize: "12px", color: "var(--gray-400)", marginTop: "12px", textAlign: "center" }}>
                  Le code expire dans <strong style={{ color: "var(--gray-600)" }}>60 secondes</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={{ marginTop: "20px", color: "var(--gray-400)", fontSize: "11px" }}>
        Connexion sécurisée ! vos données restent sur votre appareil !
      </p>
    </div>
  );
}