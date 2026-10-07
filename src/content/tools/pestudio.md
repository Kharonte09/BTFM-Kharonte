---
name: PEStudio
summary: Static analysis tool for Windows executables. Surfaces suspicious indicators, imports, strings and resources without running the sample.
category: malware-analysis
type: Static analysis
platforms: [Windows]
license: Free edition and paid Pro edition — check licensing for commercial use
homepage: https://www.winitor.com/
difficulty: basic
aliases: [pestudio]
tags: [static analysis, pe, imports, strings, triage]
use_when:
  - Quick static triage of a suspicious EXE or DLL.
  - You want a prioritised view of "what is odd" in a PE before deeper analysis.
  - You need hashes, compile timestamp, imphash and signature status in one place.
look_for:
  - Imports flagged as suspicious (process injection, keylogging, crypto, networking).
  - Strings with URLs, IPs, registry paths, commands or user agents.
  - Resources with embedded executables or high entropy.
  - Mismatches between version info, file name and signature.
  - Overlay data appended after the last section.
workflow:
  - Hashes & signature
  - Indicators view
  - Imports / strings
  - Resources / overlay
  - Next — capa · FLOSS · sandbox
outputs:
  - File hashes (MD5, SHA-1, SHA-256), imphash and basic header information.
  - Indicator list ranked by severity.
  - Imports, exports, sections, resources, strings and version information.
  - Exportable report (format depends on edition).
notes:
  - PEStudio does not execute the sample, but analyse samples in an isolated VM anyway.
  - It can look up the hash on VirusTotal — this sends the hash to a third party. Disable if your case requires it.
  - Indicators are heuristics, not verdicts. Many legitimate programs trigger some of them.
complements: [Detect It Easy, FLOSS, capa, YARA]
related_artifacts: [pe-executables]
review: true
---

PEStudio (Winitor) parses Portable Executable files and highlights properties that are often associated with malicious software: suspicious imports, anomalous sections, embedded files, suspicious strings and more. It is a typical first static view of a Windows binary.
