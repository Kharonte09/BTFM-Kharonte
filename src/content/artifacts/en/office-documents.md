---
name: Office Documents
summary: Word / Excel / PowerPoint files that may carry macros, embedded objects or remote templates. Find out whether it executes something and what it fetches next — without opening it.
category: documents
coverage: intermediate
aliases: [Office Documents & Macros, DOCX, DOCM, XLSX, XLSM, DOC, XLS, OLE, VBA, macros, XLM]
tags: [phishing, macros, vba, xlm, ole, maldoc]
start_here:
  - Hash the file and check the real type — the extension can lie.
  - Run `oleid` for a quick risk summary (macros, external links, embedded objects).
  - Extract the macros with `olevba` and find the auto-exec entry point.
  - Pull out URLs, IPs and commands the macro uses.
  - If there are no macros, check remote templates, DDE and embedded objects.
start_commands:
  - label: Risk indicators
    command: 'oleid suspicious.doc'
  - label: Extract and analyse macros
    command: 'olevba suspicious.docm'
  - label: Quick macro verdict
    command: 'mraptor suspicious.doc'
why:
  - Phishing attachment.
  - Office application spawned `cmd.exe` / `powershell.exe` on an endpoint.
  - Document downloaded right before a suspicious execution.
look_for:
  - Auto-exec — `AutoOpen`, `Document_Open`, `Workbook_Open`, `Auto_Open`.
  - '`Shell`, `WScript.Shell`, `CreateObject`, `URLDownloadToFile`, `powershell`.'
  - Obfuscation — `Chr()` chains, `StrReverse`, Base64 blobs, junk code.
  - Hidden Excel 4.0 (XLM) macro sheets.
  - External `attachedTemplate` targets in `word/_rels/settings.xml.rels` (remote template).
tools_start: [oletools]
tools_deeper: [oledump.py, XLMMacroDeobfuscator, CyberChef, ANY.RUN]
tool_questions:
  - tool: oletools
    question: Does it have macros, and what do they do?
  - tool: CyberChef
    question: What do the obfuscated strings decode to?
  - tool: ANY.RUN
    question: What happens when the document opens with content enabled?
correlate:
  - Document (hash, macro, URL)
  - Office spawning a child process — Sysmon `1` / `4688`
  - PowerShell / download of the next stage
  - Network — the URL from the macro
  - Dropped file → PE analysis
extract:
  - SHA-256 of the document
  - URLs, domains and IPs used to fetch the next stage
  - Commands launched by the macro
  - Dropped file names and paths
mistakes:
  - Never enable content on the analyst workstation.
  - Heavily obfuscated or stomped VBA can fool static extraction — confirm in a sandbox.
  - No macros does not mean safe — check remote templates, DDE and embedded objects.
related_artifacts: [eml, pdf, powershell-logs, pe-executables]
---
