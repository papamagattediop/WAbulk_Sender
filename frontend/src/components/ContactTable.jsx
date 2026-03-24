export default function ContactTable({ contacts, progress }) {
  if (!contacts.length) return null;
  const getStatus = (c) => progress.find((p) => p.numero === c.numero)?.status || null;
  const sent   = progress.filter((p) => p.status === "sent").length;
  const failed = progress.filter((p) => p.status === "failed").length;

  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <StepLabel number="3">Contacts</StepLabel>
        <div style={{ display: "flex", gap: "6px" }}>
          <Badge color="green">{contacts.length} total</Badge>
          {sent > 0   && <Badge color="green">{sent} envoyés</Badge>}
          {failed > 0 && <Badge color="red">{failed} échecs</Badge>}
        </div>
      </div>

      <div style={{ background: "var(--white)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--gray-200)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ maxHeight: "260px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--gray-50)" }}>
                {["#", "Nom", "Numéro", "Statut"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--gray-500)", fontFamily: "var(--font-d)", borderBottom: "1.5px solid var(--gray-200)", position: "sticky", top: 0, background: "var(--gray-50)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => {
                const st = getStatus(c);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid var(--gray-100)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-50)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 14px", color: "var(--gray-400)", fontSize: "12px", fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 500, color: "var(--gray-900)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                          {c.nom.charAt(0).toUpperCase()}
                        </div>
                        {c.nom}
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", color: "var(--gray-500)", fontFamily: "monospace", fontSize: "13px" }}>{c.numero}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {st === "sent" ? (
                        <span style={{ background: "var(--green-bg)", color: "var(--green-dark)", borderRadius: "99px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>Envoyé</span>
                      ) : st === "failed" ? (
                        <span style={{ background: "var(--red-light)", color: "var(--red)", borderRadius: "99px", padding: "3px 10px", fontSize: "12px", fontWeight: 600 }}>Échec</span>
                      ) : (
                        <span style={{ color: "var(--gray-400)", fontSize: "12px" }}>En attente</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StepLabel = ({ number, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 800, fontFamily: "var(--font-d)", flexShrink: 0 }}>{number}</div>
    <span style={{ fontFamily: "var(--font-d)", fontSize: "14px", fontWeight: 700, color: "var(--gray-900)" }}>{children}</span>
  </div>
);

const Badge = ({ color, children }) => (
  <span style={{ background: color === "green" ? "var(--green-bg)" : "var(--red-light)", border: `1px solid ${color === "green" ? "var(--green-light)" : "#FECACA"}`, color: color === "green" ? "var(--green-dark)" : "var(--red)", borderRadius: "99px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-d)" }}>{children}</span>
);