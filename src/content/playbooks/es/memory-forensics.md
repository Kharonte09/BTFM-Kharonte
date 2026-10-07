---
name: Memory Forensics
summary: Analizar una imagen de memoria de Windows con Volatility 3 — procesos, líneas de comandos, red, inyección, persistencia — y extraer artefactos e IOCs.
order: 6
scenario: Un volcado de memoria
icon: memory
trigger: Tienes una imagen de RAM (`.raw`, `.mem`, `.vmem`, `.dmp`) de una adquisición, un snapshot de VM o un reto de laboratorio, y necesitas saber qué se estaba ejecutando.
tags: [memoria, volatility, procesos, inyección, btlo]
questions:
  - ¿De qué sistema operativo y build es la imagen, y cuándo se capturó?
  - ¿Qué proceso es malicioso (nombre, PID, PID del padre, ruta)?
  - ¿Con qué línea de comandos se lanzó?
  - ¿A qué IP y puerto remotos se conecta?
  - ¿Hay código inyectado, y en qué proceso?
  - ¿Qué mecanismo de persistencia se creó?
  - ¿Cuál es el hash del fichero malicioso extraído?
steps:
  - title: Identificar la imagen
    goal: Confirmar el sistema operativo y que Volatility puede analizar la imagen.
    actions:
      - Calcula el hash de la imagen y regístralo.
      - '`vol -f mem.raw windows.info` — build, arquitectura y hora del sistema (momento de la captura).'
    tools: [Volatility 3]
    artifacts: [memory-dump]
  - title: Procesos
    goal: Encontrar procesos sospechosos y sus relaciones.
    actions:
      - '`windows.pstree` — árbol padre/hijo; `windows.pslist` frente a `windows.psscan` — los procesos que no salen en la lista pueden estar ocultos o terminados.'
      - Padre incorrecto (p. ej. `svchost.exe` que no viene de `services.exe`), ruta incorrecta, nombres mal escritos, horas de inicio raras.
    tools: [Volatility 3]
  - title: Líneas de comandos
    goal: Ver cómo se lanzó cada proceso sospechoso.
    actions:
      - '`windows.cmdline` — argumentos, PowerShell codificado, LOLBins, rutas en `AppData` / `Temp`.'
    tools: [Volatility 3]
    escalate: PowerShell codificado → decodifícalo con el playbook PowerShell sospechoso.
  - title: Red
    goal: Relacionar conexiones con procesos.
    actions:
      - '`windows.netscan` — dirección y puerto local/remoto, estado y PID propietario.'
      - Anota las IPs remotas para enriquecerlas y correlaciónalas con logs de proxy / firewall o un PCAP.
    tools: [Volatility 3]
    artifacts: [ip-domain, pcap]
  - title: Inyección
    goal: Encontrar código que no pertenece a la imagen del proceso.
    actions:
      - '`windows.malfind` — memoria privada ejecutable, a menudo con cabecera `MZ` o shellcode.'
      - '`windows.dlllist --pid <pid>` — DLL cargadas desde rutas raras; `windows.handles --pid <pid>` — mutex, ficheros, claves del registro.'
    tools: [Volatility 3]
  - title: Persistencia
    goal: Identificar cómo sobrevive el malware a un reinicio.
    actions:
      - '`windows.svcscan` — servicios y rutas de sus binarios.'
      - '`windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"` — claves Run presentes en memoria.'
    tools: [Volatility 3]
    artifacts: [registry, scheduled-tasks]
  - title: Extraer
    goal: Recuperar binarios y ficheros para seguir analizando.
    actions:
      - '`windows.pslist --pid <pid> --dump` (imagen del proceso) o `windows.dumpfiles --pid <pid>` a un directorio de salida (`-o out/`).'
      - '`windows.filescan` para localizar objetos de fichero por nombre antes de volcarlos.'
      - Calcula el hash de lo extraído y continúa con Malware Triage; analiza la memoria o los volcados con YARA.
    tools: [Volatility 3, YARA]
  - title: IOCs
    goal: Consolidar los hallazgos.
    actions:
      - Nombres y PIDs de procesos, líneas de comandos, IPs/puertos remotos, mutex, entradas de persistencia, hashes de los ficheros extraídos.
iocs:
  - Nombres, rutas y hashes de los procesos maliciosos.
  - Líneas de comandos.
  - IPs, puertos y dominios remotos.
  - Mutex y named pipes.
  - Entradas de persistencia (servicios, claves Run, tareas).
escalate_when:
  - Es probable el robo de credenciales de LSASS.
  - Se encuentra inyección en procesos del sistema o una técnica de ocultación tipo rootkit.
  - Los mismos IOCs aparecen en otros equipos.
related_playbooks: [windows-endpoint-investigation, malware-triage, suspicious-powershell]
---

Los nombres y opciones de los plugins cambian entre versiones de Volatility 3 — ejecuta `vol -h` y `vol <plugin> -h` para confirmarlos en tu versión. Volatility 3 necesita tablas de símbolos para la build del sistema analizado; por defecto intenta descargar los símbolos de Windows, algo a tener en cuenta en máquinas de análisis sin conexión.
