---
name: EvtxECmd
summary: Parses Windows .evtx event logs into normalised CSV/JSON using community maps, ready for timeline analysis.
category: windows
type: Artifact parser
platforms: [Windows]
license: Free (MIT)
homepage: https://ericzimmerman.github.io/
difficulty: basic
tags: [event logs, evtx, timeline, eric zimmerman, logons]
use_when:
  - You have collected `.evtx` files and need them in a single, filterable table.
  - You need to correlate logons, process creation, services and PowerShell across several logs.
  - You want consistent fields (user, remote host, executable) regardless of the event's XML layout.
look_for:
  - Logon events (4624/4625/4648) — filter by logon type and source address.
  - Service installs (7045) and scheduled task creation (4698, TaskScheduler 106).
  - Process creation with command line (4688 / Sysmon 1).
  - PowerShell script blocks (4104) and log clearing (1102, System 104).
workflow:
  - Collect `winevt\Logs`
  - EvtxECmd → CSV
  - Load into Timeline Explorer
  - Filter by Event ID / time window
  - Pivot on user, host, process
examples:
  - label: Parse a whole log directory
    command: 'EvtxECmd.exe -d "C:\Cases\triage\C\Windows\System32\winevt\Logs" --csv "C:\Cases\out" --csvf evtx.csv'
  - label: Parse a single log
    command: 'EvtxECmd.exe -f "C:\Cases\triage\Security.evtx" --csv "C:\Cases\out"'
  - label: Include only specific event IDs
    command: 'EvtxECmd.exe -f "C:\Cases\triage\Security.evtx" --csv "C:\Cases\out" --inc 4624,4625,4648,4672'
outputs:
  - One row per event with common columns (time created, computer, channel, event ID, provider).
  - Normalised map fields (`UserName`, `RemoteHost`, `ExecutableInfo`, `PayloadData1-6`) for mapped event IDs.
  - The full event payload for fields that are not mapped.
notes:
  - Update maps (`EvtxECmd.exe --sync`) — normalisation depends on them.
  - Times are UTC.
  - Logs roll over; check the oldest event in each log to know your visibility window.
complements: [KAPE, Timeline Explorer, Hayabusa, Chainsaw]
related_artifacts: [windows-event-logs, sysmon, powershell-logs, scheduled-tasks]
---

EvtxECmd is part of Eric Zimmerman's tools. It reads Windows XML event log files (`.evtx`) and uses **maps** — YAML files keyed by channel and event ID — to extract the useful fields of each event into consistent columns.

For detection-oriented triage of the same logs, Sigma-based tools such as **Hayabusa** or **Chainsaw** are common complements.
