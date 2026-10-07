---
name: Shimcache
summary: Application Compatibility Cache stored in the SYSTEM hive. Records executables seen by the compatibility layer, with their file modification time.
category: windows
aliases: [AppCompatCache, Application Compatibility Cache]
tags: [presence, execution, timeline]
evidence:
  - Paths of executables the system encountered (including some that were never run).
  - The file's last-modification timestamp at the time it was cached.
  - Relative ordering of entries (most recent first).
locations:
  - label: Registry value
    path: HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\AppCompatCache\AppCompatCache
questions:
  - Did this executable exist on the host, and at which path?
  - Is there a record of a tool that has since been deleted?
  - What other binaries appear around the same position in the cache?
tools: [AppCompatCacheParser, RECmd, Registry Explorer, KAPE]
look_for:
  - Attacker tools and renamed binaries in unusual paths.
  - Executables on removable media or network shares.
  - Entries near a known-malicious entry (similar time of insertion).
limitations:
  - The timestamp is the file's **modification time**, not an execution time.
  - On Windows 10 and later, entries do not reliably prove execution — treat as evidence of presence.
  - The cache is written to the registry on shutdown/reboot; recent entries may only exist in memory on a running system.
  - Limited number of entries; older entries are evicted.
related_artifacts: [amcache, prefetch, registry]
---

Shimcache is maintained by the Windows application-compatibility subsystem. It is a binary blob inside the `SYSTEM` hive that must be parsed with a dedicated tool such as **AppCompatCacheParser** (Eric Zimmerman).

It is most useful to confirm that a file **existed** at a path, especially when other evidence has been removed.
