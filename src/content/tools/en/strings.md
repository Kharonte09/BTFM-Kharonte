---
name: strings
summary: Prints the printable character sequences in any file. The first, cheapest look at an unknown binary, document or dump.
category: malware-analysis
type: Static analysis
platforms: [Linux, macOS, Windows (Sysinternals Strings)]
homepage: https://www.gnu.org/software/binutils/
coverage: basic
tags: [strings, static analysis, iocs, triage, ctf]
use_when:
  - First look at any unknown file, before opening heavier tools.
  - You want quick IOCs (URLs, IPs, paths, commands) from a sample without running it.
  - Hunting for a flag, a password or a hint inside a challenge file.
look_for:
  - URLs, domains, IP addresses and user agents.
  - File paths, registry keys, commands and script fragments.
  - Long Base64 or hex blobs — take them to CyberChef.
  - Packer or compiler markers (`UPX!`, PDB paths, `Go build ID`).
  - Almost no readable strings in a large binary — it is probably packed or encrypted.
examples:
  - label: Strings of 8+ characters (cuts the noise)
    command: 'strings -n 8 sample.bin'
  - label: UTF-16LE strings (Windows binaries)
    command: 'strings -el sample.exe'
  - label: With hex offsets, to jump there with xxd
    command: 'strings -t x sample.bin'
  - label: Quick IOC hunt
    command: 'strings -n 6 sample.bin | grep -Ei "https?://|\.exe|\.dll|powershell|cmd\.exe"'
  - label: Windows (Sysinternals) — ASCII and Unicode by default
    command: 'strings.exe -n 8 -accepteula sample.exe'
outputs:
  - One string per line, optionally prefixed with its offset.
mistakes:
  - 'GNU `strings` only shows ASCII by default — run it again with `-el` or you will miss the UTF-16 strings of a Windows binary.'
  - It does not decode anything. Stack strings and encoded strings need FLOSS.
  - Strings alone do not prove maliciousness — legitimate software contains URLs and commands too.
  - Default minimum length is 4, which is mostly noise. Raise it with `-n`.
complements: [FLOSS, xxd, binwalk, CyberChef, PEStudio]
related_artifacts: [pe-executables, memory-dump]
---
