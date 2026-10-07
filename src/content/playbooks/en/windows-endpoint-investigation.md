---
name: Windows Endpoint Investigation
summary: Structured investigation of a potentially compromised Windows host — timeline, processes, logons, persistence, network, files, registry and user activity.
coverage: basic
order: 7
scenario: A compromised Windows host
icon: windows
tags: [endpoint, dfir, windows, timeline, lateral movement, persistence]
trigger: An endpoint is suspected compromised (EDR alert, malware detection, lateral movement indicator, user report). Decide early whether to acquire **memory** before containment or shutdown.
objective: Confirm or rule out compromise of a Windows host, and establish what happened, when, with which account and what persists.
initial_triage:
  - Decide whether to capture memory before containment or shutdown.
  - Collect a triage set (event logs, registry, Prefetch, LNK, tasks).
  - Anchor on the first known-bad event and fix the time window (UTC).
  - Review logons and process creation around that time.
  - Check persistence and outbound connections.
evidence:
  - Memory image (if captured)
  - Event logs — Security, System, PowerShell, Sysmon
  - Registry hives
  - Prefetch, LNK
  - Scheduled tasks and services
  - EDR / proxy / firewall logs
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
    tools: [PECmd]
    artifacts: [prefetch, sysmon, memory-dump]
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
    artifacts: [registry]
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
correlation:
  - Logon (`4624`) — account and source
  - Process creation (`4688` / Sysmon `1`)
  - Execution artifacts (Prefetch, LNK)
  - Network (Sysmon `3` / `22`, proxy)
  - Persistence (tasks, services, Run keys)
  - Source host of the logon
iocs:
  - Malicious file hashes and paths.
  - Compromised accounts and source hosts.
  - Persistence names (tasks, services, registry values).
  - C2 domains and IPs.
decision_points:
  - decision: close
    when: Activity explained and benign; no persistence or C2 found.
  - decision: isolate
    when: Confirmed malicious execution, C2 or attacker tooling on the host.
  - decision: escalate
    when: Privileged or domain accounts used, lateral movement, credential dumping, or logs cleared.
  - decision: deeper
    when: Unknown binary or script found — run Malware Triage / Suspicious PowerShell on it.
output:
  - Timeline (UTC) of the intrusion on the host
  - Accounts and source hosts involved
  - Malicious files, processes and persistence
  - IOCs to hunt across the fleet
  - Affected systems and severity
  - Containment and next actions
related_playbooks: [malware-triage, suspicious-powershell]
---

Keep everything in **UTC**, note the host's time zone, and record every action you take on a live system — it becomes part of the evidence.
