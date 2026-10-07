---
name: VirusTotal
summary: Online multi-engine scanner and threat-intelligence service for files, URLs, domains and IP addresses.
category: malware-analysis
type: Reputation / threat intelligence
platforms: [Web]
license: Free public web interface; premium services are commercial
homepage: https://www.virustotal.com/
coverage: intermediate
aliases: [VT]
tags: [reputation, hash lookup, threat intelligence, iocs, opsec]
use_when:
  - You have a hash, URL, domain or IP and want fast reputation context.
  - You want to see whether a sample is already known and how vendors label it.
  - You want relations — contacted domains, dropped files, parent files, communicating samples.
look_for:
  - First submission date — "first seen" much earlier than your incident suggests commodity malware.
  - Detection names (to guess family) — but trust consensus, not one engine.
  - Behaviour/sandbox tabs for network and file-system IOCs.
  - Relations graph for related infrastructure and samples.
outputs:
  - Per-engine detection results and a consensus count.
  - File metadata, signatures and, when available, sandbox behaviour reports.
  - Relations between files, URLs, domains and IPs.
mistakes:
  - '**OPSEC:** files uploaded to VirusTotal are shared with the security community and may be downloadable by premium users. Never upload documents with confidential or personal data, and consider that the attacker may monitor submissions of their samples.'
  - Zero detections does not mean benign — new or targeted samples are often undetected.
  - Detection names are vendor-specific and often generic; do not treat them as attribution.
complements: [Hybrid Analysis, ANY.RUN, YARA, PEStudio]
related_artifacts: [pe-executables, ip-domain]
---
