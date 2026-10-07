---
name: Shimcache
summary: Application Compatibility Cache guardada en el hive SYSTEM. Registra ejecutables vistos por la capa de compatibilidad, con la fecha de modificación del fichero.
category: windows
aliases: [AppCompatCache, Application Compatibility Cache]
tags: [presencia, ejecución, timeline]
evidence:
  - Rutas de ejecutables que el sistema encontró (incluidos algunos que nunca se ejecutaron).
  - La fecha de última modificación del fichero en el momento de cachearlo.
  - El orden relativo de las entradas (las más recientes primero).
locations:
  - label: Valor del registro
    path: HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\AppCompatCache\AppCompatCache
questions:
  - ¿Existió este ejecutable en el equipo, y en qué ruta?
  - ¿Queda rastro de una herramienta que ya se ha borrado?
  - ¿Qué otros binarios aparecen en posiciones cercanas de la caché?
tools: [AppCompatCacheParser, RECmd, Registry Explorer, KAPE]
look_for:
  - Herramientas del atacante y binarios renombrados en rutas inusuales.
  - Ejecutables en medios extraíbles o recursos compartidos de red.
  - Entradas cercanas a una entrada maliciosa conocida (momento de inserción similar).
limitations:
  - La marca de tiempo es la **fecha de modificación** del fichero, no una fecha de ejecución.
  - En Windows 10 y posteriores las entradas no prueban la ejecución de forma fiable — trátalas como evidencia de presencia.
  - La caché se escribe en el registro al apagar/reiniciar; en un sistema en marcha las entradas recientes pueden estar solo en memoria.
  - Número limitado de entradas; las antiguas se descartan.
related_artifacts: [amcache, prefetch, registry]
---

Shimcache la mantiene el subsistema de compatibilidad de aplicaciones de Windows. Es un blob binario dentro del hive `SYSTEM` que debe analizarse con una herramienta específica como **AppCompatCacheParser** (Eric Zimmerman).

Su mayor utilidad es confirmar que un fichero **existió** en una ruta, sobre todo cuando se ha eliminado otra evidencia.
