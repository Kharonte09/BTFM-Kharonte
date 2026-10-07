---
name: Documentos Office y macros
summary: Ficheros Word/Excel/PowerPoint en formato OOXML u OLE antiguo. Pueden contener macros VBA o XLM, objetos embebidos, enlaces externos y plantillas.
category: documents
aliases: [Office Documents & Macros, DOCX, DOCM, XLSX, XLSM, DOC, XLS, OLE, VBA, macros, XLM, Excel 4.0 macros]
tags: [phishing, macros, vba, xlm, ole, acceso inicial, maldoc]
evidence:
  - Código fuente de las macros VBA y sus puntos de autoejecución.
  - Hojas de macros Excel 4.0 (XLM), a menudo ocultas.
  - Objetos OLE, ejecutables o scripts embebidos.
  - Relaciones externas (plantillas remotas, enlaces) contactadas al abrir el documento.
  - Metadatos — autor, último modificador, fechas de creación, versión de la aplicación.
locations:
  - label: OOXML (contenedor zip)
    path: .docx / .docm / .xlsx / .xlsm / .pptm → word/ · xl/ · _rels/ · vbaProject.bin
  - label: OLE antiguo (fichero compuesto)
    path: .doc / .xls / .ppt → streams y storages (p. ej. Macros/VBA)
  - label: Referencia a plantilla remota
    path: word/_rels/settings.xml.rels → attachedTemplate Target="http(s)://…"
questions:
  - ¿Contiene macros el documento, y se ejecutan automáticamente?
  - ¿Qué descarga o ejecuta la macro?
  - ¿Contacta el documento con un servidor remoto al abrirse?
  - ¿Hay un payload embebido?
tools: [olevba, oledump.py, oleid, XLMMacroDeobfuscator, Detect It Easy, CyberChef, YARA]
look_for:
  - Puntos de autoejecución — `AutoOpen`, `Document_Open`, `Workbook_Open`, `Auto_Open`.
  - '`Shell`, `WScript.Shell`, `CreateObject`, `URLDownloadToFile`, `XMLHTTP`, `Environ`, `CallByName`.'
  - Ofuscación — cadenas de `Chr()`, inversión de strings, `StrReverse`, bloques Base64, código basura.
  - Hojas de macros XLM ocultas o muy ocultas con `EXEC`, `CALL`, `REGISTER`, `URLDownloadToFileA`.
  - Destinos externos en ficheros `.rels` (inyección de plantilla remota).
  - Objetos OLE / packages embebidos, y ficheros RTF con `\objdata`.
limitations:
  - Las herramientas estáticas pueden no ver macros muy ofuscadas; puede hacer falta emulación o una sandbox.
  - Con VBA stomping el código fuente puede diferir del p-code compilado que se ejecuta de verdad.
  - Microsoft bloquea por defecto las macros en ficheros con Mark-of-the-Web, así que los atacantes pasaron a otros formatos (archivos comprimidos, LNK, OneNote, HTML smuggling).
related_artifacts: [eml, pdf, pe-executables]
review: true
---

Los ficheros Office modernos (**OOXML**) son archivos ZIP con partes XML; las macros viven en un `vbaProject.bin` binario (que a su vez es un fichero OLE). Los ficheros antiguos (`.doc`, `.xls`) son **ficheros compuestos OLE**, un pequeño sistema de ficheros de streams.

`oletools` (Philippe Lagadec: `olevba`, `oleid`, `oleobj`, `rtfobj`, `msodde`) y `oledump.py` de Didier Stevens son las herramientas estáticas de referencia. Analiza en una VM aislada y nunca habilites el contenido en una estación de analista.
