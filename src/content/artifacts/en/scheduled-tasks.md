---
name: Scheduled Tasks
summary: Tasks registered with the Windows Task Scheduler. A common persistence and remote-execution mechanism.
category: windows
aliases: [Task Scheduler, schtasks]
tags: [persistence, lateral movement, execution]
evidence:
  - Task definition — trigger, action (command + arguments), principal (user), author and registration date.
  - Creation, update, deletion and execution events in the logs.
locations:
  - label: Task XML files
    path: C:\Windows\System32\Tasks\
  - label: Registry cache
    path: HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache\Tree · \Tasks
  - label: Operational log
    path: Microsoft-Windows-TaskScheduler/Operational
questions:
  - Was persistence created via a scheduled task, and by whom?
  - What command does the task run, and as which user?
  - Was a task created remotely (lateral movement)?
  - When did the task run?
tools: [Velociraptor, KAPE, EvtxECmd, RECmd, PowerShell]
look_for:
  - Actions running scripts or binaries from `AppData`, `Temp`, `ProgramData` or `Users\Public`.
  - '`powershell.exe` / `cmd.exe` / `mshta.exe` actions with encoded or long arguments.'
  - Task names imitating legitimate Microsoft or vendor tasks but in the wrong folder.
  - 'Security `4698` (created) / `4702` (updated) and TaskScheduler `106` (registered), `140` (updated), `141` (deleted), `200`/`201` (action started/completed).'
  - Tasks present in the registry `TaskCache` but missing an XML file, or missing a security descriptor (hidden tasks).
limitations:
  - Security `4698`–`4702` require the "Other Object Access Events" audit subcategory.
  - The TaskScheduler Operational log may be disabled or small on older systems.
  - Task XML can be modified after creation; check both XML and registry.
related_artifacts: [windows-event-logs, registry, powershell-logs]
---

Scheduled tasks are stored both as XML files under `C:\Windows\System32\Tasks\` and in the registry `TaskCache`. Comparing both sources helps detect tampering, such as tasks hidden by removing their security descriptor.

Remote creation (`schtasks /create /s <host>`, or via the Task Scheduler RPC interface) is a common lateral-movement technique; correlate with network logons (`4624` type 3) on the target.
