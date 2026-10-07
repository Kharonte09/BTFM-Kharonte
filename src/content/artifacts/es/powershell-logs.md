---
name: PowerShell Logs
summary: Líneas de comandos, script block logs (4104) e historial de consola. Empieza aquí cuando veas PowerShell sospechoso — decodifícalo y averigua quién lo ejecutó y qué tocó.
category: windows
coverage: basic
aliases: [Script Block Logging, 4104, PSReadLine, Suspicious PowerShell]
tags: [powershell, ejecución, desofuscación, living off the land]
start_here:
  - Consigue la línea de comandos **completa** (`4688`, Sysmon `1`, EDR) — no la de una interfaz que la trunque.
  - Busca el script block `4104` correspondiente — a menudo muestra el código ya desofuscado.
  - Identifica el proceso padre y el usuario.
  - Decodifica el contenido codificado sin ejecutarlo.
  - Revisa la actividad de red y la persistencia en ese mismo momento.
start_commands:
  - label: Script blocks recientes (en vivo)
    command: "Get-WinEvent -LogName 'Microsoft-Windows-PowerShell/Operational' -FilterXPath '*[System[EventID=4104]]' -MaxEvents 50"
  - label: Decodificar -EncodedCommand (UTF-16LE) sin ejecutarlo
    command: '[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($b64))'
why:
  - Alerta de PowerShell codificado u ofuscado.
  - PowerShell lanzado por Office, un navegador, `mshta.exe` o `wscript.exe`.
  - Comportamiento de descargar-y-ejecutar en la telemetría del proxy o del EDR.
  - Necesitas saber qué tecleó un atacante en un equipo.
questions:
  - ¿Qué hizo exactamente el comando o script?
  - ¿Quién lo ejecutó y qué proceso lo lanzó?
  - ¿Descargó o contactó con algo?
  - ¿Creó persistencia?
locations:
  - label: Script block / module logging
    path: Microsoft-Windows-PowerShell/Operational (4104, 4103)
  - label: Arranque/parada del motor
    path: Windows PowerShell.evtx (400 / 403)
  - label: Historial de consola
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
look_for:
  - '`-EncodedCommand` / `-enc`, `-NoProfile`, `-WindowStyle Hidden`, `-ExecutionPolicy Bypass`.'
  - '`IEX` / `Invoke-Expression`, `DownloadString`, `Invoke-WebRequest`, `Net.WebClient`.'
  - '`FromBase64String`, `-bxor`, arrays de `[char]`, concatenación e inversión de strings.'
  - Referencias a `AmsiUtils` o `amsiInitFailed` (manipulación de AMSI).
  - 'Eventos `4104` con nivel **Warning** — Windows los marca como sospechosos.'
tools_start: [CyberChef, Event Viewer]
tools_deeper: [EvtxECmd]
tool_questions:
  - tool: CyberChef
    question: ¿Qué dice realmente el contenido codificado / ofuscado?
  - tool: Event Viewer
    question: ¿Qué script blocks se ejecutaron en este equipo y cuándo?
  - tool: EvtxECmd
    question: Todos los eventos de PowerShell de varios equipos en un timeline.
correlate:
  - Línea de comandos — `4688` / Sysmon `1`
  - Proceso padre y usuario
  - Script block — `4104`
  - Red — Sysmon `3` / `22`, proxy
  - Ficheros escritos — Sysmon `11`
  - Persistencia — tareas, claves Run, servicios
extract:
  - URLs, dominios e IPs de descarga
  - Hashes de los payloads descargados
  - Strings distintivos del script (nombres de funciones, variables, user agents)
  - Nombres de tareas, servicios o claves del registro creados
mistakes:
  - Estos indicadores no son maliciosos por sí solos — administradores y software usan `-enc`, `-NoProfile` e `IEX` de forma legítima.
  - Nunca ejecutes el contenido decodificado «para ver qué hace»; decodifícalo como texto.
  - El script block logging puede estar desactivado; PowerShell v2 lo evita.
  - Los scripts grandes se dividen en varios eventos `4104` — reconstruye el script entero antes de concluir.
related_artifacts: [windows-event-logs, sysmon, scheduled-tasks]
---
