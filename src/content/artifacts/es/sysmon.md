---
name: Sysmon
summary: Logs del System Monitor de Sysinternals. Creación de procesos con línea de comandos y hashes, conexiones de red y actividad de ficheros y registro — la mejor fuente para reconstruir un árbol de procesos.
category: windows
coverage: basic
aliases: [System Monitor, Sysmon logs]
tags: [creación de procesos, red, detección, telemetría, ejecución]
start_here:
  - Confirma que Sysmon está instalado y qué configuración hay desplegada — solo registra lo que incluye la config.
  - Filtra el evento `1` (creación de procesos) para el equipo y la ventana temporal.
  - Reconstruye el árbol de procesos con `ParentImage` / `ParentProcessGuid`.
  - Pivota desde el proceso sospechoso a los eventos `3` (red), `11` (ficheros) y `13` (registro).
start_commands:
  - label: Eventos recientes de creación de procesos (en vivo)
    command: "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} -MaxEvents 50"
why:
  - Alerta del EDR o del SIEM basada en telemetría de Sysmon.
  - Necesitas la cadena padre/hijo de un proceso sospechoso.
  - Necesitas saber qué proceso hizo una conexión o una consulta DNS.
  - Sospecha de robo de credenciales (acceso a `lsass.exe`) o de inyección.
questions:
  - ¿Qué lanzó este proceso (cadena de padres)?
  - ¿Qué proceso hizo esta conexión o consulta DNS?
  - ¿Qué escribió el proceso y cuál es su hash?
look_for:
  - 'Evento `1` — Office, navegadores o `wmiprvse.exe` lanzando `cmd.exe` / `powershell.exe`.'
  - 'Evento `3` / `22` — red y DNS de procesos que no deberían hablar con Internet.'
  - 'Evento `10` — acceso a `lsass.exe` desde procesos inusuales.'
  - 'Evento `8` — `CreateRemoteThread` hacia otro proceso.'
  - 'Evento `11` — ejecutables o scripts escritos en rutas escribibles por el usuario.'
  - 'Eventos `12`/`13` — cambios en claves Run y servicios.'
tools_start: [Event Viewer, EvtxECmd]
tools_deeper: [Chainsaw, Hayabusa]
correlate:
  - Proceso Sysmon `1` + línea de comandos
  - Proceso padre → usuario / logon (`4624`)
  - Sysmon `3` / `22` red y DNS
  - Sysmon `11` ficheros escritos → hash del fichero
  - Sysmon `13` registro → persistencia
extract:
  - Imagen del proceso, línea de comandos, hashes
  - Proceso padre y usuario
  - IPs y puertos remotos y dominios consultados
  - Ficheros y claves del registro escritos
mistakes:
  - Que no haya evento no significa que no haya actividad — revisa primero la configuración.
  - Un atacante con privilegios de administrador puede parar Sysmon o cambiar su config (busca el evento `16` y paradas del servicio).
  - '`ParentImage` por sí solo se puede falsificar — confírmalo con `ParentProcessGuid` y los tiempos.'
related_artifacts: [windows-event-logs, powershell-logs, pe-executables, pcap]
---
