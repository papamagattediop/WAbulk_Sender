// ─────────────────────────────────────────
// ADAPTER — Change cette ligne pour swapper le backend WhatsApp
// Options disponibles :
//   "./wppconnect.js"   ← actif maintenant
//   "./baileys.js"      ← à créer si besoin
//   "./waha.js"         ← à créer si besoin
// ─────────────────────────────────────────
export { connect, disconnect, sendMessage, getStatus, getQRCode, getPairingCode }
  from "./wppconnect.js";