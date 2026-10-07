---
name: Windows Event Logs
summary: Structured logs written by Windows (.evtx). Your main source for who logged on, what ran, what changed and whether someone tried to hide it.
category: windows
coverage: intermediate
aliases: [evtx, Event Logs, Security log, Visor de eventos, Registros de eventos de Windows]
tags: [logons, lateral movement, execution, persistence, timeline]
start_here:
  - Define the time window and the host(s) in scope (UTC).
  - Collect or export `Security`, `System`, `PowerShell/Operational` and `Sysmon/Operational`.
  - Check the oldest event in each log — that is your visibility window.
  - Filter logons (`4624`/`4625`) for the user or host of interest.
  - Pivot to process creation (`4688` / Sysmon `1`) for the same logon session.
start_commands:
  - label: Recent successful logons (live)
    command: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddDays(-1)}"
  - label: Query an exported log
    command: "Get-WinEvent -FilterHashtable @{Path='.\\Security.evtx'; Id=4625}"
  - label: Export a log for offline analysis
    command: 'wevtutil epl Security C:\Cases\Security.evtx'
why:
  - Suspicious logon, brute force or password spraying alert.
  - Possible lateral movement (RDP, SMB, PsExec-style services).
  - Need to confirm what executed on a host and under which account.
  - Persistence suspected (new service, task or account).
  - Logs may have been cleared.
questions:
  - Who logged on — and with which logon type?
  - When, and from which host or IP?
  - What process executed, with which command line?
  - What changed — services, tasks, accounts, groups?
  - Was there lateral movement or log clearing?
locations:
  - label: Log files
    path: C:\Windows\System32\winevt\Logs\*.evtx
  - label: Useful logs
    path: Security · System · Application · Microsoft-Windows-PowerShell/Operational · Microsoft-Windows-Sysmon/Operational
look_for:
  - '`4624` (logon — check the logon type and source), `4625` (failed logon), `4672` (privileged logon), `4648` (explicit credentials).'
  - '`4688` process creation (command line only if auditing enables it).'
  - '`4104` PowerShell script block.'
  - '`7045` (System) / `4697` (Security) service installed; `4698` scheduled task created.'
  - '`4720` account created, `4732` / `4728` added to a group.'
  - '`1102` (Security) or `104` (System) — log cleared.'
tools_start: [Event Viewer, EvtxECmd]
tools_deeper: [Chainsaw, Hayabusa]
tool_questions:
  - tool: Event Viewer
    question: Quick look at a few events on one host.
  - tool: EvtxECmd
    question: All logs in one filterable timeline (CSV).
  - tool: Chainsaw
    question: Which events match known detection rules (Sigma)?
  - tool: Hayabusa
    question: Which events match known detection rules (Sigma), as a timeline?
correlate:
  - '`4624` logon (logon ID, source IP, type)'
  - '`4688` / Sysmon `1` process creation in the same session'
  - Sysmon `3` / `22` network and DNS
  - Persistence — `7045`, `4698`, Run keys
  - Other hosts — the source of the logon
extract:
  - Accounts involved and logon types
  - Source hosts and IPs
  - Process names, command lines and parent processes
  - Service, task and account names created
  - Timestamps (UTC) for the timeline
mistakes:
  - Event IDs are context-dependent — never treat a single event as proof of compromise.
  - Many events depend on audit policy (`4688` command line, `4698`) — absence of an event is not absence of activity.
  - Logs roll over; on busy servers the Security log may cover only hours.
  - Event Viewer shows local time; the `.evtx` stores UTC.
related_artifacts: [sysmon, powershell-logs, scheduled-tasks, registry]
---

### Logon types (4624 / 4625)

| Type | Meaning |
| --- | --- |
| 2 | Interactive (console) |
| 3 | Network (SMB, mapped drive, many remote admin tools) |
| 4 / 5 | Batch (scheduled task) / Service |
| 7 | Unlock |
| 9 | NewCredentials (`runas /netonly`) |
| 10 | RemoteInteractive (RDP) |
| 11 | CachedInteractive |
