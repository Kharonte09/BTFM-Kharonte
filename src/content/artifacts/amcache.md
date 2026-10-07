---
name: Amcache
summary: Registry hive maintained by Windows compatibility components. Lists executables and drivers with paths and SHA-1 hashes.
category: windows
aliases: [Amcache.hve]
tags: [execution, hashes, program execution, presence]
evidence:
  - Executables and drivers that existed on (or were run on) the system.
  - Full path, SHA-1 hash (first 30 MB), size, version info and publisher.
  - Installed programs and their associated files.
locations:
  - label: Hive
    path: C:\Windows\AppCompat\Programs\Amcache.hve
  - label: Transaction logs
    path: C:\Windows\AppCompat\Programs\Amcache.hve.LOG1 · .LOG2
questions:
  - What is the SHA-1 of a binary that was deleted after the incident?
  - Where on disk did this executable live?
  - Which unusual binaries were present in user-writable paths?
tools: [AmcacheParser, Registry Explorer, KAPE]
look_for:
  - Unsigned / unknown-publisher binaries in `AppData`, `Temp`, `ProgramData`, `Users\Public`.
  - Binaries whose name imitates system files but whose path is wrong.
  - SHA-1 values to look up on reputation services.
limitations:
  - Presence does not prove execution — corroborate with Prefetch, event logs or other execution artifacts.
  - The SHA-1 covers only the first 31,457,280 bytes of large files.
  - Content and behaviour of the hive differ across Windows versions and updates.
related_artifacts: [prefetch, shimcache, registry]
---

`Amcache.hve` is a registry-format file (not part of the live registry tree) populated by Windows application-compatibility tasks. Its main forensic value is the **SHA-1 hash and full path** of executables, which lets you identify a binary even if it was deleted.
