---
name: KAPE
summary: Kroll Artifact Parser and Extractor. Collects forensic artifacts from a Windows system (Targets) and optionally processes them with parsers (Modules).
category: dfir
type: Triage collection & processing
platforms: [Windows]
license: Free for internal use; commercial use requires a licence — check Kroll's current terms
homepage: https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape
difficulty: intermediate
aliases: [Kroll Artifact Parser and Extractor, gkape]
tags: [triage, collection, eric zimmerman, windows forensics]
use_when:
  - You need a fast, repeatable triage collection from a Windows host instead of a full disk image.
  - You want to collect and parse artifacts (event logs, registry, Prefetch, $MFT…) in one pass.
  - You are processing a mounted image or a VSS snapshot and want consistent output folders.
look_for:
  - Collection errors in the console log (locked files, missing paths) — they tell you what is **not** in the triage set.
  - Module output folders by category (`EventLogs`, `FileSystem`, `ProgramExecution`, `Registry`…).
  - 'Coverage gaps: confirm the Targets you used actually include the artifacts your case needs.'
workflow:
  - Choose Targets (e.g. `KapeTriage`)
  - Collect to a destination or VHDX container
  - Run Modules (e.g. `!EZParser`) on the collection
  - Review CSV output in Timeline Explorer
  - Pivot into specific artifacts
examples:
  - label: Triage collection of drive C into a folder
    command: 'kape.exe --tsource C: --tdest D:\Cases\HOST01\tout --target KapeTriage'
  - label: Process an existing collection with EZ parsers
    command: 'kape.exe --msource D:\Cases\HOST01\tout --mdest D:\Cases\HOST01\mout --module !EZParser'
outputs:
  - A copy of the targeted files, preserving original paths (optionally inside a VHD/VHDX or ZIP container).
  - Module output — typically CSV files produced by the EZ Tools — organised by category.
  - Copy and console logs documenting what was collected.
notes:
  - Update Targets and Modules (`gkape` → Sync, or `kape.exe --sync`) before an engagement; artifact definitions change.
  - Running against a live system modifies it (and needs admin rights). Document the collection as an action in your case notes.
  - '`gkape.exe` is the GUI; it builds the same command line, which you can copy for repeatable runs.'
  - Mind the licensing terms if you use KAPE on behalf of third parties.
complements: [Velociraptor, EvtxECmd, PECmd, RECmd, MFTECmd]
related_artifacts: [windows-event-logs, registry, prefetch]
review: true
---

KAPE is a triage tool written by Eric Zimmerman and distributed by Kroll. It works in two phases:

- **Targets** (`.tkape`) define *what to collect* — files and folders such as event logs, registry hives or the `$MFT`.
- **Modules** (`.mkape`) define *what to run* on the collected data — usually artifact parsers that produce CSV.

Both are plain-text definitions maintained by the community, so the same collection can be reproduced across hosts.
