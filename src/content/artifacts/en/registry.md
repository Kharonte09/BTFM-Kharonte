---
name: Windows Registry
summary: Hierarchical configuration database. Holds persistence locations, user activity, devices, services and execution traces.
category: windows
aliases: [Registry, hives, NTUSER.DAT]
tags: [persistence, user activity, configuration, usb, execution]
evidence:
  - Autostart / persistence configuration (Run keys, services, Winlogon, IFEO…).
  - User activity — recently opened files, typed paths, folders browsed (ShellBags), UserAssist.
  - Connected USB devices and mounted volumes.
  - System configuration — computer name, time zone, network interfaces, last shutdown.
locations:
  - label: System hives
    path: C:\Windows\System32\config\SYSTEM · SOFTWARE · SAM · SECURITY
  - label: User hive
    path: C:\Users\<user>\NTUSER.DAT
  - label: User classes hive
    path: C:\Users\<user>\AppData\Local\Microsoft\Windows\UsrClass.dat
  - label: Transaction logs
    path: <hive>.LOG1 · <hive>.LOG2
questions:
  - What starts automatically on this host or at user logon?
  - Which programs did this user run via Explorer (UserAssist)?
  - Which folders and files did the user open?
  - Which USB devices were connected and when?
  - What was the system's time zone (to interpret local timestamps)?
tools: [RECmd, Registry Explorer, RegRipper, KAPE, Velociraptor]
look_for:
  - '`HKLM\Software\Microsoft\Windows\CurrentVersion\Run` / `RunOnce` and the same under `HKCU`.'
  - '`HKLM\SYSTEM\CurrentControlSet\Services\<name>\ImagePath` pointing to unusual paths.'
  - '`HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon` (`Shell`, `Userinit`).'
  - '`...\Image File Execution Options\<exe>\Debugger` entries.'
  - '`HKCU\Software\Classes\CLSID` entries that shadow system COM objects (COM hijacking).'
  - Key last-write times inside the incident window.
limitations:
  - Last-write timestamps exist per key, not per value.
  - Without transaction logs, recent changes may be missing from a dirty hive.
  - Live system hives are locked — collect with a forensic tool (KAPE, Velociraptor, FTK Imager).
  - Many artifacts are version-specific; verify the Windows build before interpreting.
related_artifacts: [scheduled-tasks, windows-event-logs]
---

The registry is stored in **hive** files. System-wide hives live under `C:\Windows\System32\config\`, and each user has `NTUSER.DAT` and `UsrClass.dat` in their profile. `CurrentControlSet` is a runtime link — in an offline `SYSTEM` hive, check `Select\Current` to know which `ControlSet00X` was active.

See the **Persistence Locations** cheatsheet for the most common autostart keys.
