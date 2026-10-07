---
name: PowerShell Logs
summary: Script block, module and engine logging, transcripts and console history. The main source for reconstructing PowerShell activity.
category: windows
aliases: [PowerShell, Script Block Logging, 4104, PSReadLine]
tags: [powershell, execution, deobfuscation, living off the land]
evidence:
  - The content of executed script blocks (`4104`), often after de-obfuscation layers are resolved.
  - Pipeline and module execution details (`4103`).
  - Engine start/stop with host application and command line (Windows PowerShell log `400`/`403`).
  - Interactive commands typed by a user (PSReadLine history).
locations:
  - label: Operational log
    path: Microsoft-Windows-PowerShell/Operational
  - label: Classic log
    path: Windows PowerShell.evtx
  - label: Console history
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
  - label: Transcripts (if enabled)
    path: Configured output directory (default under the user's Documents folder)
questions:
  - What exactly did the PowerShell command or script do?
  - Was an encoded command or a download cradle executed?
  - Which user and which parent process launched PowerShell?
  - Was AMSI or logging tampered with?
tools: [EvtxECmd, CyberChef, Hayabusa, Chainsaw, PowerShell]
look_for:
  - '`-EncodedCommand` / `-enc`, `-NoProfile`, `-WindowStyle Hidden`, `-ExecutionPolicy Bypass`.'
  - Download cradles — `Net.WebClient`, `DownloadString`, `Invoke-WebRequest`, `iwr`, `Start-BitsTransfer`.
  - '`IEX` / `Invoke-Expression` on downloaded or decoded content.'
  - '`FromBase64String`, `-bxor`, `[char]` arrays, string reversal and concatenation obfuscation.'
  - References to `AmsiUtils`, `amsiInitFailed`, or reflection tampering.
  - '`4104` events logged at **Warning** level — Windows flags script blocks it considers suspicious.'
limitations:
  - Script block and module logging must be enabled by policy for full coverage.
  - Large scripts are split across multiple `4104` events (check the message number / total fields).
  - PowerShell v2 (if installed) bypasses script block logging — look for version downgrades.
  - PSReadLine history only covers interactive console sessions and can be cleared.
related_artifacts: [windows-event-logs, sysmon, scheduled-tasks]
---

PowerShell has several independent logging sources. **Script block logging** (`4104`) is the most valuable because it records the code that the engine actually compiles — after layers such as `-EncodedCommand` or string concatenation have been resolved.

Even without explicit configuration, Windows PowerShell 5 and later automatically logs script blocks that contain suspicious content at Warning level.
