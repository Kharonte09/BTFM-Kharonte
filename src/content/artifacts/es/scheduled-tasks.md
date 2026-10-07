---
name: Tareas programadas
summary: Tareas registradas en el Programador de tareas de Windows. Mecanismo habitual de persistencia y de ejecución remota.
category: windows
aliases: [Scheduled Tasks, Task Scheduler, schtasks, Programador de tareas]
tags: [persistencia, movimiento lateral, ejecución]
evidence:
  - Definición de la tarea — desencadenador, acción (comando + argumentos), principal (usuario), autor y fecha de registro.
  - Eventos de creación, actualización, borrado y ejecución en los logs.
locations:
  - label: Ficheros XML de tareas
    path: C:\Windows\System32\Tasks\
  - label: Caché en el registro
    path: HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache\Tree · \Tasks
  - label: Log operativo
    path: Microsoft-Windows-TaskScheduler/Operational
questions:
  - ¿Se creó persistencia mediante una tarea programada, y quién lo hizo?
  - ¿Qué comando ejecuta la tarea y con qué usuario?
  - ¿Se creó la tarea de forma remota (movimiento lateral)?
  - ¿Cuándo se ejecutó la tarea?
tools: [Velociraptor, KAPE, EvtxECmd, RECmd, PowerShell]
look_for:
  - Acciones que ejecutan scripts o binarios desde `AppData`, `Temp`, `ProgramData` o `Users\Public`.
  - 'Acciones con `powershell.exe` / `cmd.exe` / `mshta.exe` y argumentos codificados o largos.'
  - Nombres de tarea que imitan tareas legítimas de Microsoft o de un fabricante pero en la carpeta equivocada.
  - 'Security `4698` (creada) / `4702` (actualizada) y TaskScheduler `106` (registrada), `140` (actualizada), `141` (borrada), `200`/`201` (acción iniciada/completada).'
  - Tareas presentes en el `TaskCache` del registro pero sin fichero XML, o sin descriptor de seguridad (tareas ocultas).
limitations:
  - Los eventos de Security `4698`–`4702` requieren la subcategoría de auditoría "Other Object Access Events".
  - El log Operational de TaskScheduler puede estar desactivado o ser pequeño en sistemas antiguos.
  - El XML de la tarea puede modificarse tras su creación; revisa tanto el XML como el registro.
related_artifacts: [windows-event-logs, registry, powershell-logs]
---

Las tareas programadas se guardan como ficheros XML en `C:\Windows\System32\Tasks\` y también en el `TaskCache` del registro. Comparar ambas fuentes ayuda a detectar manipulaciones, como tareas ocultadas eliminando su descriptor de seguridad.

La creación remota (`schtasks /create /s <host>`, o mediante la interfaz RPC del Programador de tareas) es una técnica de movimiento lateral habitual; correlaciónala con logons de red (`4624` tipo 3) en el equipo destino.
