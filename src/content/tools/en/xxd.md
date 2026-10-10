---
name: xxd
summary: Hex dump from the command line, and back again. Check magic bytes, look at a specific offset, or patch a broken header.
category: general
type: Hex dump
platforms: [Linux, macOS, Windows (ships with Vim)]
homepage: https://github.com/vim/vim
coverage: basic
tags: [hex, magic bytes, file identification, carving, ctf]
use_when:
  - The extension and the content do not seem to match and you want to see the real magic bytes.
  - binwalk or another tool gave you an offset and you need to look at what is actually there.
  - A file will not open because its header is corrupted or was tampered with (classic CTF challenge).
  - You have a hex string and need the binary back.
look_for:
  - 'Magic bytes at offset 0 — `4d 5a` PE, `7f 45 4c 46` ELF, `50 4b 03 04` ZIP / Office, `25 50 44 46` PDF, `89 50 4e 47` PNG, `ff d8 ff` JPEG, `1f 8b` gzip.'
  - A header that is almost right — one or two wrong bytes means it was edited on purpose.
  - Readable text in the right-hand ASCII column.
  - Data after the format's end marker.
examples:
  - label: First bytes (magic bytes)
    command: 'xxd -l 32 suspicious.bin'
  - label: Dump from an offset
    command: 'xxd -s 0x1a40 -l 128 suspicious.bin'
  - label: Last bytes of the file
    command: 'xxd -s -64 suspicious.bin'
  - label: Plain hex, no offsets or ASCII
    command: 'xxd -p suspicious.bin'
  - label: Hex string back to binary
    command: 'xxd -r -p payload.hex payload.bin'
  - label: Patch a header (dump, edit the hex, rebuild)
    command: 'xxd broken.png > broken.hex && xxd -r broken.hex fixed.png'
outputs:
  - Offset, hex bytes and ASCII column for the selected range.
  - A binary file rebuilt from hex with `-r`.
mistakes:
  - 'When rebuilding with `-r`, only the hex columns count — editing the ASCII column changes nothing.'
  - '`-r -p` expects plain hex; `-r` alone expects the full dump format with offsets. Mixing them gives garbage.'
  - Magic bytes identify the container, not the intent — a valid PNG header says nothing about what is appended after it.
complements: [binwalk, strings, Detect It Easy, CyberChef]
related_artifacts: [pe-executables]
---
