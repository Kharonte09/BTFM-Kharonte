---
name: Suspicious PowerShell
summary: Decode, deobfuscate and contextualise a PowerShell command — then find out who ran it, what it contacted and whether it persisted.
order: 5
scenario: Suspicious PowerShell in the logs
icon: terminal
trigger: An alert, log entry or EDR event shows PowerShell with encoded, obfuscated or download-and-execute content.
tags: [powershell, deobfuscation, living off the land, execution]
steps:
  - title: Command
    goal: Capture the exact command line and its source.
    actions:
      - Copy the full command line from the event (`4688`, Sysmon `1`, `4104`, EDR) — not from a truncated UI.
      - Record host, user, time (UTC) and event source.
    artifacts: [powershell-logs, sysmon, windows-event-logs]
  - title: Encoding
    goal: Remove transport encoding.
    actions:
      - '`-EncodedCommand` / `-enc` → Base64 of **UTF-16LE** text.'
      - Look for nested layers — Base64 + Gzip/Deflate (`IO.Compression`), char arrays, `-bxor`.
    tools: [CyberChef]
  - title: Deobfuscation
    goal: Recover readable logic without executing it.
    actions:
      - Resolve concatenations, `-f` format strings, reversed strings, tick marks and case tricks.
      - Prefer the **`4104` script block** — it often already contains the de-obfuscated layer.
      - Never `IEX` decoded content to "see what it does"; replace `IEX` with output to a file if you must evaluate in a sandbox.
    tools: [CyberChef]
    artifacts: [powershell-logs]
  - title: Execution context
    goal: Understand under which identity and privileges it ran.
    actions:
      - User account, integrity level, interactive vs. service/task, logon session.
      - Correlate with logon events for the same session.
    artifacts: [windows-event-logs]
  - title: Parent process
    goal: Find what launched PowerShell.
    actions:
      - Office apps, `mshta.exe`, `wscript.exe`, `wmiprvse.exe`, `services.exe`, `svchost.exe` (task) — each points to a different initial vector.
      - Walk the process tree up to the origin.
    artifacts: [sysmon]
  - title: Network activity
    goal: Identify download sources and C2.
    actions:
      - Extract URLs/IPs from the decoded script; check proxy, DNS and Sysmon `3`/`22` around the execution time.
      - Retrieve downloaded payloads (from disk, proxy cache or the URL in a sandbox).
    artifacts: [ip-domain, pcap]
  - title: Persistence
    goal: Check whether it will run again.
    actions:
      - Scheduled tasks, Run keys, services and WMI subscriptions created around the same time.
      - Check if the same command appears in a task action or service image path.
    artifacts: [scheduled-tasks, registry]
  - title: IOCs
    goal: Extract indicators and detections.
    actions:
      - URLs, domains, IPs, downloaded file hashes, file paths, task/service names.
      - Distinctive script fragments for hunting in `4104` across the fleet.
iocs:
  - Download URLs, domains and IPs.
  - Hashes of downloaded payloads.
  - Distinctive script strings (variable names, function names, user agents).
  - Persistence artefacts (task names, registry values).
escalate_when:
  - The script downloads and executes a second stage.
  - AMSI bypass, credential access (e.g. LSASS) or lateral movement is present.
  - The parent is a server process (web server, SQL) — possible exploitation.
related_playbooks: [windows-endpoint-investigation, suspicious-exe]
---

PowerShell is a legitimate administration tool — the question is never "was PowerShell used" but **what it did, who ran it and why**.
