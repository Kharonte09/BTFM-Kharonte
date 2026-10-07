---
name: Windows Event Logs
summary: Structured logs written by Windows and applications (.evtx). Primary source for logons, process creation, services, tasks and log tampering.
category: windows
aliases: [evtx, Event Logs, Security log]
tags: [logons, lateral movement, execution, persistence, timeline]
evidence:
  - Authentication — successful and failed logons, logon type, source host and account.
  - Process creation (if auditing is enabled) including command line.
  - Service installation, scheduled task creation, account and group changes.
  - Log clearing and audit-policy changes.
locations:
  - label: Log files
    path: C:\Windows\System32\winevt\Logs\*.evtx
  - label: Main channels
    path: Security.evtx · System.evtx · Application.evtx
  - label: Useful operational logs
    path: Microsoft-Windows-PowerShell%4Operational.evtx · Microsoft-Windows-Sysmon%4Operational.evtx · Microsoft-Windows-TaskScheduler%4Operational.evtx · Microsoft-Windows-TerminalServices-*.evtx
questions:
  - Who logged in, when, and from where?
  - Which logon type was used (interactive, network, RDP)?
  - What process executed, and with which command line?
  - Was there lateral movement (network logons, explicit credentials, remote services)?
  - Was persistence created (service, scheduled task, new account)?
  - Were logs cleared?
tools: [EvtxECmd, Event Viewer, Hayabusa, Chainsaw, Velociraptor, KAPE]
look_for:
  - '`4624` logon type 3 or 10 from unexpected hosts; `4625` bursts (brute force / spraying).'
  - '`4648` explicit credentials and `4672` special privileges right after a logon.'
  - '`4688` / Sysmon `1` with LOLBins or encoded command lines.'
  - '`7045` new services with paths in `%TEMP%`, `ADMIN$` or PowerShell one-liners.'
  - '`4698` / TaskScheduler `106` new scheduled tasks.'
  - '`1102` (Security) or `104` (System) — log cleared.'
  - Gaps in the timeline — logging stopped or rolled over.
limitations:
  - Many valuable events depend on **audit policy** (e.g. `4688` command line, object access) and are off by default.
  - Logs have a maximum size and roll over; on busy servers the Security log may cover only hours.
  - Attackers with admin rights can clear or tamper with logs.
  - Timestamps are UTC in the file; viewers display them in local time.
related_artifacts: [sysmon, powershell-logs, scheduled-tasks, registry]
---

Windows writes events to channels stored as `.evtx` files. The **Security** log holds authentication and auditing events, **System** holds service and driver events, and many components keep their own *Operational* logs (PowerShell, Task Scheduler, RDP, Defender, Sysmon).

For investigations, parse the logs into a single timeline rather than browsing them one by one in Event Viewer. See the **Windows Event IDs** cheatsheet for the most useful IDs.

### Logon types (4624 / 4625)

| Type | Meaning |
| --- | --- |
| 2 | Interactive (console) |
| 3 | Network (SMB, mapped drive, many remote admin tools) |
| 4 | Batch (scheduled tasks) |
| 5 | Service |
| 7 | Unlock |
| 8 | NetworkCleartext |
| 9 | NewCredentials (`runas /netonly`) |
| 10 | RemoteInteractive (RDP) |
| 11 | CachedInteractive |
