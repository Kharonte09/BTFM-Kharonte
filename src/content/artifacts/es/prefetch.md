---
name: Windows Prefetch
summary: Ficheros que crea Windows para acelerar el arranque de aplicaciones. Evidencia sólida de ejecución, con número de ejecuciones y últimas ejecuciones.
category: windows
aliases: [Prefetch, .pf]
tags: [ejecución, ejecución de programas, timeline]
evidence:
  - Que un ejecutable concreto se ejecutó en el sistema.
  - Cuántas veces se ejecutó y la última vez (más hasta 7 ejecuciones anteriores en Windows 8+).
  - Ficheros y directorios que cargó el programa durante sus primeros segundos.
  - Los volúmenes desde los que se ejecutó.
locations:
  - label: Ficheros Prefetch
    path: C:\Windows\Prefetch\<EXENAME>-<HASH>.pf
  - label: Configuración de Prefetch
    path: HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters\EnablePrefetcher
questions:
  - ¿Se ejecutó este programa en este equipo?
  - ¿Cuándo se ejecutó por última vez y cuántas veces?
  - ¿Qué más se ejecutó en ese mismo momento?
  - ¿Qué DLL o ficheros tocó al arrancar (rutas de staging, payloads)?
  - ¿Se ejecutó desde un medio extraíble o una ruta inusual?
tools: [PECmd, KAPE, Velociraptor, Timeline Explorer]
look_for:
  - Ejecutables en rutas escribibles por el usuario o con nombres aleatorios.
  - LOLBins y herramientas de administración (`psexec`, `wmic`, `certutil`, `rundll32`) a horas inesperadas.
  - Grupos de utilidades de reconocimiento (`whoami`, `net`, `nltest`, `ipconfig`) en pocos minutos.
  - El mismo nombre de ejecutable con **varios hashes distintos** — mismo nombre, distinta ruta.
  - 'Ficheros referenciados bajo `\Users\<user>\AppData\` o `\Temp\`.'
limitations:
  - Desactivado por defecto en las ediciones Windows Server; también puede desactivarse por registro.
  - Número limitado de entradas (1024 en Windows 8+); en sistemas con mucha actividad las más antiguas se pierden.
  - Registra ejecución, no éxito. No prueba que el programa completara su tarea.
  - El hash del nombre depende de la ruta del ejecutable (y, en procesos anfitriones, de la línea de comandos); no es un hash del fichero.
  - Las técnicas antiforenses pueden borrar los .pf; su ausencia no prueba que algo no se ejecutara.
related_artifacts: [amcache, shimcache, windows-event-logs, registry]
---

Prefetch es una función de rendimiento de Windows. Cuando arranca una aplicación, el Cache Manager vigila los ficheros que carga y los registra en un `.pf` para que el siguiente arranque sea más rápido.

Para un investigador es uno de los artefactos de **evidencia de ejecución** más fiables en equipos cliente Windows. En Windows 10 y posteriores los ficheros están comprimidos, así que analízalos con una herramienta que soporte el formato en lugar de leerlos directamente.
