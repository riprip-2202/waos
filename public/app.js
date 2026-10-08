const $ = id => document.getElementById(id);
const fileInput = $("fileInput");
const fileLabel = $("fileLabel");

fileInput.addEventListener("change", () => {
  fileLabel.textContent = fileInput.files[0]
    ? fileInput.files[0].name
    : "Seleccionar archivo";
});

$("uploadBtn").addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return $("uploadStatus").textContent = "Selecciona un archivo primero.";

  const form = new FormData();
  form.append("file", file);
  $("uploadBtn").disabled = true;
  $("uploadStatus").textContent = "Subiendo...";

  try {
    const r = await fetch("/api/upload", { method:"POST", body:form });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "No se pudo subir el archivo.");

    $("shareUrl").value = data.url;
    $("shareBox").classList.remove("hidden");
    $("uploadStatus").textContent = "Archivo subido correctamente.";
  } catch (e) {
    $("uploadStatus").textContent = e.message;
  } finally {
    $("uploadBtn").disabled = false;
  }
});

$("copyBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("shareUrl").value);
  $("copyBtn").textContent = "Copiado";
  setTimeout(() => $("copyBtn").textContent = "Copiar", 1400);
});

$("downloadBtn").addEventListener("click", async () => {
  const raw = $("urlInput").value.trim();
  if (!raw) return $("downloadStatus").textContent = "Pega una URL primero.";

  try {
    const u = new URL(raw);
    // Enlaces generados por waos: descarga directa.
    if (u.origin === location.origin && u.pathname.startsWith("/f/")) {
      location.href = u.pathname;
      return;
    }
    $("downloadStatus").textContent =
      "Esta versión descarga directamente los enlaces de waos. Para URLs externas se necesita un proxy/backend adicional.";
  } catch {
    $("downloadStatus").textContent = "La URL no es válida.";
  }
});