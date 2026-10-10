---
name: binwalk
summary: Scans a file for embedded file signatures and extracts them. The quick answer to "is there another file hidden inside this one?".
category: general
type: File carving
platforms: [Linux, macOS]
license: Open source (MIT)
homepage: https://github.com/ReFirmLabs/binwalk
coverage: basic
tags: [carving, embedded files, steganography, firmware, entropy, ctf]
use_when:
  - A file is much larger than its format justifies (an image of several MB, a "PDF" with trailing data).
  - You suspect a ZIP, image or executable appended to or embedded in another file — the usual CTF / BTLO stego challenge.
  - You have a firmware image or an unknown blob and need to know what it is made of.
look_for:
  - More than one signature in the scan — the offset of the second one is where the hidden file starts.
  - ZIP / 7z / gzip signatures inside images or documents.
  - Data after the format's end marker (`IEND` in PNG, `FF D9` in JPEG).
  - High, flat entropy (`-E`) — compressed or encrypted data rather than plain content.
examples:
  - label: Signature scan (what is inside?)
    command: 'binwalk suspicious.png'
  - label: Extract everything it recognises
    command: 'binwalk -e suspicious.png'
  - label: Recursive extraction (files inside files)
    command: 'binwalk -Me suspicious.png'
  - label: Entropy analysis
    command: 'binwalk -E suspicious.bin'
  - label: Carve manually from an offset when extraction fails
    command: 'dd if=suspicious.png of=carved.bin bs=1 skip=<offset>'
outputs:
  - A table of offsets (decimal and hex) with the signature found at each one.
  - Extracted files in a `_<name>.extracted/` folder (`extractions/` in binwalk v3).
  - An entropy graph or summary.
mistakes:
  - Signatures are pattern matches — short ones produce false positives. Confirm the offset with `xxd` before trusting it.
  - No results does not mean nothing is hidden — LSB steganography and encrypted data have no signature.
  - 'Options differ between v2 (Python) and v3 (Rust) — for example `--dd` only exists in v2. Check `binwalk --help` on your box.'
  - Extracted files can be live malware. Work in an isolated VM.
complements: [xxd, strings, ExifTool, CyberChef]
related_artifacts: [pe-executables, office-documents, pdf]
---
