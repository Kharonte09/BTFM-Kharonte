---
name: AmcacheParser
summary: Analiza Amcache.hve para listar los ejecutables, drivers y programas instalados que conoce Windows, incluidos sus hashes SHA-1.
category: windows
type: Parser de artefactos
platforms: [Windows]
license: Gratuita (MIT)
homepage: https://ericzimmerman.github.io/
difficulty: basic
tags: [amcache, ejecución, hashes, eric zimmerman]
use_when:
  - Necesitas los hashes SHA-1 de ejecutables que existieron en un equipo, aunque ya no estén.
  - Quieres confirmar la ruta completa, el editor o la información de compilación de un binario sospechoso.
  - Estás buscando binarios desconocidos en varios equipos.
look_for:
  - Binarios sin firmar o de editor desconocido en rutas escribibles por el usuario.
  - Valores SHA-1 para pivotar en servicios de reputación.
  - Drivers con nombres o rutas inusuales.
workflow:
  - Recolectar `Amcache.hve` (+ logs)
  - AmcacheParser → CSV
  - Filtrar entradas de ficheros no asociados
  - Consultar los hashes SHA-1
  - Correlacionar con Prefetch / Shimcache
examples:
  - label: Analizar Amcache a CSV
    command: 'AmcacheParser.exe -f "C:\Cases\triage\C\Windows\AppCompat\Programs\Amcache.hve" --csv "C:\Cases\out"'
outputs:
  - CSV separados para entradas de ficheros asociados y no asociados, programas, accesos directos, drivers y contenedores de dispositivos.
  - Por fichero — ruta completa, SHA-1, tamaño, información de versión, editor y fecha de enlazado cuando existe.
notes:
  - El SHA-1 se calcula sobre los primeros 31.457.280 bytes (30 MB) del fichero; en ficheros más grandes no coincidirá con el hash del fichero completo.
  - Aparecer en Amcache no prueba por sí solo la ejecución; trátalo como evidencia de presencia y corrobóralo.
complements: [PECmd, AppCompatCacheParser, VirusTotal]
related_artifacts: [amcache, prefetch, shimcache]
---

AmcacheParser (Eric Zimmerman) lee el hive `Amcache.hve` que mantienen los componentes de compatibilidad de aplicaciones de Windows. El hive registra información sobre ejecutables y drivers presentes en el sistema, incluidos hashes de fichero, lo que lo hace muy útil para identificar binarios que se borraron después.
