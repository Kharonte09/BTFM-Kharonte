---
name: Log clearing
summary: Someone wiped an event log to hide what came before. The clearing leaves its own event — find who did it, when, and rebuild the gap from the logs that survived.
order: 3
platforms: [Windows]
mitre: [T1070.001]
coverage: basic
review: true
aliases: [cleared logs, event log cleared, anti-forensics]
tags: [defense evasion, anti-forensics, 1102, 104, event logs]
start_here:
  - Look for `1102` in Security and `104` in System.
  - Note the account that cleared the log and the exact time (UTC).
  - Check the oldest event of each log — that is where your visibility starts.
  - Rebuild the gap from what was not cleared (Sysmon, PowerShell, other hosts, the SIEM).
signs:
  - A `1102` / `104` event — often the first event in the log.
  - A log whose oldest event is far more recent than the others on the same host.
  - '`wevtutil cl` or `Clear-EventLog` in process creation or PowerShell logs.'
  - Clearing right after logons, new accounts or tool execution.
sources:
  - source: Security log
    look: '`1102` — the audit log was cleared; names the account that did it.'
  - source: System log
    look: '`104` — a log file was cleared (any other log: System, Application, PowerShell…).'
  - source: Process creation / PowerShell
    look: '`4688` / Sysmon `1` with `wevtutil cl`; `4104` with `Clear-EventLog`.'
hunts:
  - source: Windows — live (PowerShell as administrator)
    note: 'To query an exported log, swap `LogName=''…''` for `Path=''.\Security.evtx''`.'
    commands:
      - label: Security log cleared
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102} | Format-List TimeCreated, Message
      - label: Any other log cleared
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='System'; Id=104} | Format-List TimeCreated, Message
      - label: Oldest event of a log — your visibility window
        command: |-
          Get-WinEvent -LogName Security -MaxEvents 1 -Oldest | Select-Object TimeCreated, Id
      - label: The command that cleared it (Sysmon)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Where-Object { $_.Message -match 'wevtutil(\.exe)?"?\s+(cl|clear-log)\s|Clear-EventLog' } | Format-List TimeCreated, Message
      - label: Clearing from PowerShell (script blocks)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104} | Where-Object { $_.Message -match 'Clear-EventLog|Remove-EventLog|wevtutil' } | Format-List TimeCreated, Message
confirm:
  - The account in the `1102` is not an administrator doing maintenance — or it is one that was just compromised.
  - Suspicious activity in the surviving logs immediately before the clearing.
  - Several logs cleared within the same minute.
false_positives:
  - An administrator clearing logs during maintenance, imaging or troubleshooting — expected account, documented.
  - Lab and freshly built machines.
  - Rotation is not clearing — a full log overwriting old events produces no `1102` / `104`.
extract:
  - Account that cleared the log and its logon ID
  - Time of clearing (UTC) and which logs were cleared
  - Command line and parent process, if recorded
  - The gap — last event known elsewhere vs first event after the clearing
mistakes:
  - Treating a cleared log as "no evidence" — the clearing is evidence, and other logs usually cover the gap.
  - Checking only Security — attackers often clear one log and leave Sysmon or PowerShell untouched.
  - Forgetting forwarded copies — the SIEM or a collector may still have what was wiped locally.
tools: [Event Viewer, EvtxECmd, Chainsaw, Hayabusa]
related_artifacts: [windows-event-logs, sysmon, powershell-logs]
related_playbooks: [windows-endpoint-investigation]
---
