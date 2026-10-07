---
name: Volcado de memoria
summary: Una imagen de RAM — qué se ejecutaba, qué conexiones había y qué estaba inyectado en el momento de la captura. El sitio donde encontrar malware fileless y payloads descifrados.
category: memory
coverage: intermediate
aliases: [Memory Dump, RAM dump, memory image, Volcado de RAM, Memory]
tags: [memoria, volatility, procesos, inyección, fileless]
start_here:
  - Calcula el hash de la imagen y anota cómo y cuándo se adquirió.
  - Identifica la build del sistema y la hora de captura — `windows.info`.
  - Lista los procesos en árbol — los padres, rutas o nombres incorrectos destacan.
  - Revisa las líneas de comandos y conexiones de red de lo sospechoso.
  - Busca código inyectado (`windows.malfind`) y vuelca lo que necesites.
start_commands:
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
why:
  - Sospecha de malware fileless o de inyección.
  - Equipo capturado antes de contenerlo o apagarlo.
  - Necesitas la configuración descifrada o el C2 de una muestra.
  - Laboratorio o reto con una imagen de memoria.
questions:
  - ¿Qué proceso es malicioso (nombre, PID, padre, ruta)?
  - ¿Cómo se lanzó (línea de comandos)?
  - ¿A qué IP y puerto remotos se conecta?
  - ¿Hay código inyectado, y en qué proceso?
look_for:
  - Padre incorrecto (p. ej. `svchost.exe` que no viene de `services.exe`) o ruta incorrecta.
  - Nombres de procesos del sistema mal escritos (`scvhost.exe`, `lsas.exe`).
  - Procesos en `windows.psscan` pero no en `windows.pslist` (ocultos o terminados).
  - 'Coincidencias de `windows.malfind` con cabecera `MZ` o shellcode.'
  - Conexiones de procesos que no deberían usar la red.
tools_start: [Volatility 3]
tools_deeper: [MemProcFS, YARA]
correlate:
  - Proceso sospechoso (PID, ruta, línea de comandos)
  - Conexión de red (`netscan`) → PCAP / logs del proxy
  - Fichero volcado → hash → análisis del PE
  - Persistencia (`svcscan`, claves Run en memoria) → registro / tareas en disco
extract:
  - Nombres, PIDs, rutas y líneas de comandos de los procesos
  - IPs y puertos remotos
  - Hashes de los ficheros volcados
  - Mutex y entradas de persistencia
mistakes:
  - La imagen es un único instante — no ve lo que se ejecutó antes.
  - Los nombres y opciones de los plugins cambian entre versiones de Volatility 3 — revisa `vol <plugin> -h`.
  - Los perfiles de Volatility 2 no sirven en Volatility 3 (usa tablas de símbolos).
  - El smear de la adquisición puede dar resultados inconsistentes — corrobora con varios plugins.
related_artifacts: [pe-executables, pcap, sysmon]
---
