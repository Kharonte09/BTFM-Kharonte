---
name: YARA
summary: Motor de coincidencia de patrones para ficheros y memoria. Describe familias de malware o rasgos como reglas de cadenas y condiciones.
category: malware-analysis
type: Reglas de detección
platforms: [Windows, Linux, macOS]
license: Código abierto (BSD-3-Clause)
homepage: https://virustotal.github.io/yara/
difficulty: intermediate
aliases: [YARA-X, yr]
tags: [detección, reglas, hunting, firmas, clasificación]
use_when:
  - Quieres comprobar si una muestra coincide con familias o rasgos conocidos.
  - Necesitas barrer un directorio, una imagen de disco o una recolección buscando un patrón conocido.
  - Quieres convertir tu análisis en una detección reutilizable.
look_for:
  - Coincidencias de conjuntos de reglas públicos curados — confírmalas con la descripción y referencias de la regla.
  - Qué cadenas coincidieron (`-s`) — una coincidencia con cadenas genéricas es más débil que con cadenas únicas.
  - Coincidencias inesperadas en ficheros legítimos (problema de calidad de la regla).
workflow:
  - Muestra o directorio
  - Ejecutar conjunto de reglas
  - Revisar cadenas coincidentes
  - Escribir / afinar tu propia regla
  - Hunting en la recolección
examples:
  - label: Analizar un fichero con un fichero de reglas y mostrar las cadenas coincidentes
    command: 'yara -s rules.yar sample.bin'
  - label: Análisis recursivo de un directorio
    command: 'yara -r rules.yar /cases/collection/'
  - label: Equivalente en YARA-X
    command: 'yr scan rules.yar sample.bin'
outputs:
  - Nombres de las reglas que coincidieron con cada fichero (y metadatos/etiquetas si se piden).
  - Identificadores de cadenas coincidentes y offsets con `-s`.
notes:
  - '**YARA-X** es la reescritura en Rust de VirusTotal y su sucesora designada; el YARA original está en modo mantenimiento. La mayoría de reglas funcionan sin cambios, pero revisa las notas de compatibilidad.'
  - Una regla débil genera falsos positivos a escala. Pruébala contra un corpus legítimo antes de desplegarla.
  - Analizar la memoria de procesos en vivo requiere privilegios adecuados y puede ser ruidoso.
complements: [capa, FLOSS, Velociraptor, VirusTotal]
related_artifacts: [pe-executables, memory-dump, office-documents]
---

YARA, creado por Victor Alvarez en VirusTotal, permite describir familias de malware mediante **reglas**: un conjunto de cadenas de texto, hexadecimales o expresiones regulares más una condición booleana. La misma regla sirve para clasificar una muestra, buscar en un recurso compartido o analizar la memoria de procesos.

La reescritura en Rust **YARA-X** (`yr`) es la sucesora en desarrollo activo.
