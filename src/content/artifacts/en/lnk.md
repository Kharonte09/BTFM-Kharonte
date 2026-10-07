---
name: LNK Files
summary: Windows shortcuts. Two reasons to care — they prove a user opened a file, and attackers deliver them as payloads that run commands.
category: windows
coverage: intermediate
aliases: [LNK Shortcut Files, LNK, .lnk, Shortcut, Acceso directo, Accesos directos LNK]
tags: [user activity, phishing, initial access, file access]
start_here:
  - 'Decide which case it is: a **recent-items** LNK (user activity) or a **delivered** LNK (payload).'
  - Parse it with a tool — the Properties dialog truncates long arguments.
  - Read the target path, arguments and working directory.
  - Note the target's timestamps, volume (local / USB / network) and machine info.
start_commands:
  - label: Parse a single LNK
    command: 'LECmd.exe -f "C:\Cases\sample.lnk"'
  - label: Parse a Recent folder to CSV
    command: 'LECmd.exe -d "C:\Cases\triage\C\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent" --csv "C:\Cases\out"'
why:
  - Phishing delivered an LNK inside a ZIP / ISO / IMG.
  - Need to know whether a user opened a file, and from where (USB, share).
  - Possible persistence in the Startup folder.
locations:
  - label: Recent items
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent\
  - label: Startup folder
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\
look_for:
  - Targets like `cmd.exe`, `powershell.exe`, `mshta.exe`, `rundll32.exe` with long arguments.
  - Arguments padded with spaces to hide the real command.
  - Icon pointing to a document or folder icon to disguise the shortcut.
  - Targets on removable volumes or network shares.
tools_start: [LECmd]
tools_deeper: [CyberChef]
correlate:
  - LNK target and arguments
  - Process creation — `4688` / Sysmon `1`
  - Prefetch of the launched binary
  - Network / download of the next stage
extract:
  - Target path and full command line
  - URLs, IPs or file names in the arguments
  - Volume serial, machine name / MAC (where the target lived)
mistakes:
  - Embedded timestamps are those of the **target**, not of the LNK file.
  - Recent-items LNKs keep only the latest access — earlier opens are overwritten.
  - Don't double-click a delivered LNK to "see what it does".
related_artifacts: [eml, prefetch, powershell-logs]
---
