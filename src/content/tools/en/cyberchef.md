---
name: CyberChef
summary: Browser-based "cyber Swiss army knife" for encoding, decoding, decompression, parsing and data extraction using chained recipes.
category: general
type: Data transformation
platforms: [Web, Offline (standalone HTML)]
license: Open source (Apache-2.0)
homepage: https://github.com/gchq/CyberChef
difficulty: basic
tags: [decoding, base64, deobfuscation, powershell, iocs, defang]
use_when:
  - You need to decode Base64, hex, URL-encoding, UTF-16LE, gzip/deflate or XOR layers.
  - You are deobfuscating a script or a command line found in logs.
  - You need to extract or defang IOCs (URLs, domains, IPs) from text for a report.
look_for:
  - Each decoded layer — note it in your case notes; the chain itself is useful evidence.
  - Readable output after **From Base64 → Decode text (UTF-16LE)** for PowerShell `-EncodedCommand`.
  - Compression magic bytes (`1f 8b` gzip) after a decode step — add Gunzip / Raw Inflate.
  - Hard-coded keys next to XOR or AES routines in scripts.
workflow:
  - Paste input
  - Try **Magic** for hints
  - Build the recipe layer by layer
  - Extract IOCs
  - Defang for the report
examples:
  - label: PowerShell -EncodedCommand recipe
    command: 'From_Base64(''A-Za-z0-9+/='',true,false) → Decode_text(''UTF-16LE (1200)'')'
  - label: Common compressed-payload recipe
    command: 'From_Base64 → Raw_Inflate   (or Gunzip, depending on magic bytes)'
  - label: IOC extraction recipe
    command: 'Extract_URLs → Defang_URL'
outputs:
  - Transformed data, downloadable as a file.
  - A saveable / shareable recipe (JSON or URL fragment) documenting each step.
notes:
  - Prefer a **local/offline copy** for sensitive data. Even though processing is client-side, a URL with an embedded input can leak data if shared.
  - Large inputs can freeze the browser tab; trim first.
  - Decoding a payload is safe; executing it is not. Never paste output into a shell.
complements: [FLOSS, PowerShell, jq]
related_artifacts: [powershell-logs, eml]
---

CyberChef is an open-source web application released by GCHQ. Operations (more than 300) are chained into **recipes**, so a multi-layer decode is reproducible and can be shared with a colleague.

It runs entirely in the browser and can be downloaded as a standalone HTML file for offline use.
