---
name: Malicious Office Document
summary: Triage a suspicious Word/Excel/PowerPoint file statically — macros, XLM, embedded objects, remote templates and DDE — and extract the next stage and IOCs.
order: 7
trigger: You have a suspicious `.doc`, `.docm`, `.docx`, `.xls`, `.xlsm`, `.xlsb`, `.ppt` or `.rtf` — from an email, a download or a lab challenge. Work in an isolated VM and never enable content.
tags: [maldoc, office, macros, vba, xlm, ole, phishing, btlo]
questions:
  - What is the real file format (OLE, OOXML, RTF) and does it contain macros?
  - Which stream contains the VBA code, and which auto-exec function starts it?
  - What does the macro do — which command, URL or process does it launch?
  - Which URL or IP is contacted to fetch the next stage?
  - Which file is dropped or downloaded, and where is it written?
  - Does the document use a remote template, DDE or an embedded object instead of macros?
  - What metadata is present (author, last saved by, creation time)?
steps:
  - title: Identify
    goal: Know the container format before choosing a tool.
    actions:
      - Hash the file and check the real type (`file`, Detect It Easy) — the extension can lie.
      - 'OLE (`.doc`, `.xls`) → compound file; OOXML (`.docx`, `.xlsm`) → ZIP; RTF → text with `\object` / `\objdata`.'
    tools: [Detect It Easy, oletools]
    artifacts: [office-documents]
  - title: Triage
    goal: Get the risk indicators in one pass.
    actions:
      - '`oleid file.doc` — macros, XLM, encryption, external relationships, embedded objects, flash.'
      - '`mraptor file.doc` — quick verdict on whether macros auto-execute and write/execute.'
      - Read the metadata (author, last modified by, created/modified times) — useful for clustering.
    tools: [oletools]
  - title: Extract macros
    goal: Get the VBA source and locate the entry point.
    actions:
      - '`olevba file.doc` — source code plus a table of suspicious keywords and IOCs.'
      - '`oledump.py file.doc` — streams marked `M` contain macros; dump one with `oledump.py -s <n> -v file.doc`.'
      - 'Find the auto-exec function: `AutoOpen`, `Document_Open`, `Workbook_Open`, `Auto_Open`.'
    tools: [oletools, oledump.py]
  - title: Deobfuscate
    goal: Recover what the macro actually executes.
    actions:
      - '`olevba --deobf --decode file.doc` resolves simple string obfuscation and decodes Base64/hex/Dridex strings.'
      - Follow string building by hand (`Chr()`, `StrReverse`, `Replace`, concatenation) and decode payloads in CyberChef.
      - 'Excel 4.0 (XLM) macros: `XLMMacroDeobfuscator --file file.xlsm` emulates the formula sheet.'
    tools: [oletools, CyberChef, XLMMacroDeobfuscator]
    escalate: If the macro drops or downloads a PowerShell stage, continue with the Suspicious PowerShell playbook.
  - title: Other vectors
    goal: Rule out non-macro techniques.
    actions:
      - 'Remote template — unzip the OOXML and check `word/_rels/settings.xml.rels` for an external `attachedTemplate` target.'
      - '`msodde file.docx` — DDE / DDEAUTO fields.'
      - '`oleobj file.doc` / `rtfobj file.rtf` — embedded objects, packages and OLE exploits.'
      - Look for links to known exploit paths (for example Equation Editor objects in RTF) and treat any external link as an IOC.
    tools: [oletools]
  - title: Dynamic
    goal: Confirm behaviour when static analysis is not enough.
    actions:
      - Open in a sandbox with macros enabled and network capture; record child processes, files and connections.
    tools: [ANY.RUN, Hybrid Analysis, Wireshark]
  - title: IOCs
    goal: Deliver indicators and next steps.
    actions:
      - Document hash, URLs/IPs, dropped file names and paths, launched commands, metadata.
      - Hunt for the same hash, sender or URL across mail and proxy logs; check which users opened it.
    tools: [YARA, VirusTotal]
iocs:
  - SHA-256 of the document and of any dropped / downloaded file.
  - URLs, domains and IPs used for the next stage.
  - Command lines launched by the macro.
  - Drop paths and file names.
  - Author / last-modified-by metadata for clustering.
escalate_when:
  - Any user opened the document with content enabled.
  - The next stage is unknown or reaches a live C2.
  - The document exploits a vulnerability rather than macros.
related_playbooks: [phishing-investigation, suspicious-powershell, malware-triage]
---

Static tools such as **oletools** and **oledump.py** answer most questions without opening the document. Macros from files with Mark-of-the-Web are blocked by default in current Office versions, so also check whether the delivery used archives, ISO/IMG or LNK files to strip it.
