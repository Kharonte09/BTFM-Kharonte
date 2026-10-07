---
name: PE Executables (EXE / DLL)
summary: Windows Portable Executable files — EXE, DLL, SYS, and .NET assemblies. The most common form of Windows malware payload.
category: binaries
aliases: [EXE, DLL, PE, .NET assemblies, Portable Executable, Suspicious EXE]
tags: [malware, static analysis, hashes, imports, packers, .net]
evidence:
  - Hashes (MD5, SHA-1, SHA-256) and imphash for reputation and pivoting.
  - Compile timestamp, linker and compiler information, Rich header.
  - Imports and exports — hints of capability.
  - Sections, entropy, resources and overlay — hints of packing or embedded payloads.
  - Authenticode signature and version information.
  - Strings — URLs, paths, commands, mutexes.
locations:
  - label: Common drop locations
    path: '%TEMP% · %APPDATA% · %LOCALAPPDATA% · C:\ProgramData · C:\Users\Public · Downloads'
  - label: Evidence of past presence
    path: Amcache · Shimcache · Prefetch · $MFT
questions:
  - Is this file known (malicious or benign)?
  - Is it packed, .NET, an installer, or signed?
  - What can it do (network, persistence, injection, encryption)?
  - What IOCs can I extract to scope the incident?
  - Does it need dynamic analysis or reversing?
tools: [Detect It Easy, PEStudio, FLOSS, capa, YARA, VirusTotal, Ghidra]
look_for:
  - Compile time that does not fit the story (in the future, or decades old — can be forged).
  - Few imports plus `LoadLibrary`/`GetProcAddress` → dynamic resolution or packing.
  - High-entropy sections, odd section names, executable + writable sections.
  - Invalid, expired or unexpected signers; version info imitating a legitimate vendor.
  - Overlays and resources containing PE headers (`MZ`).
  - .NET assemblies — decompile with ILSpy / dnSpyEx instead of disassembling.
limitations:
  - Static analysis cannot see what a packed or downloaded stage does — escalate to sandbox or reversing.
  - Compile timestamps and version info are trivially forged.
  - A valid signature can come from a stolen or abused certificate.
related_artifacts: [amcache, prefetch, memory-dump]
---

The Portable Executable (PE) format is used by Windows for executables, DLLs and drivers. The header describes sections, imports, exports, resources and the entry point — each of which can reveal how the file was built and what it intends to do.

For .NET assemblies the PE contains a CLR header and IL code; decompilers such as **ILSpy** or **dnSpyEx** (the maintained fork of the archived dnSpy) recover near-source code.
