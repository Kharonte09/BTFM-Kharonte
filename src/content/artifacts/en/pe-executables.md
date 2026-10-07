---
name: PE / EXE / DLL
summary: Windows executables and libraries (EXE, DLL, SYS, .NET). The most common malware payload — identify it, check reputation, find what it does and where it ran.
category: binaries
coverage: basic
aliases: [PE Executables (EXE / DLL), EXE, DLL, PE, .NET assemblies, Portable Executable, Suspicious EXE, Ejecutable]
tags: [malware, static analysis, hashes, imports, packers]
start_here:
  - Preserve the original sample (copy to an isolated analysis VM, ideally in a password-protected archive `infected`).
  - Calculate the SHA-256 and record where the file came from.
  - Identify the real file type and architecture — packed? .NET? installer?
  - Check the Authenticode signature and version info.
  - Look up the **hash** (not the file) for reputation.
start_commands:
  - label: Hash (Windows)
    command: 'Get-FileHash .\sample.exe -Algorithm SHA256'
  - label: Signature
    command: 'Get-AuthenticodeSignature .\sample.exe'
  - label: Hash and type (Linux)
    command: 'sha256sum sample.exe && file sample.exe'
why:
  - EDR / AV alert on an executable.
  - Suspicious download or file written by Office, a browser or a script.
  - Email attachment (or an EXE inside a ZIP / ISO / IMG).
  - Unknown binary found during endpoint triage.
  - Unexpected process execution from a user-writable path.
look_for:
  - Suspicious imports (process injection, keylogging, crypto, networking) or very few imports plus `LoadLibrary`/`GetProcAddress`.
  - URLs, IPs, domains, commands and registry paths in strings.
  - Unusual section names, executable + writable sections, high entropy (packing).
  - Overlays or resources containing another PE (`MZ`).
  - Invalid, expired or unexpected signers; version info imitating a legitimate vendor.
  - Compile timestamp that does not fit the story (it can be forged).
tools_start: [Detect It Easy, PEStudio, FLOSS]
tools_deeper: [capa, Ghidra]
tool_questions:
  - tool: Detect It Easy
    question: What is it — compiler, packer, .NET, installer?
  - tool: PEStudio
    question: Which properties look suspicious (imports, sections, resources, signature)?
  - tool: FLOSS
    question: Which strings — including obfuscated ones — does it contain?
  - tool: capa
    question: What could it do (capabilities, ATT&CK candidates)?
  - tool: VirusTotal
    question: Is this sample already known?
  - tool: ANY.RUN
    question: What happens when it executes?
  - tool: Hybrid Analysis
    question: What behaviour and indicators are observed?
correlate:
  - PE on disk (path, hash)
  - Process creation — Sysmon `1` / Security `4688`
  - Command line and parent process
  - Network connections — Sysmon `3` / `22`
  - Files written — Sysmon `11`
  - Persistence — Run keys, services, scheduled tasks
extract:
  - SHA-256 (and MD5 / SHA-1 for legacy lookups), imphash
  - File name and full path
  - Domains, URLs and IPs
  - Mutexes, named pipes
  - Registry keys and dropped file paths
  - Command lines it launches
mistakes:
  - Don't execute unknown samples on your normal workstation — use an isolated VM or sandbox.
  - A VirusTotal detection count is not sufficient evidence by itself; zero detections does not mean benign.
  - A suspicious API or import does not automatically mean malicious behaviour.
  - Uploading the file (instead of searching the hash) makes it public.
related_artifacts: [sysmon, windows-event-logs, registry, pcap, memory-dump]
---
