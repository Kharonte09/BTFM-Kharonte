---
name: Sysmon
summary: Sysinternals System Monitor logs. Process creation with command line and hashes, network connections, file and registry activity — the best source to rebuild a process tree.
category: windows
coverage: basic
aliases: [System Monitor, Sysmon logs]
tags: [process creation, network, detection, telemetry, execution]
start_here:
  - Confirm Sysmon is installed and which configuration is deployed — it only logs what the config includes.
  - Filter Event `1` (process creation) for the host and time window.
  - Rebuild the process tree from `ParentImage` / `ParentProcessGuid`.
  - Pivot from the suspicious process to Events `3` (network), `11` (files) and `13` (registry).
start_commands:
  - label: Recent process creation events (live)
    command: "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} -MaxEvents 50"
why:
  - EDR or SIEM alert based on Sysmon telemetry.
  - Need the parent/child chain of a suspicious process.
  - Need to know which process made a connection or DNS query.
  - Suspected credential theft (access to `lsass.exe`) or injection.
questions:
  - What started this process (parent chain)?
  - Which process made this connection or DNS query?
  - What did the process write, and what is its hash?
look_for:
  - 'Event `1` — Office, browsers or `wmiprvse.exe` spawning `cmd.exe` / `powershell.exe`.'
  - 'Event `3` / `22` — network and DNS from processes that should not talk to the internet.'
  - 'Event `10` — access to `lsass.exe` from unusual processes.'
  - 'Event `8` — `CreateRemoteThread` into another process.'
  - 'Event `11` — executables or scripts written to user-writable paths.'
  - 'Events `12`/`13` — Run keys and service changes.'
tools_start: [Event Viewer, EvtxECmd]
tools_deeper: [Chainsaw, Hayabusa]
correlate:
  - Sysmon `1` process + command line
  - Parent process → user / logon (`4624`)
  - Sysmon `3` / `22` network and DNS
  - Sysmon `11` files written → hash the file
  - Sysmon `13` registry → persistence
extract:
  - Process image, command line, hashes
  - Parent process and user
  - Remote IPs, ports and queried domains
  - Files and registry keys written
mistakes:
  - No event does not mean no activity — check the configuration first.
  - An attacker with admin rights can stop Sysmon or change its config (look for Event `16` and service stops).
  - '`ParentImage` alone can be spoofed — confirm with `ParentProcessGuid` and timing.'
related_artifacts: [windows-event-logs, powershell-logs, pe-executables, pcap]
---
