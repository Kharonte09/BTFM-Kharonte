---
name: CyberChef
summary: Browser-based "cyber Swiss army knife" for encoding, decoding, decompression, parsing and data extraction using chained recipes.
category: general
type: Data transformation
platforms: [Web, Offline (standalone HTML)]
license: Open source (Apache-2.0)
homepage: https://github.com/gchq/CyberChef
coverage: intermediate
tags: [decoding, base64, deobfuscation, powershell, iocs, defang, ciphers, encodings, rot13, xor, ctf]
use_when:
  - You need to decode Base64, hex, URL-encoding, UTF-16LE, gzip/deflate or XOR layers.
  - You are deobfuscating a script or a command line found in logs.
  - You need to extract or defang IOCs (URLs, domains, IPs) from text for a report.
  - You have a blob and do not know what encoding or classical cipher it is (CTF / BTLO challenges) — start with **Magic**.
look_for:
  - Each decoded layer — note it in your case notes; the chain itself is useful evidence.
  - Readable output after **From Base64 → Decode text (UTF-16LE)** for PowerShell `-EncodedCommand`.
  - Compression magic bytes (`1f 8b` gzip) after a decode step — add Gunzip / Raw Inflate.
  - Hard-coded keys next to XOR or AES routines in scripts.
  - '**Base64** — `A-Z a-z 0-9 + /`, often ends in `=` or `==`. URL-safe variant uses `-` and `_`.'
  - '**Base32** — only uppercase `A-Z` and `2-7`, usually with several `=` of padding.'
  - '**Hex** — only `0-9 a-f`, even length. 32 / 40 / 64 characters is probably an MD5 / SHA-1 / SHA-256 hash: look it up, there is nothing to decode.'
  - '**Binary / decimal / octal** — groups of `0` and `1`, or numbers between 32 and 126 separated by spaces (From Binary / From Decimal / From Octal).'
  - '**Base58** — alphanumeric without `0`, `O`, `I`, `l`. **Base85** — lots of punctuation; Ascii85 may be wrapped in `<~ ~>`.'
  - '**URL encoding** — `%xx` sequences. **HTML entities** — `&#x41;` / `&#65;`.'
  - '**ROT13 / Caesar** — only letters are changed; spaces, punctuation and word lengths stay intact. **ROT47** also shifts digits and symbols.'
  - '**Morse** — dots, dashes and `/`. **Vigenère** — looks like ROT but no single shift works; you need the key.'
examples:
  - label: PowerShell -EncodedCommand recipe
    command: 'From_Base64(''A-Za-z0-9+/='',true,false) → Decode_text(''UTF-16LE (1200)'')'
  - label: Common compressed-payload recipe
    command: 'From_Base64 → Raw_Inflate   (or Gunzip, depending on magic bytes)'
  - label: IOC extraction recipe
    command: 'Extract_URLs → Defang_URL'
  - label: Unknown blob — let CyberChef guess (tick Intensive mode, add a crib if you know part of the output)
    command: 'Magic(3,true,false,''flag{'')'
  - label: Caesar / ROT with unknown shift
    command: 'ROT13_Brute_Force   (ROT47_Brute_Force if symbols are shifted too)'
  - label: Single-byte XOR with unknown key
    command: 'XOR_Brute_Force(1,100,0,''Standard'',false,true,false,''http'')'
  - label: Stacked encodings — peel one layer at a time
    command: 'From_Hex → From_Base64 → ROT13'
  - label: Classical ciphers with a known key
    command: 'Vigenère_Decode(''key'')  ·  Atbash_Cipher  ·  Affine_Cipher_Decode(a,b)  ·  Rail_Fence_Cipher_Decode(key,offset)'
  - label: AES with key and IV found in the script
    command: 'From_Base64 → AES_Decrypt(key, iv, ''CBC'', ''Raw'', ''Raw'')'
outputs:
  - Transformed data, downloadable as a file.
  - A saveable / shareable recipe (JSON or URL fragment) documenting each step.
mistakes:
  - Prefer a **local/offline copy** for sensitive data. Even though processing is client-side, a URL with an embedded input can leak data if shared.
  - Large inputs can freeze the browser tab; trim first.
  - Decoding a payload is safe; executing it is not. Never paste output into a shell.
  - '**Encoding is not encryption** — Base64, hex or ROT13 need no key and hide nothing. If you need a key, it is a cipher, and without the key you are brute-forcing or looking for it elsewhere in the evidence.'
  - Hashes are not reversible. Do not waste time trying to "decode" an MD5 — search it in VirusTotal or a wordlist.
  - '**Magic** only tries what it knows and can miss keyed ciphers. No suggestion does not mean the data is random.'
complements: [FLOSS, strings, xxd, PowerShell, jq]
related_artifacts: [powershell-logs, eml]
---
