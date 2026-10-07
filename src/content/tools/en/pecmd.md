---
name: PECmd
summary: Command-line parser for Windows Prefetch files. Turns .pf files into run counts, last-run timestamps and referenced files.
category: windows
type: Artifact parser
platforms: [Windows]
license: Free (MIT)
homepage: https://ericzimmerman.github.io/
coverage: basic
aliases: [Prefetch Explorer Command Line]
tags: [prefetch, execution, program execution, timeline, eric zimmerman]
use_when:
  - You need evidence that a program **ran** on a Windows workstation and when.
  - You are building an execution timeline from a triage collection (KAPE, Velociraptor).
  - A suspicious binary name appears elsewhere and you want run counts and the files it touched at start-up.
look_for:
  - Executables running from user-writable paths (`%TEMP%`, `%APPDATA%`, `Downloads`, `C:\ProgramData`, `C:\Users\Public`).
  - LOLBins with unusual timing (`rundll32.exe`, `regsvr32.exe`, `mshta.exe`, `certutil.exe`, `wmic.exe`).
  - Admin and recon tools (`psexec*.exe`, `net.exe`, `nltest.exe`, `whoami.exe`, `adfind.exe`) clustered in time.
  - Run counts of 1 for binaries with random-looking names.
  - Referenced files that point to staging directories, DLLs loaded from odd locations, or removable volumes.
examples:
  - label: Parse a whole Prefetch directory to CSV
    command: 'PECmd.exe -d "C:\Cases\triage\C\Windows\Prefetch" --csv "C:\Cases\out" --csvf prefetch.csv'
  - label: Parse a single file and print details
    command: 'PECmd.exe -f "C:\Cases\triage\C\Windows\Prefetch\CMD.EXE-0BD30981.pf"'
  - label: Highlight keywords in referenced files
    command: 'PECmd.exe -d "C:\Cases\triage\C\Windows\Prefetch" -k "temp,tmp,appdata" --csv "C:\Cases\out"'
outputs:
  - Executable name, Prefetch hash and source file name.
  - Run count and last run time (up to 8 previous run times on Windows 8 and later).
  - Volume information (serial number, creation time) and directories referenced.
  - Files referenced during the first seconds of execution.
  - A timeline CSV (one row per run time) in addition to the main CSV.
mistakes:
  - Run on a forensic workstation against collected files, not on the live suspect host when avoidable.
  - Windows 10/11 Prefetch is compressed; parse it on Windows 8+ or use a parser that implements the decompression.
  - Timestamps are UTC. Keep everything in UTC through the timeline.
  - Absence of a .pf file is not proof that a program did not run (see Prefetch limitations).
complements: [KAPE, Timeline Explorer, EvtxECmd]
related_artifacts: [prefetch]
---
