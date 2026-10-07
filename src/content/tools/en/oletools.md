---
name: oletools
summary: Python toolkit for analysing Microsoft OLE and Office files — macros, XLM, embedded objects, DDE, RTF and external relationships.
category: malware-analysis
type: Maldoc analysis
platforms: [Windows, Linux, macOS]
license: Open source (BSD-2-Clause)
homepage: https://github.com/decalage2/oletools
difficulty: intermediate
aliases: [olevba, oleid, mraptor, oleobj, rtfobj, msodde, olemeta]
tags: [maldoc, office, macros, vba, ole, rtf, dde, phishing]
use_when:
  - You need to know whether an Office document contains macros, and what they do, without opening it.
  - You suspect a remote template, a DDE field or an embedded object instead of macros.
  - You are triaging a phishing attachment in `.doc`, `.docm`, `.xls`, `.xlsm` or `.rtf` format.
look_for:
  - 'Auto-exec entry points flagged by `olevba` (`AutoOpen`, `Document_Open`, `Workbook_Open`).'
  - '"Suspicious" keywords — `Shell`, `CreateObject`, `WScript.Shell`, `URLDownloadToFile`, `Environ`.'
  - IOCs extracted by `olevba` (URLs, IPs, executable names).
  - '`oleid` flags for external relationships, encryption, XLM macros and embedded objects.'
workflow:
  - '`oleid` — risk indicators'
  - '`olevba` — macros + keywords + IOCs'
  - '`olevba --deobf --decode` — simple deobfuscation'
  - '`oleobj` / `rtfobj` / `msodde` — other vectors'
  - CyberChef / sandbox for the next stage
examples:
  - label: Install / update
    command: 'pip install -U oletools'
  - label: Risk indicators
    command: 'oleid suspicious.doc'
  - label: Extract and analyse VBA macros
    command: 'olevba suspicious.docm'
  - label: Deobfuscate and decode strings
    command: 'olevba --deobf --decode suspicious.docm'
  - label: Quick macro verdict
    command: 'mraptor suspicious.doc'
  - label: Embedded objects (OLE / RTF)
    command: 'oleobj suspicious.doc && rtfobj suspicious.rtf'
  - label: DDE fields
    command: 'msodde suspicious.docx'
outputs:
  - VBA source code per module, with a table of auto-exec, suspicious and IOC keywords.
  - A risk summary of the container (`oleid`) and a macro verdict (`mraptor`).
  - Extracted embedded objects written to disk (`oleobj`, `rtfobj`).
  - DDE links found in document fields (`msodde`).
notes:
  - The tools never execute macros, but run them in an isolated VM — extracted objects can be live malware.
  - Heavily obfuscated or stomped VBA can defeat static extraction; compare with p-code tools or a sandbox.
  - For Excel 4.0 (XLM) macros, XLMMacroDeobfuscator gives better results by emulating the formulas.
  - '`oledump.py` (Didier Stevens) is a complementary tool for stream-level inspection of OLE files.'
complements: [oledump.py, XLMMacroDeobfuscator, CyberChef, Detect It Easy, YARA]
related_artifacts: [office-documents, eml]
---

**oletools** is a collection of Python tools by Philippe Lagadec for analysing OLE compound files (legacy `.doc`, `.xls`, `.ppt`, `.msg`) and OOXML Office documents. The most used are `olevba` (macro extraction and analysis), `oleid` (risk indicators), `mraptor` (macro verdict), `oleobj` and `rtfobj` (embedded objects) and `msodde` (DDE).

It is the standard first step in maldoc triage — most questions about a malicious document can be answered without opening it.
