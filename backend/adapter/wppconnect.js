import wppconnect from "@wppconnect-team/wppconnect";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let client      = null;
let qrCodeB64   = null;
let pairingCode = null;
let connected   = false;
let codeSent    = false;

// ─────────────────────────────────────────
// Connexion
// ─────────────────────────────────────────
export const connect = async (mode = "qr", phoneNumber = null) => {
  // Ferme session existante
  if (client) {
    try { await client.close(); } catch (_) {}
    client = null;
  }

  connected   = false;
  qrCodeB64   = null;
  pairingCode = null;
  codeSent    = false;

  const options = {
    session        : "wa-bulk-session",
    headless       : true,
    autoClose      : 0,
    disableWelcome : true,
    logQR          : false,
    folderNameToken: path.join(__dirname, "../tokens"),
    puppeteerOptions: {
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
    },

    statusFind: (status) => {
      console.log("[WPPConnect] Status :", status);
      if (status === "isLogged" || status === "qrReadSuccess") {
        connected = true;
        qrCodeB64 = null;
        pairingCode = null;
        console.log("✅ WhatsApp connecté !");
      }
      if (status === "desconnectedMobile" || status === "browserClose") {
        connected = false;
        console.log("🔴 WhatsApp déconnecté");
      }
    },
  };

  // Mode QR
  if (mode === "qr") {
    options.catchQR = (base64Qr) => {
      qrCodeB64 = base64Qr;
      console.log("📱 QR Code prêt");
    };
  }

  // Mode Pairing Code
  if (mode === "pairing" && phoneNumber) {
    options.phoneNumber  = phoneNumber.replace(/\D/g, "");
    options.catchLinkCode = (code) => {
      if (codeSent) return;
      codeSent    = true;
      pairingCode = code;
      console.log("🔑 Pairing Code :", code);
    };
  }

  try {
    client = await wppconnect.create(options);
    connected = true;
    console.log("✅ WPPConnect prêt !");
  } catch (e) {
    console.error("❌ Erreur connexion :", e.message);
    connected = false;
  }
};

// ─────────────────────────────────────────
// Déconnexion
// ─────────────────────────────────────────
export const disconnect = async () => {
  if (client) {
    try { await client.logout(); } catch (_) {}
    try { await client.close(); }  catch (_) {}
    client    = null;
    connected = false;
    qrCodeB64 = null;
    pairingCode = null;
    console.log("👋 Déconnecté");
  }
};

// ─────────────────────────────────────────
// Envoi d'un message
// ─────────────────────────────────────────
export const sendMessage = async (numero, message) => {
  if (!client || !connected) throw new Error("WhatsApp non connecté");
  const jid = `${numero.replace(/\D/g, "")}@c.us`;
  await client.sendText(jid, message);
};

// ─────────────────────────────────────────
// Getters
// ─────────────────────────────────────────
export const getStatus      = () => ({ connected, message: connected ? "Connecté" : "Non connecté" });
export const getQRCode      = () => qrCodeB64;
export const getPairingCode = () => pairingCode;