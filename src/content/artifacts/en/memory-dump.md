---
name: Memory Dump
summary: Image of a system's physical RAM. Shows running processes, network connections, injected code and artefacts that never touch disk.
category: memory
aliases: [RAM dump, memory image, Processes, Handles, DLLs, Network connections]
tags: [memory, processes, injection, fileless, volatility]
evidence:
  - Running and recently terminated processes, parent-child relationships, command lines.
  - Network connections and listening sockets with owning process.
  - Loaded DLLs and modules, handles (files, registry keys, mutexes).
  - Injected or unbacked executable memory regions.
  - Decrypted strings, keys and configurations present only at runtime.
locations:
  - label: Acquisition output
    path: Raw (.raw/.mem) · crash dump (.dmp) · VM memory files (e.g. .vmem)
  - label: On-disk memory remnants
    path: C:\hiberfil.sys · C:\pagefile.sys · C:\swapfile.sys
questions:
  - Which processes were running, and which are suspicious?
  - Which process owned this network connection?
  - Is there injected code in a legitimate process?
  - What command lines were used?
  - Is there fileless malware or a decrypted payload in memory?
tools: [Volatility 3, MemProcFS, YARA, Velociraptor]
look_for:
  - Processes with wrong parents (e.g. `svchost.exe` not started by `services.exe`) or wrong paths.
  - Misspelled system process names (`scvhost.exe`, `lsas.exe`).
  - '`windows.malfind` hits — executable private memory, especially with an `MZ` header.'
  - Connections from processes that should not be networked.
  - Processes visible to scan-based plugins but missing from the list-based ones (hiding).
limitations:
  - Acquisition must happen before shutdown; the image is a single point in time.
  - Acquisition tools change memory and can be blocked by security products.
  - Analysis depends on matching symbols/profiles for the OS build.
  - Smear — memory changes during acquisition can produce inconsistent structures.
related_artifacts: [pe-executables, pcap, sysmon]
---

Memory forensics recovers the **runtime state** of a system. Typical acquisition tools include WinPmem, DumpIt and Magnet RAM Capture; analysis is usually done with **Volatility 3** (Volatility 2 is no longer maintained) or **MemProcFS**, which exposes memory as a virtual file system.

### Common Volatility 3 plugins (Windows)

| Plugin | Use |
| --- | --- |
| `windows.info` | OS build and image information |
| `windows.pslist` / `windows.psscan` | Process list (linked list vs. pool scanning) |
| `windows.pstree` | Parent-child tree |
| `windows.cmdline` | Process command lines |
| `windows.netscan` | Network connections and sockets |
| `windows.dlllist` | Loaded modules per process |
| `windows.handles` | Open handles per process |
| `windows.malfind` | Suspicious executable memory regions |
| `windows.svcscan` | Services |

Example: `vol -f memory.raw windows.pstree`
