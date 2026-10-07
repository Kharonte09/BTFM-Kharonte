---
name: AmcacheParser
summary: Parses Amcache.hve to list executables, drivers and installed programs known to Windows, including SHA-1 hashes.
category: windows
type: Artifact parser
platforms: [Windows]
license: Free (MIT)
homepage: https://ericzimmerman.github.io/
difficulty: basic
tags: [amcache, execution, hashes, eric zimmerman]
use_when:
  - You need SHA-1 hashes of executables that existed on a host — even if the files are gone.
  - You want to confirm the full path, publisher or compile information of a suspicious binary.
  - You are hunting for unknown binaries across several hosts.
look_for:
  - Unsigned or unknown-publisher binaries in user-writable paths.
  - SHA-1 values to pivot on reputation services.
  - Drivers with unusual names or paths.
workflow:
  - Collect `Amcache.hve` (+ logs)
  - AmcacheParser → CSV
  - Filter unassociated file entries
  - Look up SHA-1 hashes
  - Correlate with Prefetch / Shimcache
examples:
  - label: Parse Amcache to CSV
    command: 'AmcacheParser.exe -f "C:\Cases\triage\C\Windows\AppCompat\Programs\Amcache.hve" --csv "C:\Cases\out"'
outputs:
  - Separate CSVs for associated and unassociated file entries, programs, shortcuts, driver binaries and device containers.
  - Per file — full path, SHA-1, size, version info, publisher, link date where available.
notes:
  - The SHA-1 is computed over the first 31,457,280 bytes (30 MB) of the file; for larger files it will not match a full-file hash.
  - Presence in Amcache does not by itself prove execution; treat it as evidence of presence and corroborate.
complements: [PECmd, AppCompatCacheParser, VirusTotal]
related_artifacts: [amcache, prefetch, shimcache]
---

AmcacheParser (Eric Zimmerman) reads the `Amcache.hve` registry hive maintained by Windows application compatibility components. The hive records information about executables and drivers present on the system, including file hashes, which makes it valuable for identifying binaries that were later deleted.
