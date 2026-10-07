---
name: Volatility 3
summary: Framework open source de memory forensics. Extrae procesos, conexiones de red, código inyectado, datos del registro y ficheros de imágenes de RAM.
category: dfir
type: Memory forensics
platforms: [Windows, Linux, macOS]
license: Volatility Software License (VSL)
homepage: https://github.com/volatilityfoundation/volatility3
difficulty: intermediate
aliases: [Volatility, vol, vol.py, Volatility3]
tags: [memoria, ram, procesos, inyección, malfind, forense]
use_when:
  - Tienes una imagen de memoria y necesitas saber qué se ejecutaba, qué conexiones había o qué se inyectó.
  - El malware puede ser fileless o descifrar su configuración solo en memoria.
  - Necesitas recuperar la imagen de un proceso o un fichero que ya no existe en disco.
look_for:
  - Procesos con padre, ruta o nombre incorrectos (`windows.pstree`, `windows.pslist`).
  - Procesos que aparecen en `windows.psscan` pero no en `windows.pslist`.
  - Líneas de comandos sospechosas (`windows.cmdline`).
  - Conexiones de procesos inesperados (`windows.netscan`).
  - Memoria privada ejecutable, sobre todo con cabecera `MZ` (`windows.malfind`).
workflow:
  - '`windows.info`'
  - '`windows.pstree` / `windows.psscan`'
  - '`windows.cmdline` / `windows.netscan`'
  - '`windows.malfind` / `windows.dlllist`'
  - Volcar y calcular el hash de los ficheros sospechosos
examples:
  - label: Información de la imagen
    command: 'vol -f mem.raw windows.info'
  - label: Árbol de procesos
    command: 'vol -f mem.raw windows.pstree'
  - label: Líneas de comandos
    command: 'vol -f mem.raw windows.cmdline'
  - label: Conexiones de red
    command: 'vol -f mem.raw windows.netscan'
  - label: Código inyectado
    command: 'vol -f mem.raw windows.malfind'
  - label: Volcar los ficheros de un proceso a una carpeta
    command: 'vol -f mem.raw -o out/ windows.dumpfiles --pid 1234'
  - label: Leer una clave del registro desde memoria
    command: 'vol -f mem.raw windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"'
outputs:
  - Tablas por plugin (texto por defecto; renderers `-r json` / `-r csv` para scripting).
  - Ficheros, imágenes de procesos y regiones de memoria volcados al directorio de salida.
notes:
  - '**Volatility 3** sustituye a Volatility 2 (Python 2, ya sin mantenimiento). Los nombres de plugins cambian — `windows.pslist` en lugar de `pslist --profile=…`; los perfiles se sustituyen por tablas de símbolos.'
  - Por defecto descarga automáticamente las tablas de símbolos de Windows; en máquinas de análisis sin conexión, prepáralas antes.
  - Las opciones de los plugins cambian entre versiones — revisa `vol <plugin> -h`.
  - El smear durante la adquisición puede dar resultados inconsistentes; corrobora con varios plugins.
complements: [MemProcFS, YARA, Velociraptor, Wireshark]
related_artifacts: [memory-dump, pe-executables]
---

**Volatility 3** (Volatility Foundation) es el framework open source de referencia para memory forensics. Analiza las estructuras del kernel en una imagen de RAM para listar procesos, conexiones de red, módulos cargados, handles, hives del registro en memoria y regiones de memoria sospechosas, y puede volcar ficheros e imágenes de procesos para seguir analizándolos.

Se invoca como `vol` (o `vol.py`) seguido de la imagen y el nombre del plugin.
