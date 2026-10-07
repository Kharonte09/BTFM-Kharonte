---
name: YARA
summary: Motor de coincidencia de patrones para ficheros y memoria. Describe familias de malware o rasgos como reglas de strings y condiciones.
category: malware-analysis
type: Reglas de detección
platforms: [Windows, Linux, macOS]
license: Código abierto (BSD-3-Clause)
homepage: https://virustotal.github.io/yara/
coverage: basic
aliases: [YARA-X, yr]
tags: [detección, reglas, hunting, firmas, clasificación]
use_when:
  - Quieres comprobar si una muestra coincide con familias o rasgos conocidos.
  - Necesitas barrer un directorio, una imagen de disco o una recolección buscando un patrón conocido.
  - Quieres convertir tu análisis en una detección reutilizable.
look_for:
  - Coincidencias de conjuntos de reglas públicos curados — confírmalas con la descripción y referencias de la regla.
  - Qué strings coincidieron (`-s`) — una coincidencia con strings genéricos es más débil que con strings únicos.
  - Coincidencias inesperadas en ficheros legítimos (problema de calidad de la regla).
examples:
  - label: Analizar un fichero con un fichero de reglas y mostrar los strings coincidentes
    command: 'yara -s rules.yar sample.bin'
  - label: Análisis recursivo de un directorio
    command: 'yara -r rules.yar /cases/collection/'
  - label: Equivalente en YARA-X
    command: 'yr scan rules.yar sample.bin'
outputs:
  - Nombres de las reglas que coincidieron con cada fichero (y metadatos/etiquetas si se piden).
  - Identificadores de strings coincidentes y offsets con `-s`.
mistakes:
  - '**YARA-X** es la reescritura en Rust de VirusTotal y su sucesora designada; el YARA original está en modo mantenimiento. La mayoría de reglas funcionan sin cambios, pero revisa las notas de compatibilidad.'
  - Una regla débil genera falsos positivos a escala. Pruébala contra un corpus legítimo antes de desplegarla.
  - Analizar la memoria de procesos en vivo requiere privilegios adecuados y puede ser ruidoso.
complements: [capa, FLOSS, Velociraptor, VirusTotal]
related_artifacts: [pe-executables, memory-dump, office-documents]
---
