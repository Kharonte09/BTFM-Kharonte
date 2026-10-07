---
name: Office Documents & Macros
summary: Word/Excel/PowerPoint files in OOXML or legacy OLE format. Can carry VBA or XLM macros, embedded objects, external links and templates.
category: phishing
aliases: [DOCX, DOCM, XLSX, XLSM, DOC, XLS, OLE, VBA, macros, XLM, Excel 4.0 macros]
tags: [phishing, macros, vba, xlm, ole, initial access, maldoc]
evidence:
  - VBA macro source code and auto-execution entry points.
  - Excel 4.0 (XLM) macro sheets, often hidden.
  - Embedded OLE objects, executables or scripts.
  - External relationships (remote templates, links) contacted when the document opens.
  - Metadata — author, last modified by, creation dates, application version.
locations:
  - label: OOXML (zip container)
    path: .docx / .docm / .xlsx / .xlsm / .pptm → word/ · xl/ · _rels/ · vbaProject.bin
  - label: Legacy OLE (compound file)
    path: .doc / .xls / .ppt → streams and storages (e.g. Macros/VBA)
  - label: Remote template reference
    path: word/_rels/settings.xml.rels → attachedTemplate Target="http(s)://…"
questions:
  - Does the document contain macros, and do they run automatically?
  - What does the macro download or execute?
  - Does the document contact a remote server when opened?
  - Is there an embedded payload?
tools: [olevba, oledump.py, oleid, XLMMacroDeobfuscator, Detect It Easy, CyberChef, YARA]
look_for:
  - Auto-exec entry points — `AutoOpen`, `Document_Open`, `Workbook_Open`, `Auto_Open`.
  - '`Shell`, `WScript.Shell`, `CreateObject`, `URLDownloadToFile`, `XMLHTTP`, `Environ`, `CallByName`.'
  - Obfuscation — `Chr()` chains, string reversal, `StrReverse`, Base64 blobs, unused junk code.
  - Hidden or very-hidden XLM macro sheets with `EXEC`, `CALL`, `REGISTER`, `URLDownloadToFileA`.
  - External targets in `.rels` files (remote template injection).
  - Embedded OLE objects / packages, and RTF files with `\objdata`.
limitations:
  - Static tools may miss heavily obfuscated macros; emulation or a sandbox may be needed.
  - VBA stomping can make the source code differ from the compiled p-code that actually runs.
  - Microsoft blocks macros by default in files carrying Mark-of-the-Web, so attackers moved to other formats (archives, LNK, OneNote, HTML smuggling).
related_artifacts: [eml, pdf, pe-executables]
review: true
---

Modern Office files (**OOXML**) are ZIP archives of XML parts; macros live in a binary `vbaProject.bin` (itself an OLE file). Legacy files (`.doc`, `.xls`) are **OLE compound files** — a small file system of streams.

`oletools` (Philippe Lagadec: `olevba`, `oleid`, `oleobj`, `rtfobj`, `msodde`) and Didier Stevens' `oledump.py` are the standard static tools. Analyse in an isolated VM and never enable content on an analyst workstation.
