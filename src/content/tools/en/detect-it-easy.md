---
name: Detect It Easy
summary: Signature-based file identifier. Reports compiler, linker, packer, protector and installer for executables and many other formats.
category: malware-analysis
type: File identification
platforms: [Windows, Linux, macOS]
license: Open source (MIT)
homepage: https://github.com/horsicq/Detect-It-Easy
coverage: basic
aliases: [DIE, diec]
tags: [file identification, packer, compiler, entropy, triage]
use_when:
  - First look at an unknown file — before deciding which analysis path to follow.
  - You suspect a sample is packed or protected (UPX, Themida, custom).
  - You need to know whether a PE is native, .NET, Go, Delphi, an installer or a self-extracting archive.
look_for:
  - Packer/protector detections — they change your next step (unpack vs. analyse directly).
  - '.NET detection → decompile with ILSpy / dnSpyEx instead of disassembling.'
  - Installers and SFX archives → extract contents and analyse the payload instead.
  - High-entropy sections or overlay data.
examples:
  - label: Command-line scan
    command: 'diec sample.bin'
  - label: Recursive scan with JSON output
    command: 'diec -r -j sample.bin'
outputs:
  - File type and architecture.
  - Detected compiler, linker, library, packer, protector, installer (with signature names).
  - Entropy view and section information in the GUI.
mistakes:
  - Detections are signature-based; "nothing detected" does not mean "not packed".
  - Signatures are scripts and can be extended; keep the tool updated.
  - Command-line flags vary between versions — check `diec --help`.
complements: [PEStudio, capa, FLOSS, YARA]
related_artifacts: [pe-executables, office-documents]
review: true
---
