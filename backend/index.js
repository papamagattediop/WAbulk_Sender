import express  from "express";
import cors     from "cors";
import multer   from "multer";
import path     from "path";
import dotenv   from "dotenv";
import { fileURLToPath } from "url";

import { connect, disconnect, sendMessage, getStatus, getQRCode, getPairingCode } from "./adapter/adapter_index.js";
import { parseFile } from "./parser.js";
import { SendQueue } from "./queue.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Upload fichiers
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

// ─────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────
// STATUT WHATSAPP
// ─────────────────────────────────────────
app.get("/api/status", (req, res) => {
  res.json(getStatus());
});

// ─────────────────────────────────────────
// QR CODE
// ─────────────────────────────────────────
app.get("/api/qr", (req, res) => {
  const qr = getQRCode();
  res.json({ qr: qr || null });
});

// ─────────────────────────────────────────
// PAIRING CODE
// ─────────────────────────────────────────
app.post("/api/pairing", async (req, res) => {
  const { numero } = req.body;
  if (!numero) return res.status(400).json({ error: "numero requis" });

  // Démarre en mode pairing
  connect("pairing", numero).catch(console.error);

  // Attend le code (max 15s)
  let attempts = 0;
  while (!getPairingCode() && attempts < 30) {
    await sleep(500);
    attempts++;
  }

  const code = getPairingCode();
  if (!code) return res.status(504).json({ error: "Code non généré, réessayez" });

  res.json({ code });
});

// ─────────────────────────────────────────
// DÉCONNEXION
// ─────────────────────────────────────────
app.post("/api/disconnect", async (req, res) => {
  await disconnect();
  res.json({ success: true });
});

// ─────────────────────────────────────────
// UPLOAD CSV/EXCEL
// ─────────────────────────────────────────
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
    const contacts = parseFile(req.file.path);
    res.json({ count: contacts.length, contacts });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────
// TEST ENVOI (1 message)
// ─────────────────────────────────────────
app.post("/api/send-test", async (req, res) => {
  const { numero, message } = req.body;
  if (!numero || !message) return res.status(400).json({ error: "numero et message requis" });
  try {
    await sendMessage(numero, message);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────
// ENVOI EN MASSE (SSE)
// ─────────────────────────────────────────
app.post("/api/send", async (req, res) => {
  const { contacts, template, delay = 4000 } = req.body;
  if (!contacts?.length || !template)
    return res.status(400).json({ error: "contacts et template requis" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const queue  = new SendQueue({ delay });
  const report = await queue.run(
    contacts,
    template,
    sendMessage,
    (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)
  );

  res.write(`data: ${JSON.stringify({ type: "done", report })}\n\n`);
  res.end();
});

// ─────────────────────────────────────────
// DÉMARRAGE
// ─────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
  console.log(`📡 Health check  : GET http://localhost:${PORT}/api/health`);
  // Démarre WhatsApp en mode QR par défaut
  connect("qr").catch(console.error);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));