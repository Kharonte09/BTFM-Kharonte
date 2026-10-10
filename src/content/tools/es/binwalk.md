---
name: binwalk
summary: Busca firmas de ficheros embebidos dentro de un fichero y los extrae. La respuesta rápida a «¿hay otro fichero escondido aquí dentro?».
category: general
type: File carving
platforms: [Linux, macOS]
license: Código abierto (MIT)
homepage: https://github.com/ReFirmLabs/binwalk
coverage: basic
tags: [carving, ficheros embebidos, esteganografía, firmware, entropía, ctf]
use_when:
  - Un fichero pesa mucho más de lo que justifica su formato (una imagen de varios MB, un «PDF» con datos al final).
  - Sospechas que hay un ZIP, una imagen o un ejecutable añadido o embebido en otro fichero — el típico reto de stego de CTF / BTLO.
  - Tienes una imagen de firmware o un blob desconocido y necesitas saber de qué está hecho.
look_for:
  - Más de una firma en el escaneo — el offset de la segunda es donde empieza el fichero oculto.
  - Firmas ZIP / 7z / gzip dentro de imágenes o documentos.
  - Datos después del marcador de fin del formato (`IEND` en PNG, `FF D9` en JPEG).
  - Entropía alta y plana (`-E`) — datos comprimidos o cifrados, no contenido en claro.
examples:
  - label: Escaneo de firmas (¿qué hay dentro?)
    command: 'binwalk suspicious.png'
  - label: Extraer todo lo que reconozca
    command: 'binwalk -e suspicious.png'
  - label: Extracción recursiva (ficheros dentro de ficheros)
    command: 'binwalk -Me suspicious.png'
  - label: Análisis de entropía
    command: 'binwalk -E suspicious.bin'
  - label: Carving manual desde un offset si la extracción falla
    command: 'dd if=suspicious.png of=carved.bin bs=1 skip=<offset>'
outputs:
  - Una tabla de offsets (decimal y hex) con la firma encontrada en cada uno.
  - Ficheros extraídos en una carpeta `_<nombre>.extracted/` (`extractions/` en binwalk v3).
  - Una gráfica o resumen de entropía.
mistakes:
  - Las firmas son coincidencias de patrón — las cortas dan falsos positivos. Confirma el offset con `xxd` antes de fiarte.
  - Que no salga nada no significa que no haya nada oculto — la esteganografía LSB y los datos cifrados no tienen firma.
  - 'Las opciones cambian entre v2 (Python) y v3 (Rust) — por ejemplo `--dd` solo existe en v2. Mira `binwalk --help` en tu máquina.'
  - Los ficheros extraídos pueden ser malware real. Trabaja en una VM aislada.
complements: [xxd, strings, ExifTool, CyberChef]
related_artifacts: [pe-executables, office-documents, pdf]
---
