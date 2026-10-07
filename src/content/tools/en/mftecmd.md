---
name: MFTECmd
summary: Parses NTFS metadata files ($MFT, $J, $Boot, $SDS) into CSV for file-system timelines.
category: windows
type: Artifact parser
platforms: [Windows]
license: Free (MIT)
homepage: https://ericzimmerman.github.io/
coverage: basic
aliases: [$MFT, UsnJrnl]
tags: [ntfs, mft, usn journal, timeline, file system, eric zimmerman]
use_when:
  - You need a full file-system timeline (creation, modification, renames, deletions).
  - You are looking for dropped files, staging folders or evidence of deletion.
  - You suspect timestamp manipulation (timestomping).
look_for:
  - Files created in user-writable paths around the time of initial access.
  - Archives (`.zip`, `.7z`, `.rar`) and large files created shortly before suspected exfiltration.
  - USN journal entries showing create → rename → delete sequences.
  - '`$STANDARD_INFORMATION` timestamps earlier than `$FILE_NAME` timestamps (possible timestomping).'
examples:
  - label: Parse the $MFT
    command: 'MFTECmd.exe -f "C:\Cases\triage\C\$MFT" --csv "C:\Cases\out" --csvf mft.csv'
  - label: Parse the USN journal, resolving paths with the $MFT
    command: 'MFTECmd.exe -f "C:\Cases\triage\C\$Extend\$J" -m "C:\Cases\triage\C\$MFT" --csv "C:\Cases\out" --csvf usn.csv'
outputs:
  - One row per MFT record with full path, size, flags and both `$SI` and `$FN` timestamp sets.
  - USN journal records with update reasons (create, data extend, rename, delete…).
mistakes:
  - The `$MFT` CSV is large; load it in Timeline Explorer and filter early.
  - The USN journal is circular — on busy systems it may only cover days.
  - Resident files (small files stored inside the MFT record) can sometimes be recovered with `--de` / `--dr` options; check `MFTECmd.exe -h` for your version.
complements: [KAPE, Timeline Explorer, PECmd]
related_artifacts: [prefetch, lnk]
review: true
---
