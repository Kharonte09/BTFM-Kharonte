---
name: MFTECmd
summary: Analiza los ficheros de metadatos de NTFS ($MFT, $J, $Boot, $SDS) a CSV para construir timelines del sistema de ficheros.
category: windows
type: Parser de artefactos
platforms: [Windows]
license: Gratuita (MIT)
homepage: https://ericzimmerman.github.io/
coverage: basic
aliases: [$MFT, UsnJrnl]
tags: [ntfs, mft, usn journal, timeline, sistema de ficheros, eric zimmerman]
use_when:
  - Necesitas un timeline completo del sistema de ficheros (creaciones, modificaciones, renombrados, borrados).
  - Buscas ficheros soltados, carpetas de staging o evidencia de borrado.
  - Sospechas manipulación de marcas de tiempo (timestomping).
look_for:
  - Ficheros creados en rutas escribibles por el usuario en torno al acceso inicial.
  - Archivos comprimidos (`.zip`, `.7z`, `.rar`) y ficheros grandes creados poco antes de una posible exfiltración.
  - Entradas del USN journal con secuencias creación → renombrado → borrado.
  - 'Marcas de `$STANDARD_INFORMATION` anteriores a las de `$FILE_NAME` (posible timestomping).'
examples:
  - label: Analizar la $MFT
    command: 'MFTECmd.exe -f "C:\Cases\triage\C\$MFT" --csv "C:\Cases\out" --csvf mft.csv'
  - label: Analizar el USN journal resolviendo rutas con la $MFT
    command: 'MFTECmd.exe -f "C:\Cases\triage\C\$Extend\$J" -m "C:\Cases\triage\C\$MFT" --csv "C:\Cases\out" --csvf usn.csv'
outputs:
  - Una fila por registro de la MFT con ruta completa, tamaño, flags y los dos juegos de marcas `$SI` y `$FN`.
  - Registros del USN journal con los motivos de actualización (creación, ampliación de datos, renombrado, borrado…).
mistakes:
  - El CSV de la `$MFT` es grande; cárgalo en Timeline Explorer y filtra pronto.
  - El USN journal es circular — en sistemas con mucha actividad puede cubrir solo unos días.
  - Los ficheros residentes (ficheros pequeños almacenados dentro del registro MFT) a veces se pueden recuperar con las opciones `--de` / `--dr`; comprueba `MFTECmd.exe -h` en tu versión.
complements: [KAPE, Timeline Explorer, PECmd]
related_artifacts: [prefetch, lnk]
review: true
---
