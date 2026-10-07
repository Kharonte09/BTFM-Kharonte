---
name: Memory Dump
summary: A RAM image — what was running, connected and injected at capture time. The place to find fileless malware and decrypted payloads.
category: memory
coverage: intermediate
aliases: [RAM dump, memory image, Volcado de memoria, Memory]
tags: [memory, volatility, processes, injection, fileless]
start_here:
  - Hash the image and record how and when it was acquired.
  - Identify the OS build and capture time — `windows.info`.
  - List processes as a tree — wrong parents, paths or names stand out.
  - Check command lines and network connections of anything suspicious.
  - Look for injected code (`windows.malfind`) and dump what you need.
start_commands:
  - label: Image info
    command: 'vol -f mem.raw windows.info'
  - label: Process tree
    command: 'vol -f mem.raw windows.pstree'
  - label: Command lines
    command: 'vol -f mem.raw windows.cmdline'
  - label: Network connections
    command: 'vol -f mem.raw windows.netscan'
  - label: Injected code
    command: 'vol -f mem.raw windows.malfind'
why:
  - Suspected fileless malware or injection.
  - Host captured before containment or shutdown.
  - Need the decrypted configuration or the C2 of a sample.
  - Lab or challenge with a memory image.
questions:
  - Which process is malicious (name, PID, parent, path)?
  - How was it launched (command line)?
  - Which remote IP and port does it connect to?
  - Is there injected code, and in which process?
look_for:
  - Wrong parent (e.g. `svchost.exe` not from `services.exe`) or wrong path.
  - Misspelled system process names (`scvhost.exe`, `lsas.exe`).
  - Processes in `windows.psscan` but not in `windows.pslist` (hidden or terminated).
  - '`windows.malfind` hits with an `MZ` header or shellcode.'
  - Connections from processes that should not be networked.
tools_start: [Volatility 3]
tools_deeper: [MemProcFS, YARA]
correlate:
  - Suspicious process (PID, path, command line)
  - Network connection (`netscan`) → PCAP / proxy logs
  - Dumped file → hash → PE analysis
  - Persistence (`svcscan`, Run keys in memory) → registry / tasks on disk
extract:
  - Process names, PIDs, paths and command lines
  - Remote IPs and ports
  - Hashes of dumped files
  - Mutexes and persistence entries
mistakes:
  - The image is a single point in time — it misses what ran before.
  - Plugin names and options change between Volatility 3 versions — check `vol <plugin> -h`.
  - Volatility 2 profiles do not apply to Volatility 3 (it uses symbol tables).
  - Acquisition smear can produce inconsistent results — corroborate with several plugins.
related_artifacts: [pe-executables, pcap, sysmon]
---
