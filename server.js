import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "data");
const UPLOADS = path.join(DATA, "uploads");
fs.mkdirSync(UPLOADS, { recursive: true });

const files = new Map();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS),
  filename: (_, file, cb) => cb(null, crypto.randomUUID() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ningún archivo." });

  const id = crypto.randomBytes(6).toString("base64url");
  files.set(id, {
    path: req.file.path,
    name: req.file.originalname,
    type: req.file.mimetype || "application/octet-stream",
    size: req.file.size,
    created: Date.now()
  });

  res.json({
    id,
    name: req.file.originalname,
    size: req.file.size,
    url: `${req.protocol}://${req.get("host")}/f/${id}`
  });
});

app.get("/api/file/:id", (req, res) => {
  const item = files.get(req.params.id);
  if (!item || !fs.existsSync(item.path))
    return res.status(404).json({ error: "Archivo no encontrado." });

  res.json({ name: item.name, size: item.size, type: item.type });
});

app.get("/download/:id", (req, res) => {
  const item = files.get(req.params.id);
  if (!item || !fs.existsSync(item.path))
    return res.status(404).send("Archivo no encontrado.");

  res.download(item.path, item.name);
});

app.get("/f/:id", (req, res) => {
  const item = files.get(req.params.id);
  if (!item || !fs.existsSync(item.path))
    return res.status(404).send("Este enlace no existe o el archivo fue eliminado.");

  res.sendFile(path.join(__dirname, "public", "file.html"));
});

app.listen(PORT, () => {
  console.log(`waos funcionando en http://localhost:${PORT}`);
});