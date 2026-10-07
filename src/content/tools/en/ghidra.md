---
name: Ghidra
summary: Open-source software reverse-engineering suite from the NSA, with a disassembler and decompiler for many architectures.
category: reversing
type: Disassembler / decompiler
platforms: [Windows, Linux, macOS]
license: Open source (Apache-2.0)
homepage: https://github.com/NationalSecurityAgency/ghidra
coverage: basic
tags: [reversing, decompiler, disassembler, static analysis]
use_when:
  - Static triage (strings, imports, capa) is not enough to answer your question.
  - You need to understand a specific routine — config decryption, C2 protocol, persistence logic.
  - You want to confirm a capa finding at the code level.
look_for:
  - Cross-references to interesting imports (`VirtualAlloc`, `CreateRemoteThread`, `InternetOpenUrl`, `CryptDecrypt`).
  - Functions referenced by capa `-vv` addresses.
  - Decoding loops around encrypted data blobs.
  - Hard-coded configuration (C2, keys, mutex, campaign IDs).
outputs:
  - Annotated project with disassembly, decompiled pseudo-C, call graphs and cross-references.
  - Scriptable analysis (Java/Python scripts) and exportable program data.
mistakes:
  - Unpack samples first; analysing a packer stub wastes time.
  - Requires a supported JDK; check the release notes for the current version.
  - For .NET assemblies, ILSpy or dnSpyEx give far more readable output than a native decompiler.
  - Reversing is time-expensive — define the question you need answered before starting.
complements: [capa, FLOSS, x64dbg, ILSpy]
related_artifacts: [pe-executables]
---
