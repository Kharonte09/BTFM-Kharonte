---
name: FLOSS
summary: FLARE Obfuscated String Solver. Extracts static strings plus stack, tight and decoded strings that plain `strings` misses.
category: malware-analysis
type: Static analysis
platforms: [Windows, Linux, macOS]
license: Open source (Apache-2.0)
homepage: https://github.com/mandiant/flare-floss
coverage: basic
aliases: [flare-floss]
tags: [strings, static analysis, deobfuscation, iocs]
use_when:
  - '`strings` output is thin and you suspect strings are built at runtime or encoded.'
  - You want to extract network IOCs, commands and paths from a Windows PE without running it.
  - Triage of Go or Rust binaries, where plain string extraction is noisy.
look_for:
  - URLs, domains, IP addresses and user agents.
  - Commands, file paths and registry keys.
  - API names resolved dynamically.
  - Mutex names, ransom-note fragments, file extensions.
  - Decoded strings (from emulated decoding routines) — often the most interesting.
examples:
  - label: All string types
    command: 'floss sample.exe'
  - label: Static strings only (fast)
    command: 'floss --only static -- sample.exe'
  - label: JSON output for scripting
    command: 'floss -j sample.exe > sample.floss.json'
outputs:
  - Static strings (ASCII and UTF-16LE).
  - Stack strings and tight strings constructed on the stack.
  - Decoded strings recovered by emulating candidate decoding functions.
  - Optional JSON with offsets and the function that produced each decoded string.
mistakes:
  - Strings alone do not prove maliciousness — legitimate software contains URLs, commands and registry paths too.
  - Decoding works by emulation and targets x86/x64 Windows PE files; it can be slow on large samples.
  - No decoded strings does not mean no obfuscation.
  - Treat every extracted indicator as a lead — validate it before blocking.
complements: [strings, PEStudio, Detect It Easy, capa, YARA, CyberChef]
related_artifacts: [pe-executables]
---
