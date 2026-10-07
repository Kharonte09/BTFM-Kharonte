---
name: Documentos PDF
summary: Ficheros Portable Document Format. Se usan en phishing para enlaces maliciosos y códigos QR, y con menos frecuencia para JavaScript o ficheros embebidos.
category: documents
aliases: [PDF Documents, PDF]
tags: [phishing, javascript, ficheros embebidos, urls, maldoc]
evidence:
  - URLs y acciones (`/URI`, `/Launch`, `/OpenAction`, `/AA`).
  - JavaScript y ficheros embebidos.
  - Formularios y contenido XFA.
  - Metadatos de productor/creador y fechas de creación.
locations:
  - label: Entrega
    path: Adjuntos de correo · descargas · enlaces a servicios de compartición de ficheros
questions:
  - ¿Contiene el PDF JavaScript o acciones automáticas?
  - ¿A qué URLs enlaza (incluidos códigos QR en imágenes)?
  - ¿Embebe otro fichero?
tools: [pdfid.py, pdf-parser.py, CyberChef, VirusTotal, YARA]
look_for:
  - Palabras clave — `/JS`, `/JavaScript`, `/OpenAction`, `/AA`, `/Launch`, `/EmbeddedFile`, `/URI`, `/AcroForm`, `/XFA`, `/ObjStm`.
  - Una sola página con un gran botón «Ver documento» y un enlace — señuelo clásico de robo de credenciales.
  - Códigos QR que llevan a páginas de login (quishing) — decodifícalos sin conexión.
  - Object streams (`/ObjStm`) que ocultan los objetos interesantes — descomprímelos antes de concluir.
limitations:
  - '`pdfid` cuenta palabras clave; los nombres ofuscados (p. ej. `/J#61vaScript`) se normalizan, pero inspecciona igualmente los objetos.'
  - Los enlaces dentro de imágenes (QR) son invisibles para las herramientas de palabras clave.
  - Los exploits del lector dependen de su versión — el análisis estático muestra la intención, no el éxito.
related_artifacts: [eml, office-documents]
review: true
---

Un PDF es un conjunto de objetos (diccionarios, streams) referenciados desde un trailer. **pdfid.py** de Didier Stevens da un triage rápido por palabras clave; **pdf-parser.py** permite buscar, descomprimir y volcar objetos concretos.

En las campañas de phishing actuales los PDF son sobre todo **contenedores de un enlace o un código QR**; extrae y analiza la URL como siguiente paso.
