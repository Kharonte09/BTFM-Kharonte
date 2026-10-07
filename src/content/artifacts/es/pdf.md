---
name: Documentos PDF
summary: En phishing un PDF suele ser un contenedor de un enlace o un código QR; con menos frecuencia lleva JavaScript o un fichero embebido. Averigua cuál es y sigue el enlace.
category: documents
coverage: intermediate
aliases: [PDF Documents, PDF]
tags: [phishing, javascript, ficheros embebidos, urls, qr]
start_here:
  - Calcula el hash y confirma que de verdad es un PDF (`file`).
  - Ejecuta `pdfid` y revisa las palabras clave de riesgo.
  - Si aparece alguna, inspecciona ese objeto con `pdf-parser`.
  - Extrae todas las URLs — también las de códigos QR en imágenes — y analízalas como indicadores.
start_commands:
  - label: Triage por palabras clave
    command: 'pdfid.py suspicious.pdf'
  - label: Buscar objetos con JavaScript
    command: 'pdf-parser.py --search JavaScript suspicious.pdf'
why:
  - Adjunto de phishing, a menudo una «factura» o un «documento compartido».
  - Un usuario abrió un PDF y luego introdujo credenciales en una página.
look_for:
  - '`/JavaScript`, `/JS`, `/OpenAction`, `/AA`, `/Launch`, `/EmbeddedFile`, `/URI`.'
  - Una sola página con un gran botón «Ver documento» y un enlace.
  - Códigos QR que llevan a páginas de login.
  - Object streams (`/ObjStm`) que ocultan los objetos interesantes.
tools_start: [pdfid.py]
tools_deeper: [pdf-parser.py, CyberChef, VirusTotal]
correlate:
  - PDF (hash, URLs)
  - URL → reputación y página de destino
  - Proxy / DNS — quién abrió el enlace
  - Sign-in logs — ¿se introdujeron credenciales?
extract:
  - SHA-256 del PDF
  - URLs y dominios (también de los códigos QR)
  - Nombres y hashes de ficheros embebidos
mistakes:
  - '`pdfid` solo cuenta palabras clave — un resultado limpio no significa que no haya enlace.'
  - Los enlaces dentro de imágenes (QR) son invisibles para las herramientas de palabras clave.
  - No abras el PDF con un lector normal en la estación del analista.
related_artifacts: [eml, office-documents, ip-domain]
---
