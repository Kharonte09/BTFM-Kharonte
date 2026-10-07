---
name: Windows Registry
summary: Configuration database. During an investigation you mainly use it for persistence (what starts automatically) and user activity.
category: windows
coverage: basic
aliases: [Registry, hives, NTUSER.DAT, Registro, Registro de Windows]
tags: [persistence, user activity, configuration, autostart]
start_here:
  - Check the autostart locations first — `Run` / `RunOnce` under HKLM and HKCU.
  - List services and their `ImagePath`.
  - For offline analysis, collect the hives **with** their transaction logs.
  - Note key last-write times inside the incident window.
start_commands:
  - label: Run keys (live)
    command: "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'"
  - label: Services with binary path (live)
    command: 'Get-CimInstance Win32_Service | Select-Object Name, State, StartMode, PathName'
why:
  - Suspected persistence after a malware execution.
  - Need to know what a user opened or ran (user activity).
  - Service or autostart entry found during triage.
locations:
  - label: System hives
    path: C:\Windows\System32\config\SYSTEM · SOFTWARE · SAM · SECURITY
  - label: User hive
    path: C:\Users\<user>\NTUSER.DAT
  - label: Autostart keys
    path: HKLM\Software\Microsoft\Windows\CurrentVersion\Run · RunOnce (and HKCU)
look_for:
  - Run / RunOnce values pointing to `AppData`, `Temp`, `ProgramData` or scripts.
  - Services whose `ImagePath` is unusual or runs a script / LOLBin.
  - '`Winlogon` `Shell` / `Userinit` changes and `Image File Execution Options` `Debugger` entries.'
  - Key last-write times that match the incident timeline.
tools_start: [Registry Explorer, RECmd]
tools_deeper: [RegRipper]
correlate:
  - Autostart entry (Run key, service)
  - Binary it points to → hash and analyse it (PE)
  - When it was created — Sysmon `13`, `7045`
  - Which process / user created it
extract:
  - Key path, value name and data
  - Binary or command it launches
  - Last-write timestamp
mistakes:
  - Last-write time is per key, not per value — it does not tell you which value changed.
  - Without transaction logs (`.LOG1` / `.LOG2`) recent changes may be missing.
  - Many legitimate programs use Run keys — judge by path, signer and timing.
related_artifacts: [scheduled-tasks, windows-event-logs, sysmon, pe-executables]
---
