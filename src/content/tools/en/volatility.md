---
name: Volatility 3
summary: Open-source memory forensics framework. Extracts processes, network connections, injected code, registry data and files from RAM images.
category: dfir
type: Memory forensics
platforms: [Windows, Linux, macOS]
license: Volatility Software License (VSL)
homepage: https://github.com/volatilityfoundation/volatility3
coverage: intermediate
aliases: [Volatility, vol, vol.py, Volatility3]
tags: [memory, ram, processes, injection, malfind, forensics]
use_when:
  - You have a memory image and need to know what was running, connected or injected.
  - Malware may be fileless or decrypt its configuration only in memory.
  - You need to recover a process image or file that no longer exists on disk.
look_for:
  - Processes with wrong parents, paths or misspelled names (`windows.pstree`, `windows.pslist`).
  - Processes present in `windows.psscan` but not in `windows.pslist`.
  - Suspicious command lines (`windows.cmdline`).
  - Connections owned by unexpected processes (`windows.netscan`).
  - Executable private memory, especially with an `MZ` header (`windows.malfind`).
examples:
  - label: Image information
    command: 'vol -f mem.raw windows.info'
  - label: Process tree
    command: 'vol -f mem.raw windows.pstree'
  - label: Command lines
    command: 'vol -f mem.raw windows.cmdline'
  - label: Network connections
    command: 'vol -f mem.raw windows.netscan'
  - label: Injected code
    command: 'vol -f mem.raw windows.malfind'
  - label: Dump files of a process to a folder
    command: 'vol -f mem.raw -o out/ windows.dumpfiles --pid 1234'
  - label: Read a registry key from memory
    command: 'vol -f mem.raw windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"'
outputs:
  - Tables per plugin (text by default; `-r json` / `-r csv` renderers for scripting).
  - Dumped files, process images and memory regions written to the output directory.
mistakes:
  - '**Volatility 3** replaces Volatility 2 (Python 2, no longer maintained). Plugin names differ — `windows.pslist` instead of `pslist --profile=…`; profiles are replaced by symbol tables.'
  - Symbol tables for Windows are downloaded automatically by default; on offline analysis machines, prepare them in advance.
  - Plugin options change between releases — check `vol <plugin> -h`.
  - Smear during acquisition can produce inconsistent results; corroborate with several plugins.
complements: [MemProcFS, YARA, Velociraptor, Wireshark]
related_artifacts: [memory-dump, pe-executables]
---
