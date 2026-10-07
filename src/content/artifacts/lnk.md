---
name: LNK Shortcut Files
summary: Windows shortcut files. Created automatically when users open files, and abused as phishing payloads that launch commands.
category: windows
aliases: [LNK, .lnk, Shortcut]
tags: [user activity, phishing, initial access, file access]
evidence:
  - The target file path and, often, its MAC timestamps and size at the time of access.
  - Volume information (drive type, serial number, label) — local, removable or network.
  - Machine identifiers (NetBIOS name, MAC address in the tracker block) of the system where the target lived.
  - For malicious LNKs, the command line and arguments executed, and the icon path used for disguise.
locations:
  - label: Recent files (automatic)
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent\
  - label: Office recent files
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Office\Recent\
  - label: Desktop / Startup folder
    path: C:\Users\<user>\Desktop\ · ...\Start Menu\Programs\Startup\
  - label: Phishing delivery
    path: Inside ZIP / ISO / VHD attachments or downloads
questions:
  - Did this user open a given file, and when?
  - Was the file on a USB drive or a network share?
  - What does this suspicious shortcut actually execute?
  - On which machine was the LNK created?
tools: [LECmd, KAPE, CyberChef, Timeline Explorer]
look_for:
  - Targets such as `cmd.exe`, `powershell.exe`, `mshta.exe`, `rundll32.exe`, `conhost.exe` with long arguments.
  - Arguments padded with whitespace to hide the real command in the Properties dialog.
  - Icon locations pointing to document or folder icons to disguise the shortcut.
  - LNKs in the Startup folder (persistence).
  - Recent LNKs referencing files on removable volumes around exfiltration time.
limitations:
  - Recent-items LNKs record the most recent access; earlier accesses are overwritten.
  - Users and cleanup tools can delete them; settings can disable recent-items tracking.
  - Embedded timestamps are those of the **target** file, not of the LNK.
related_artifacts: [eml, powershell-logs, prefetch]
review: true
---

A `.lnk` file is a binary structure (Shell Link format) that points to a target. Windows creates them automatically for recently opened files, which makes them good evidence of **file access**. Attackers also deliver LNKs directly — often inside archives or disk images — because a double-click runs the embedded command line.

Parse them with **LECmd** (Eric Zimmerman) rather than trusting the Properties dialog, which can truncate long arguments.
