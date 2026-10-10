---
name: strings
summary: Muestra las secuencias de caracteres imprimibles de cualquier fichero. El primer vistazo, y el más barato, a un binario, documento o volcado desconocido.
category: malware-analysis
type: Análisis estático
platforms: [Linux, macOS, Windows (Sysinternals Strings)]
homepage: https://www.gnu.org/software/binutils/
coverage: basic
tags: [strings, análisis estático, iocs, triage, ctf]
use_when:
  - Primer vistazo a cualquier fichero desconocido, antes de abrir herramientas más pesadas.
  - Quieres IOCs rápidos (URLs, IPs, rutas, comandos) de una muestra sin ejecutarla.
  - Buscas una flag, una contraseña o una pista dentro del fichero de un reto.
look_for:
  - URLs, dominios, direcciones IP y user agents.
  - Rutas de ficheros, claves del registro, comandos y fragmentos de scripts.
  - Blobs largos en Base64 o hex — llévalos a CyberChef.
  - Marcas de packer o compilador (`UPX!`, rutas PDB, `Go build ID`).
  - Casi ningún string legible en un binario grande — probablemente está empaquetado o cifrado.
examples:
  - label: Strings de 8+ caracteres (quita ruido)
    command: 'strings -n 8 sample.bin'
  - label: Strings UTF-16LE (binarios de Windows)
    command: 'strings -el sample.exe'
  - label: Con offsets en hex, para saltar ahí con xxd
    command: 'strings -t x sample.bin'
  - label: Búsqueda rápida de IOCs
    command: 'strings -n 6 sample.bin | grep -Ei "https?://|\.exe|\.dll|powershell|cmd\.exe"'
  - label: Windows (Sysinternals) — ASCII y Unicode por defecto
    command: 'strings.exe -n 8 -accepteula sample.exe'
outputs:
  - Un string por línea, opcionalmente con su offset delante.
mistakes:
  - '`strings` de GNU solo muestra ASCII por defecto — vuelve a lanzarlo con `-el` o te perderás los strings UTF-16 de un binario de Windows.'
  - No decodifica nada. Los stack strings y los strings codificados necesitan FLOSS.
  - Los strings por sí solos no prueban que algo sea malicioso — el software legítimo también contiene URLs y comandos.
  - La longitud mínima por defecto es 4, que es casi todo ruido. Súbela con `-n`.
complements: [FLOSS, xxd, binwalk, CyberChef, PEStudio]
related_artifacts: [pe-executables, memory-dump]
---
