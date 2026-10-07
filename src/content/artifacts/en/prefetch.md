---
name: Windows Prefetch
summary: Evidence that a program ran on a Windows client — with run count and last run times. Use it to confirm execution and build the execution timeline.
category: windows
coverage: intermediate
aliases: [Prefetch, .pf]
tags: [execution, program execution, timeline]
start_here:
  - Collect `C:\Windows\Prefetch\*.pf` (it does not exist by default on Windows Server).
  - Parse the folder to CSV and sort by last run time.
  - Search for the suspicious executable name — note run count and run times.
  - Check the files it loaded at start-up for staging paths or payloads.
start_commands:
  - label: Parse the Prefetch folder to CSV
    command: 'PECmd.exe -d "C:\Cases\triage\C\Windows\Prefetch" --csv "C:\Cases\out"'
why:
  - Need to prove whether a suspicious binary actually ran.
  - Building an execution timeline of an endpoint.
  - Attacker tools may have been deleted — Prefetch can survive.
questions:
  - Did this program run here? When, and how many times?
  - What else ran around the same time?
  - Did it run from an unusual path or removable media?
locations:
  - label: Prefetch files
    path: C:\Windows\Prefetch\<EXENAME>-<HASH>.pf
look_for:
  - Executables in user-writable paths or with random names.
  - LOLBins and admin / recon tools (`psexec`, `certutil`, `rundll32`, `whoami`, `net`) at unexpected times.
  - The same name with **different hashes** — same binary name, different path.
  - Referenced files under `\Users\<user>\AppData\` or `\Temp\`.
tools_start: [PECmd]
tools_deeper: [Timeline Explorer]
correlate:
  - Prefetch run time
  - Process creation at that time — `4688` / Sysmon `1`
  - LNK / user activity just before
  - The binary on disk → PE analysis
extract:
  - Executable name and path, run count, run times
  - Suspicious referenced files and paths
mistakes:
  - Absence of a `.pf` file does not prove a program did not run.
  - The hash in the file name is a path hash, not a file hash.
  - Prefetch records execution, not success.
related_artifacts: [lnk, windows-event-logs, pe-executables]
---
