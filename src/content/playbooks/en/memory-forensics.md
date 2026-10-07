---
name: Memory Forensics
summary: Analyse a Windows memory image with Volatility 3 — processes, command lines, network, injection, persistence — and extract artifacts and IOCs.
order: 8
trigger: You have a RAM image (`.raw`, `.mem`, `.vmem`, `.dmp`) from an acquisition, a VM snapshot or a lab challenge, and need to know what was running.
tags: [memory, volatility, processes, injection, btlo]
questions:
  - Which OS and build does the image come from, and when was it captured?
  - Which process is malicious (name, PID, parent PID, path)?
  - What command line was used to start it?
  - Which remote IP and port does it connect to?
  - Is there injected code, and in which process?
  - Which persistence mechanism was created?
  - What is the hash of the extracted malicious file?
steps:
  - title: Identify the image
    goal: Confirm the OS and that Volatility can parse the image.
    actions:
      - Hash the image and record it.
      - '`vol -f mem.raw windows.info` — build, architecture and system time (capture time).'
    tools: [Volatility 3]
    artifacts: [memory-dump]
  - title: Processes
    goal: Find suspicious processes and their relationships.
    actions:
      - '`windows.pstree` — parent/child tree; `windows.pslist` vs `windows.psscan` — processes missing from the list may be hidden or terminated.'
      - Wrong parent (e.g. `svchost.exe` not from `services.exe`), wrong path, misspelled names, unusual start times.
    tools: [Volatility 3]
  - title: Command lines
    goal: See how each suspicious process was launched.
    actions:
      - '`windows.cmdline` — arguments, encoded PowerShell, LOLBins, paths in `AppData` / `Temp`.'
    tools: [Volatility 3]
    escalate: Encoded PowerShell → decode it with the Suspicious PowerShell playbook.
  - title: Network
    goal: Link connections to processes.
    actions:
      - '`windows.netscan` — local/remote address and port, state and owning PID.'
      - Note remote IPs for enrichment and correlate with proxy / firewall logs or a PCAP.
    tools: [Volatility 3]
    artifacts: [ip-domain, pcap]
  - title: Injection
    goal: Find code that does not belong to the process image.
    actions:
      - '`windows.malfind` — private executable memory, often with an `MZ` header or shellcode.'
      - '`windows.dlllist --pid <pid>` — DLLs loaded from odd paths; `windows.handles --pid <pid>` — mutexes, files, registry keys.'
    tools: [Volatility 3]
  - title: Persistence
    goal: Identify how the malware survives a reboot.
    actions:
      - '`windows.svcscan` — services and their binary paths.'
      - '`windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"` — Run keys present in memory.'
    tools: [Volatility 3]
    artifacts: [registry, scheduled-tasks]
  - title: Extract
    goal: Recover binaries and files for further analysis.
    actions:
      - '`windows.pslist --pid <pid> --dump` (process image) or `windows.dumpfiles --pid <pid>` into an output directory (`-o out/`).'
      - '`windows.filescan` to locate file objects by name before dumping.'
      - Hash the extracted files and continue with Malware Triage; scan memory or dumps with YARA.
    tools: [Volatility 3, YARA]
  - title: IOCs
    goal: Consolidate findings.
    actions:
      - Process names and PIDs, command lines, remote IPs/ports, mutexes, persistence entries, hashes of extracted files.
iocs:
  - Malicious process names, paths and hashes.
  - Command lines.
  - Remote IPs, ports and domains.
  - Mutexes and named pipes.
  - Persistence entries (services, Run keys, tasks).
escalate_when:
  - Credential theft from LSASS is likely.
  - Injection into system processes or a rootkit-like hiding technique is found.
  - The same IOCs appear on other hosts.
related_playbooks: [windows-endpoint-investigation, malware-triage, suspicious-powershell]
---

Plugin names and options change between Volatility 3 releases — run `vol -h` and `vol <plugin> -h` to confirm them for your version. Volatility 3 needs symbol tables for the target OS build; by default it tries to download Windows symbols, which matters on offline analysis machines.
