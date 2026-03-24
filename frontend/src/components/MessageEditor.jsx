const TAGS = [{ tag: "{{nom}}", label: "Nom" }, { tag: "{{numero}}", label: "Numéro" }];

export default function MessageEditor({ message, onChange, firstContact }) {
  const preview = firstContact
    ? message.replace(/\{\{nom\}\}/g, firstContact.nom).replace(/\{\{numero\}\}/g, firstContact.numero)
    : message;

  return (
    <div style={{ marginBottom: "28px" }}>
      <StepLabel number="2">Rédiger le message</StepLabel>
      <div style={{ background: "var(--white)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--gray-200)", overflow: "hidden", boxShadow: "var(--shadow-sm)", transition: "border-color 0.2s, box-shadow 0.2s" }}
        onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,211,102,0.08)"; }}
        onBlurCapture={(e)  => { e.currentTarget.style.borderColor = "var(--gray-200)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", borderBottom: "1px solid var(--gray-100)", background: "var(--gray-50)", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--gray-500)", fontWeight: 600 }}>Variables :</span>
          {TAGS.map(({ tag, label }) => (
            <button key={tag} onClick={() => onChange(message + tag)} style={{ background: "var(--white)", border: "1.5px solid var(--green-light)", borderRadius: "99px", padding: "3px 10px", fontSize: "12px", color: "var(--green-dark)", cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-b)", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--green-bg)"; e.currentTarget.style.borderColor = "var(--green)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--white)"; e.currentTarget.style.borderColor = "var(--green-light)"; }}
            >{tag}</button>
          ))}
        </div>

        <textarea value={message} onChange={(e) => onChange(e.target.value)}
          placeholder="Bonjour {{nom}}, nous vous contactons pour vous informer de..."
          rows={6} style={{ width: "100%", padding: "16px", background: "var(--white)", color: "var(--gray-900)", fontSize: "14px", lineHeight: 1.7, resize: "vertical", minHeight: "140px", outline: "none", border: "none" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderTop: "1px solid var(--gray-100)", background: "var(--gray-50)" }}>
          <span style={{ fontSize: "11px", color: "var(--gray-400)" }}>
            Utilisez <code style={{ fontFamily: "monospace", background: "var(--green-bg)", color: "var(--green-dark)", padding: "0 4px", borderRadius: "3px" }}>{"{{nom}}"}</code> pour personnaliser chaque message
          </span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: message.length > 1000 ? "var(--red)" : "var(--gray-400)" }}>
            {message.length}/1000
          </span>
        </div>
      </div>

      {message && firstContact && (
        <div style={{ marginTop: "12px", background: "var(--white)", border: "1.5px solid var(--green-light)", borderRadius: "var(--radius-sm)", overflow: "hidden", animation: "fadeIn 0.3s var(--ease)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ padding: "9px 14px", background: "var(--green-bg)", borderBottom: "1px solid var(--green-light)" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--green-dark)", fontFamily: "var(--font-d)" }}>
              Aperçu — {firstContact.nom}
            </span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "inline-block", background: "var(--green-light)", borderRadius: "0 12px 12px 12px", padding: "10px 14px", maxWidth: "85%", fontSize: "14px", color: "var(--gray-900)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {preview}
            </div>
          </div>
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