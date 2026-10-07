---
name: KAPE
summary: Kroll Artifact Parser and Extractor. Recolecta artefactos forenses de un sistema Windows (Targets) y, opcionalmente, los procesa con parsers (Modules).
category: dfir
type: Recolección y procesado de triaje
platforms: [Windows]
license: Gratuita para uso interno; el uso comercial requiere licencia (revisa los términos vigentes de Kroll)
homepage: https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape
difficulty: intermediate
aliases: [Kroll Artifact Parser and Extractor, gkape]
tags: [triaje, recolección, eric zimmerman, forense windows]
use_when:
  - Necesitas una recolección de triaje rápida y repetible de un equipo Windows en lugar de una imagen de disco completa.
  - Quieres recolectar y procesar artefactos (registros de eventos, registro, Prefetch, $MFT…) en una sola pasada.
  - Estás procesando una imagen montada o una instantánea VSS y quieres carpetas de salida consistentes.
look_for:
  - Errores de recolección en el log de consola (ficheros bloqueados, rutas inexistentes): te dicen qué **no** está en el triaje.
  - Carpetas de salida de los Modules por categoría (`EventLogs`, `FileSystem`, `ProgramExecution`, `Registry`…).
  - Huecos de cobertura — confirma que los Targets usados incluyen los artefactos que necesita tu caso.
workflow:
  - Elegir Targets (p. ej. `KapeTriage`)
  - Recolectar a un destino o contenedor VHDX
  - Ejecutar Modules (p. ej. `!EZParser`) sobre la recolección
  - Revisar los CSV en Timeline Explorer
  - Pivotar a artefactos concretos
examples:
  - label: Recolección de triaje de la unidad C a una carpeta
    command: 'kape.exe --tsource C: --tdest D:\Cases\HOST01\tout --target KapeTriage'
  - label: Procesar una recolección existente con los parsers EZ
    command: 'kape.exe --msource D:\Cases\HOST01\tout --mdest D:\Cases\HOST01\mout --module !EZParser'
outputs:
  - Copia de los ficheros objetivo conservando las rutas originales (opcionalmente dentro de un contenedor VHD/VHDX o ZIP).
  - Salida de los Modules — normalmente CSV generados por las EZ Tools — organizada por categoría.
  - Logs de copia y de consola que documentan qué se recolectó.
notes:
  - Actualiza Targets y Modules (`gkape` → Sync, o `kape.exe --sync`) antes de una intervención; las definiciones cambian.
  - Ejecutarlo sobre un sistema en vivo lo modifica (y requiere privilegios de administrador). Documenta la recolección como acción en las notas del caso.
  - '`gkape.exe` es la interfaz gráfica; construye la misma línea de comandos, que puedes copiar para ejecuciones repetibles.'
  - Ten en cuenta la licencia si usas KAPE para terceros.
complements: [Velociraptor, EvtxECmd, PECmd, RECmd, MFTECmd, AmcacheParser]
related_artifacts: [windows-event-logs, registry, prefetch, amcache]
review: true
---

KAPE es una herramienta de triaje escrita por Eric Zimmerman y distribuida por Kroll. Funciona en dos fases:

- **Targets** (`.tkape`) definen *qué recolectar*: ficheros y carpetas como registros de eventos, hives del registro o la `$MFT`.
- **Modules** (`.mkape`) definen *qué ejecutar* sobre lo recolectado, normalmente parsers de artefactos que generan CSV.

Ambos son definiciones en texto plano mantenidas por la comunidad, así que la misma recolección se puede reproducir en distintos equipos.
