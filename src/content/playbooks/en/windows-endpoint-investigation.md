---
name: Windows Endpoint Investigation
summary: Structured investigation of a potentially compromised Windows host — timeline, processes, logons, persistence, network, files, registry and user activity.
order: 7
scenario: A compromised Windows host
icon: windows
trigger: An endpoint is suspected compromised (EDR alert, malware detection, lateral movement indicator, user report). Decide early whether to acquire **memory** before containment or shutdown.
tags: [endpoint, dfir, windows, timeline, lateral movement, persistence]
steps:
  - title: Timeline
    goal: Collect and build a timeline anchored on a known event.
    actions:
      - Acquire memory if the host is running and it matters; then collect a triage set.
      - Parse artifacts to CSV and merge on a single UTC timeline.
      - Anchor on the first known-bad event and work backwards and forwards.
    tools: [KAPE, Velociraptor, EvtxECmd, MFTECmd]
    artifacts: [memory-dump, windows-event-logs]
  - title: Processes
    goal: Identify malicious or anomalous execution.
    actions:
      - Review process trees (EDR, Sysmon `1`, `4688`, memory).
      - Check execution artifacts for binaries run in the window.
    tools: [PECmd, AmcacheParser]
    artifacts: [prefetch, amcache, shimcache, sysmon, memory-dump]
  - title: Logons
    goal: Determine which accounts were used and from where.
    actions:
      - '`4624`/`4625`/`4648`/`4672` with logon types and source addresses; RDP logs.'
      - Identify the source host of lateral movement and pivot to it.
    tools: [EvtxECmd]
    artifacts: [windows-event-logs]
    escalate: Privileged or domain accounts used from unexpected hosts → widen scope to the domain.
  - title: Persistence
    goal: Find every mechanism that would let the attacker return.
    actions:
      - Services (`7045`), scheduled tasks, Run keys, WMI subscriptions, startup folders, new accounts.
    tools: [RECmd, Velociraptor]
    artifacts: [scheduled-tasks, registry, windows-event-logs]
  - title: Network
    goal: Identify C2 and lateral connections.
    actions:
      - Connections by process (Sysmon `3`, EDR, memory `netscan`), DNS (Sysmon `22`), firewall/proxy logs.
    artifacts: [sysmon, memory-dump, ip-domain]
  - title: Files
    goal: Find dropped tools, staged data and deleted files.
    actions:
      - '`$MFT` and USN journal for creations, renames and deletions in the window.'
      - Collect suspicious files for malware triage.
    tools: [MFTECmd]
    artifacts: [pe-executables]
  - title: Registry
    goal: Recover configuration changes and evidence of execution/use.
    actions:
      - Autostarts, services, IFEO, COM hijacks; BAM, UserAssist; USB devices.
    tools: [RECmd]
    artifacts: [registry, shimcache]
  - title: User activity
    goal: Understand what the user (or attacker as the user) did.
    actions:
      - LNK / Jump Lists, ShellBags, browser history, PowerShell history.
    artifacts: [lnk, powershell-logs]
  - title: IOCs
    goal: Consolidate findings for scoping and containment.
    actions:
      - Hashes, paths, accounts, source hosts, domains/IPs, persistence names.
      - Hunt for them across the fleet before declaring the scope.
    tools: [Velociraptor, YARA]
iocs:
  - Malicious file hashes and paths.
  - Compromised accounts and source hosts.
  - Persistence names (tasks, services, registry values).
  - C2 domains and IPs.
escalate_when:
  - Domain admin or service accounts are involved.
  - Evidence of credential dumping or lateral movement to other hosts.
  - Data staging or exfiltration indicators.
  - Logs were cleared or security tools tampered with.
related_playbooks: [malware-triage, suspicious-powershell]
---

Keep everything in **UTC**, note the host's time zone, and record every action you take on a live system — it becomes part of the evidence.
