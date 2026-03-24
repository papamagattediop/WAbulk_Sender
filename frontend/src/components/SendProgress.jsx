export default function SendProgress({ sending, progress, total, report }) {
  if (!sending && !report) return null;
  const sent   = progress.filter((p) => p.status === "sent").length;
  const failed = progress.filter((p) => p.status === "failed").length;
  const pct    = total > 0 ? Math.round((progress.length / total) * 100) : 0;

  return (
    <div style={{ marginBottom: "24px", animation: "fadeUp 0.3s var(--ease)" }}>
      {sending && (
        <div style={{ background: "var(--white)", border: "1.5px solid var(--green-light)", borderRadius: "var(--radius-sm)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "16px", height: "16px", border: "2.5px solid var(--green-light)", borderTop: "2.5px solid var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontWeight: 700, color: "var(--gray-900)", fontFamily: "var(--font-d)", fontSize: "14px" }}>Envoi en cours</span>
            </div>
            <span style={{ fontFamily: "var(--font-d)", fontWeight: 800, color: "var(--green)", fontSize: "18px" }}>{pct}%</span>
          </div>
          <div style={{ background: "var(--gray-100)", borderRadius: "99px", height: "6px", overflow: "hidden", marginBottom: "10px" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--green) 0%, var(--green-dark) 100%)", borderRadius: "99px", transition: "width 0.5s var(--ease)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
            <span style={{ color: "var(--gray-500)" }}>{progress.length} / {total} traités</span>
            <div style={{ display: "flex", gap: "14px" }}>
              <span style={{ color: "var(--green-dark)", fontWeight: 600 }}>{sent} envoyés</span>
              {failed > 0 && <span style={{ color: "var(--red)", fontWeight: 600 }}>{failed} échecs</span>}
            </div>
          </div>
        </div>
      )}

      {report && (
        <div style={{ background: "var(--white)", border: "1.5px solid var(--green-light)", borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "var(--shadow-md)", animation: "fadeUp 0.4s var(--ease)" }}>
          <div style={{ background: "linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)", padding: "14px 20px" }}>
            <span style={{ fontFamily: "var(--font-d)", fontWeight: 700, color: "white", fontSize: "14px" }}>Rapport d'envoi</span>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: report.errors?.length ? "16px" : "0" }}>
              <StatCard num={report.sent}   label="Envoyés" color="green" />
              <StatCard num={report.failed} label="Échecs"  color="red"   />
            </div>
            {report.errors?.length > 0 && (
              <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: "14px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--gray-500)", fontFamily: "var(--font-d)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Détail des échecs</p>
                {report.errors.map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--red-light)", borderRadius: "var(--radius-xs)", marginBottom: "6px" }}>
                    <span style={{ color: "var(--gray-700)", fontSize: "13px" }}>{e.contact} ({e.numero})</span>
                    <span style={{ color: "var(--red)", fontSize: "12px" }}>{e.error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ num, label, color }) => (
  <div style={{ background: color === "green" ? "var(--green-bg)" : "var(--red-light)", border: `1.5px solid ${color === "green" ? "var(--green-light)" : "#FECACA"}`, borderRadius: "var(--radius-sm)", padding: "16px", textAlign: "center" }}>
    <div style={{ fontFamily: "var(--font-d)", fontSize: "36px", fontWeight: 800, color: color === "green" ? "var(--green-dark)" : "var(--red)", lineHeight: 1 }}>{num}</div>
    <div style={{ fontSize: "12px", color: "var(--gray-500)", marginTop: "6px", fontWeight: 600 }}>{label}</div>
  </div>
);