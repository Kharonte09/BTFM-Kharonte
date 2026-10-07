---
name: PowerShell Logs
summary: Command lines, script block logs (4104) and console history. Start here when you see suspicious PowerShell — decode it, then find who ran it and what it touched.
category: windows
coverage: basic
aliases: [Script Block Logging, 4104, PSReadLine, Suspicious PowerShell]
tags: [powershell, execution, deobfuscation, living off the land]
start_here:
  - Get the **full** command line (`4688`, Sysmon `1`, EDR) — not a truncated UI view.
  - Look for the matching `4104` script block — it often shows the deobfuscated code.
  - Identify the parent process and the user.
  - Decode encoded content without executing it.
  - Check network activity and persistence around the same time.
start_commands:
  - label: Recent script blocks (live)
    command: "Get-WinEvent -LogName 'Microsoft-Windows-PowerShell/Operational' -FilterXPath '*[System[EventID=4104]]' -MaxEvents 50"
  - label: Decode -EncodedCommand (UTF-16LE) without running it
    command: '[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($b64))'
why:
  - Alert on encoded or obfuscated PowerShell.
  - PowerShell launched by Office, a browser, `mshta.exe` or `wscript.exe`.
  - Download-and-execute behaviour in proxy or EDR telemetry.
  - Need to know what an attacker typed on a host.
questions:
  - What exactly did the command or script do?
  - Who ran it, and which process launched it?
  - Did it download or contact anything?
  - Did it create persistence?
locations:
  - label: Script block / module logging
    path: Microsoft-Windows-PowerShell/Operational (4104, 4103)
  - label: Engine start/stop
    path: Windows PowerShell.evtx (400 / 403)
  - label: Console history
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
look_for:
  - '`-EncodedCommand` / `-enc`, `-NoProfile`, `-WindowStyle Hidden`, `-ExecutionPolicy Bypass`.'
  - '`IEX` / `Invoke-Expression`, `DownloadString`, `Invoke-WebRequest`, `Net.WebClient`.'
  - '`FromBase64String`, `-bxor`, `[char]` arrays, string concatenation and reversal.'
  - References to `AmsiUtils` or `amsiInitFailed` (AMSI tampering).
  - '`4104` events logged at **Warning** level — Windows flags them as suspicious.'
tools_start: [CyberChef, Event Viewer]
tools_deeper: [EvtxECmd]
tool_questions:
  - tool: CyberChef
    question: What does the encoded / obfuscated content really say?
  - tool: Event Viewer
    question: Which script blocks ran on this host, and when?
  - tool: EvtxECmd
    question: All PowerShell events across hosts in one timeline.
correlate:
  - Command line — `4688` / Sysmon `1`
  - Parent process and user
  - Script block — `4104`
  - Network — Sysmon `3` / `22`, proxy
  - Files written — Sysmon `11`
  - Persistence — tasks, Run keys, services
extract:
  - Download URLs, domains and IPs
  - Hashes of downloaded payloads
  - Distinctive script strings (function names, variables, user agents)
  - Task, service or registry names created
mistakes:
  - These indicators are not malicious by themselves — admins and software use `-enc`, `-NoProfile` and `IEX` legitimately.
  - Never run decoded content to "see what it does"; decode it as text.
  - Script block logging may be disabled; PowerShell v2 bypasses it.
  - Large scripts are split across several `4104` events — rebuild the whole script before concluding.
related_artifacts: [windows-event-logs, sysmon, scheduled-tasks]
---
