---
name: Tareas programadas
summary: Uno de los mecanismos de persistencia y ejecución remota más usados. Revísalas en casi todos los triages de endpoint.
category: windows
coverage: basic
aliases: [Scheduled Tasks, Task Scheduler, schtasks, Programador de tareas]
tags: [persistencia, movimiento lateral, ejecución]
start_here:
  - Lista las tareas habilitadas y qué ejecuta cada una.
  - Mira las tareas creadas o modificadas en la ventana del incidente.
  - Lee la acción (comando + argumentos) y el usuario con el que se ejecuta.
  - Revisa los eventos de creación (`4698`, TaskScheduler `106`).
start_commands:
  - label: Tareas habilitadas (en vivo)
    command: "Get-ScheduledTask | Where-Object State -ne 'Disabled' | Select-Object TaskPath, TaskName, State"
  - label: Qué ejecuta una tarea
    command: "(Get-ScheduledTask -TaskName '<name>').Actions"
  - label: Todas las tareas, en detalle (cmd)
    command: 'schtasks /query /fo LIST /v'
why:
  - Sospecha de persistencia tras la ejecución de malware.
  - Posible movimiento lateral (`schtasks /create /s <host>`).
  - Algo vuelve a ejecutarse tras matarlo o tras reiniciar.
locations:
  - label: Ficheros XML de tareas
    path: C:\Windows\System32\Tasks\
  - label: Log operativo
    path: Microsoft-Windows-TaskScheduler/Operational
look_for:
  - Acciones que ejecutan scripts o binarios desde `AppData`, `Temp`, `ProgramData` o `Users\Public`.
  - 'Acciones con `powershell.exe`, `cmd.exe`, `mshta.exe` y argumentos codificados o largos.'
  - Nombres que imitan tareas de Microsoft o de un fabricante en la carpeta equivocada.
  - 'Security `4698` (creada) / `4702` (actualizada); TaskScheduler `106` (registrada), `200`/`201` (ejecutada).'
tools_start: [PowerShell, Event Viewer]
tools_deeper: [EvtxECmd]
correlate:
  - Tarea (nombre, acción, autor, fecha)
  - Evento de creación — `4698` / TaskScheduler `106`
  - Logon que la creó — `4624` (tipo 3 = remoto)
  - Binario o script que ejecuta → análisis de PE / PowerShell
extract:
  - Nombre y ruta de la tarea
  - Comando, argumentos y usuario de ejecución
  - Hora de creación y cuenta que la creó
mistakes:
  - '`4698`–`4702` requieren la subcategoría de auditoría "Other Object Access Events" — que no haya evento no es prueba.'
  - Muchas tareas legítimas ejecutan PowerShell — juzga por ruta, autor y momento.
  - Borrar la tarea antes de recolectarla destruye evidencia — exporta primero.
related_artifacts: [windows-event-logs, registry, powershell-logs]
---
