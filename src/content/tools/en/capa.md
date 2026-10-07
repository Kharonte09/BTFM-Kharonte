---
name: capa
summary: Identifies capabilities in executables (e.g. "inject code", "communicate over HTTP") using rules, mapped to ATT&CK and MBC.
category: malware-analysis
type: Capability detection
platforms: [Windows, Linux, macOS]
license: Open source (Apache-2.0)
homepage: https://github.com/mandiant/capa
difficulty: intermediate
aliases: [flare-capa]
tags: [static analysis, capabilities, att&ck, mbc, triage]
use_when:
  - You want to know **what a binary can do** before opening a disassembler.
  - You need ATT&CK technique candidates for a report.
  - You want to know where in the code to start reversing (function addresses per capability).
look_for:
  - Persistence, injection, anti-analysis and credential-access capabilities.
  - Network communication capabilities (HTTP, sockets, DNS).
  - Encryption/encoding capabilities — candidates for config or payload decoding.
  - Packed-sample warnings (capa will tell you results are unreliable).
workflow:
  - Sample (unpacked if possible)
  - capa
  - Review capabilities / ATT&CK
  - '`capa -vv` for matched addresses'
  - Open those functions in Ghidra
examples:
  - label: Default summary
    command: 'capa sample.exe'
  - label: Verbose — show matched rules and addresses
    command: 'capa -vv sample.exe'
  - label: JSON output
    command: 'capa -j sample.exe > sample.capa.json'
outputs:
  - Table of ATT&CK tactics/techniques and MBC objectives/behaviours.
  - List of capabilities with namespaces (e.g. `host-interaction/process/inject`).
  - With `-v` / `-vv`, the rule matches and addresses that triggered them.
notes:
  - Packed or heavily obfuscated samples produce few or misleading results — unpack first.
  - Supports PE, ELF, .NET modules and shellcode; recent versions can also analyse some sandbox reports (dynamic mode). Check the docs for supported formats.
  - Capabilities are possibilities in code, not observed behaviour.
complements: [FLOSS, Detect It Easy, Ghidra, YARA]
related_artifacts: [pe-executables]
---

capa is a FLARE (Mandiant) project. It extracts features from a program — API calls, strings, constants, instructions — and matches them against a community rule set. Each rule describes a capability, and many are mapped to **MITRE ATT&CK** and the **Malware Behavior Catalog (MBC)**.

It is especially useful for deciding whether deeper reversing is needed and where to start.
