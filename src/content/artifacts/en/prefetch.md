---
name: Windows Prefetch
summary: Files Windows creates to speed up application launch. Strong evidence of program execution, with run counts and last run times.
category: windows
aliases: [Prefetch, .pf]
tags: [execution, program execution, timeline]
evidence:
  - That a specific executable ran on the system.
  - How many times it ran and the last run time (plus up to 7 earlier run times on Windows 8+).
  - Files and directories the program loaded during its first seconds of execution.
  - The volume(s) it was run from.
locations:
  - label: Prefetch files
    path: C:\Windows\Prefetch\<EXENAME>-<HASH>.pf
  - label: Prefetch configuration
    path: HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters\EnablePrefetcher
questions:
  - Did this program run on this host?
  - When did it run last, and how many times?
  - What else ran around the same time?
  - Which DLLs or files did it touch on start-up (staging paths, payloads)?
  - Was it executed from removable media or an unusual path?
tools: [PECmd, KAPE, Velociraptor, Timeline Explorer]
look_for:
  - Executables in user-writable paths or with random names.
  - LOLBins and admin tools (`psexec`, `wmic`, `certutil`, `rundll32`) at unexpected times.
  - Clusters of recon utilities (`whoami`, `net`, `nltest`, `ipconfig`) within minutes.
  - The same executable name with **several different hashes** — same name, different path.
  - Referenced files under `\Users\<user>\AppData\` or `\Temp\`.
limitations:
  - Disabled by default on Windows Server editions; can also be disabled via registry.
  - Limited number of entries (1024 on Windows 8+); older entries roll off on busy systems.
  - Records execution, not success. It does not prove the program completed its task.
  - The hash in the file name depends on the executable path (and, for hosting processes, the command line), so it is not a file hash.
  - Anti-forensics can delete .pf files; absence is not proof that something did not run.
related_artifacts: [windows-event-logs, registry]
---

Prefetch is a Windows performance feature. When an application starts, the Cache Manager monitors the files it loads and records them in a `.pf` file so the next launch is faster.

For investigators it is one of the most reliable **evidence-of-execution** artifacts on Windows client systems. On Windows 10 and later the files are compressed, so parse them with a tool that supports the format rather than reading them directly.
