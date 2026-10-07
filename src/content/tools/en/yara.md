---
name: YARA
summary: Pattern-matching engine for files and memory. Describes malware families or traits as rules of strings and conditions.
category: malware-analysis
type: Detection rules
platforms: [Windows, Linux, macOS]
license: Open source (BSD-3-Clause)
homepage: https://virustotal.github.io/yara/
coverage: basic
aliases: [YARA-X, yr]
tags: [detection, rules, hunting, signatures, classification]
use_when:
  - You want to check whether a sample matches known families or traits.
  - You need to sweep a directory, a disk image or a collection for a known indicator pattern.
  - You want to turn your analysis into a reusable detection.
look_for:
  - Matches from curated public rule sets — confirm with the rule's description and references.
  - Which strings matched (`-s`) — a match on generic strings is weaker than on unique ones.
  - Unexpected matches in benign files (rule quality issue).
examples:
  - label: Scan a file with a rule file and show matching strings
    command: 'yara -s rules.yar sample.bin'
  - label: Recursive scan of a directory
    command: 'yara -r rules.yar /cases/collection/'
  - label: YARA-X equivalent
    command: 'yr scan rules.yar sample.bin'
outputs:
  - Rule names that matched each file (and metadata/tags if requested).
  - Matching string identifiers and offsets with `-s`.
mistakes:
  - '**YARA-X** is VirusTotal''s Rust rewrite and the designated successor; the original YARA is in maintenance mode. Most rules work unchanged, but check compatibility notes.'
  - A weak rule causes false positives at scale. Test against a benign corpus before deploying.
  - Scanning memory of live processes requires appropriate privileges and can be noisy.
complements: [capa, FLOSS, Velociraptor, VirusTotal]
related_artifacts: [pe-executables, memory-dump, office-documents]
---
