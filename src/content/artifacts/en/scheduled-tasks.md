---
name: Scheduled Tasks
summary: One of the most common persistence and remote-execution mechanisms. Check them in almost every endpoint triage.
category: windows
coverage: basic
aliases: [Task Scheduler, schtasks, Tareas programadas, Programador de tareas]
tags: [persistence, lateral movement, execution]
start_here:
  - List the enabled tasks and what each one executes.
  - Look at tasks created or modified in the incident window.
  - Read the action (command + arguments) and the user it runs as.
  - Check the creation events (`4698`, TaskScheduler `106`).
start_commands:
  - label: Enabled tasks (live)
    command: "Get-ScheduledTask | Where-Object State -ne 'Disabled' | Select-Object TaskPath, TaskName, State"
  - label: What a task runs
    command: "(Get-ScheduledTask -TaskName '<name>').Actions"
  - label: All tasks, verbose (cmd)
    command: 'schtasks /query /fo LIST /v'
why:
  - Suspected persistence after malware execution.
  - Possible lateral movement (`schtasks /create /s <host>`).
  - Something runs again after being killed or after reboot.
locations:
  - label: Task XML files
    path: C:\Windows\System32\Tasks\
  - label: Operational log
    path: Microsoft-Windows-TaskScheduler/Operational
look_for:
  - Actions running scripts or binaries from `AppData`, `Temp`, `ProgramData` or `Users\Public`.
  - '`powershell.exe`, `cmd.exe`, `mshta.exe` actions with encoded or long arguments.'
  - Names imitating Microsoft or vendor tasks in the wrong folder.
  - 'Security `4698` (created) / `4702` (updated); TaskScheduler `106` (registered), `200`/`201` (ran).'
tools_start: [PowerShell, Event Viewer]
tools_deeper: [EvtxECmd]
correlate:
  - Task (name, action, author, date)
  - Creation event — `4698` / TaskScheduler `106`
  - Logon that created it — `4624` (type 3 = remote)
  - Binary or script it runs → PE / PowerShell analysis
extract:
  - Task name and path
  - Command, arguments and run-as user
  - Creation time and creating account
mistakes:
  - '`4698`–`4702` need the "Other Object Access Events" audit subcategory — no event is not proof.'
  - Plenty of legitimate tasks run PowerShell — judge by path, author and timing.
  - Deleting the task before collecting it destroys evidence — export first.
related_artifacts: [windows-event-logs, registry, powershell-logs]
---
