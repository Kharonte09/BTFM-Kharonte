---
name: Windows Event Logs
summary: Logs estructurados que escribe Windows (.evtx). Tu fuente principal para saber quién inició sesión, qué se ejecutó, qué cambió y si alguien intentó ocultarlo.
category: windows
coverage: intermediate
aliases: [evtx, Event Logs, Security log, Visor de eventos, Registros de eventos de Windows]
tags: [logons, movimiento lateral, ejecución, persistencia, timeline]
start_here:
  - Define la ventana temporal y los equipos en alcance (UTC).
  - Recolecta o exporta `Security`, `System`, `PowerShell/Operational` y `Sysmon/Operational`.
  - Mira el evento más antiguo de cada log — esa es tu ventana de visibilidad.
  - Filtra los logons (`4624`/`4625`) del usuario o equipo de interés.
  - Pivota a la creación de procesos (`4688` / Sysmon `1`) de esa misma sesión.
start_commands:
  - label: Logons correctos recientes (en vivo)
    command: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddDays(-1)}"
  - label: Consultar un log exportado
    command: "Get-WinEvent -FilterHashtable @{Path='.\\Security.evtx'; Id=4625}"
  - label: Exportar un log para análisis offline
    command: 'wevtutil epl Security C:\Cases\Security.evtx'
why:
  - Alerta de logon sospechoso, fuerza bruta o password spraying.
  - Posible movimiento lateral (RDP, SMB, servicios tipo PsExec).
  - Necesitas confirmar qué se ejecutó en un equipo y con qué cuenta.
  - Sospecha de persistencia (servicio, tarea o cuenta nuevos).
  - Puede que se hayan borrado logs.
questions:
  - ¿Quién inició sesión — y con qué tipo de logon?
  - ¿Cuándo, y desde qué equipo o IP?
  - ¿Qué proceso se ejecutó y con qué línea de comandos?
  - ¿Qué cambió — servicios, tareas, cuentas, grupos?
  - ¿Hubo movimiento lateral o borrado de logs?
locations:
  - label: Ficheros de log
    path: C:\Windows\System32\winevt\Logs\*.evtx
  - label: Logs útiles
    path: Security · System · Application · Microsoft-Windows-PowerShell/Operational · Microsoft-Windows-Sysmon/Operational
look_for:
  - '`4624` (logon — revisa el tipo y el origen), `4625` (logon fallido), `4672` (logon privilegiado), `4648` (credenciales explícitas).'
  - '`4688` creación de procesos (con línea de comandos solo si la auditoría lo activa).'
  - '`4104` script block de PowerShell.'
  - '`7045` (System) / `4697` (Security) servicio instalado; `4698` tarea programada creada.'
  - '`4720` cuenta creada, `4732` / `4728` añadida a un grupo.'
  - '`1102` (Security) o `104` (System) — log borrado.'
tools_start: [Event Viewer, EvtxECmd]
tools_deeper: [Chainsaw, Hayabusa]
tool_questions:
  - tool: Event Viewer
    question: Vistazo rápido a unos pocos eventos de un equipo.
  - tool: EvtxECmd
    question: Todos los logs en un único timeline filtrable (CSV).
  - tool: Chainsaw
    question: ¿Qué eventos coinciden con reglas de detección conocidas (Sigma)?
  - tool: Hayabusa
    question: ¿Qué eventos coinciden con reglas de detección conocidas (Sigma), en forma de timeline?
correlate:
  - Logon `4624` (logon ID, IP de origen, tipo)
  - '`4688` / Sysmon `1` creación de procesos en la misma sesión'
  - Sysmon `3` / `22` red y DNS
  - Persistencia — `7045`, `4698`, claves Run
  - Otros equipos — el origen del logon
extract:
  - Cuentas implicadas y tipos de logon
  - Equipos e IPs de origen
  - Nombres de procesos, líneas de comandos y procesos padre
  - Nombres de servicios, tareas y cuentas creados
  - Marcas de tiempo (UTC) para el timeline
mistakes:
  - Los Event IDs dependen del contexto — nunca trates un único evento como prueba de compromiso.
  - Muchos eventos dependen de la política de auditoría (línea de comandos en `4688`, `4698`) — que falte un evento no significa que no haya actividad.
  - Los logs rotan; en servidores con mucha actividad el log de Security puede cubrir solo horas.
  - El Visor de eventos muestra hora local; el `.evtx` guarda UTC.
related_artifacts: [sysmon, powershell-logs, scheduled-tasks, registry]
---

### Logon types (4624 / 4625)

| Tipo | Significado |
| --- | --- |
| 2 | Interactivo (consola) |
| 3 | Red (SMB, unidad mapeada, muchas herramientas de administración remota) |
| 4 / 5 | Batch (tarea programada) / Servicio |
| 7 | Desbloqueo |
| 9 | NewCredentials (`runas /netonly`) |
| 10 | RemoteInteractive (RDP) |
| 11 | CachedInteractive |
