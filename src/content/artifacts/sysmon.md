---
name: Sysmon
summary: Sysinternals System Monitor. Driver-based logging of process creation, network connections, file and registry activity to an event log channel.
category: windows
aliases: [System Monitor, Sysmon logs]
tags: [process creation, network, detection, telemetry, execution]
evidence:
  - Process creation with full command line, hashes, parent process and user.
  - Network connections attributed to a process.
  - File creation, registry modification, DNS queries and image loads (depending on configuration).
  - Process access and remote thread creation (common for credential theft and injection).
locations:
  - label: Event log channel
    path: Microsoft-Windows-Sysmon/Operational
  - label: Log file
    path: C:\Windows\System32\winevt\Logs\Microsoft-Windows-Sysmon%4Operational.evtx
questions:
  - What process started this process (parent chain)?
  - Which process made this network connection or DNS query?
  - What file did this process write, and what is its hash?
  - Did a process access `lsass.exe` memory?
  - Was a remote thread created in another process?
tools: [EvtxECmd, Hayabusa, Chainsaw, Velociraptor, Event Viewer]
look_for:
  - 'Event `1` — Office apps, browsers or `wmiprvse.exe` spawning `cmd.exe` / `powershell.exe`.'
  - 'Event `3` — network connections from processes that should not talk to the internet.'
  - 'Event `10` — `TargetImage` `lsass.exe` with suspicious `GrantedAccess` from unusual sources.'
  - 'Event `8` — `CreateRemoteThread` into another process.'
  - 'Event `11` — executables or scripts written to user-writable paths.'
  - 'Events `12`/`13` — Run key and service modifications.'
  - 'Event `22` — DNS queries to rare or newly seen domains.'
limitations:
  - Not installed by default — it must be deployed with a configuration.
  - Logs only what the configuration includes; noisy events are often filtered out.
  - Event `3` and `22` coverage depends heavily on the config and can be disabled for volume.
  - An attacker with admin rights can unload the driver or change the configuration (look for event `16` and service stops).
related_artifacts: [windows-event-logs, powershell-logs, pcap]
---

Sysmon is a free Microsoft Sysinternals tool installed as a service and driver. It writes detailed telemetry to its own event log channel, controlled by an XML configuration that defines which events are included or excluded.

Widely used community configurations (e.g. SwiftOnSecurity's `sysmon-config`, Olaf Hartong's `sysmon-modular`) are good starting points. Always check **which configuration was deployed** before concluding that something did *not* happen.

See the **Windows Event IDs** cheatsheet for the full Sysmon event list.
