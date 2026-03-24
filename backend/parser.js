import XLSX from "xlsx";
import path from "path";
import fs from "fs";

export const parseFile = (filePath) => {
  if (!fs.existsSync(filePath)) throw new Error("Fichier introuvable");

  const ext      = path.extname(filePath).toLowerCase();
  const workbook = XLSX.readFile(filePath, { raw: false });
  const sheet    = workbook.Sheets[workbook.SheetNames[0]];
  const rows     = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  // Supprime le fichier après parsing
  try { fs.unlinkSync(filePath); } catch (_) {}

  const contacts = rows.map((row, i) => normalizeRow(row, i)).filter(Boolean);
  if (!contacts.length) throw new Error("Aucun contact valide trouvé");

  return contacts;
};

const normalizeRow = (row, index) => {
  const keys      = Object.keys(row);
  const nomKey    = keys.find((k) => ["nom", "name", "prenom", "prénom"].includes(k.toLowerCase()));
  const numeroKey = keys.find((k) => ["numero", "numéro", "phone", "tel", "telephone", "téléphone", "number"].includes(k.toLowerCase()));

  if (!nomKey || !numeroKey) return null;

  const nom    = String(row[nomKey]).trim();
  const numero = String(row[numeroKey]).replace(/\D/g, "").trim();

  if (!nom || !numero || numero.length < 8 || numero.length > 15) return null;

  // Champs supplémentaires pour la personnalisation
  const extra = {};
  for (const key of keys) {
    if (key !== nomKey && key !== numeroKey) {
      extra[key.toLowerCase()] = String(row[key]).trim();
    }
  }

  return { nom, numero, ...extra };
};