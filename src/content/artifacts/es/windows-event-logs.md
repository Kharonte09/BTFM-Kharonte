---
name: Windows Event Logs
summary: Logs estructurados que escriben Windows y las aplicaciones (.evtx). Fuente principal para logons, creación de procesos, servicios, tareas y manipulación de logs.
category: windows
aliases: [Windows Event Logs, evtx, Event Logs, Security log, Visor de eventos]
tags: [logons, movimiento lateral, ejecución, persistencia, timeline]
evidence:
  - Autenticación — logons correctos y fallidos, tipo de logon, equipo de origen y cuenta.
  - Creación de procesos (si la auditoría está activa), incluida la línea de comandos.
  - Instalación de servicios, creación de tareas programadas, cambios de cuentas y grupos.
  - Borrado de logs y cambios en la política de auditoría.
locations:
  - label: Ficheros de log
    path: C:\Windows\System32\winevt\Logs\*.evtx
  - label: Canales principales
    path: Security.evtx · System.evtx · Application.evtx
  - label: Logs operativos útiles
    path: Microsoft-Windows-PowerShell%4Operational.evtx · Microsoft-Windows-Sysmon%4Operational.evtx · Microsoft-Windows-TaskScheduler%4Operational.evtx · Microsoft-Windows-TerminalServices-*.evtx
questions:
  - ¿Quién inició sesión, cuándo y desde dónde?
  - ¿Qué tipo de logon se usó (interactivo, de red, RDP)?
  - ¿Qué proceso se ejecutó y con qué línea de comandos?
  - ¿Hubo movimiento lateral (logons de red, credenciales explícitas, servicios remotos)?
  - ¿Se creó persistencia (servicio, tarea programada, cuenta nueva)?
  - ¿Se borraron logs?
tools: [EvtxECmd, Event Viewer, Hayabusa, Chainsaw, Velociraptor, KAPE]
look_for:
  - '`4624` con tipo de logon 3 o 10 desde equipos inesperados; ráfagas de `4625` (fuerza bruta / password spraying).'
  - '`4648` (credenciales explícitas) y `4672` (privilegios especiales) justo después de un logon.'
  - '`4688` / Sysmon `1` con LOLBins o líneas de comandos codificadas.'
  - '`7045` servicios nuevos con rutas en `%TEMP%`, `ADMIN$` o one-liners de PowerShell.'
  - '`4698` / TaskScheduler `106` tareas programadas nuevas.'
  - '`1102` (Security) o `104` (System) — log borrado.'
  - Huecos en el timeline — el logging se detuvo o el log rotó.
limitations:
  - Muchos eventos valiosos dependen de la **política de auditoría** (p. ej. línea de comandos en `4688`, acceso a objetos) y vienen desactivados por defecto.
  - Los logs tienen un tamaño máximo y rotan; en servidores con mucha actividad el log de Security puede cubrir solo horas.
  - Un atacante con privilegios de administrador puede borrar o manipular los logs.
  - Las marcas de tiempo del fichero están en UTC; los visores las muestran en hora local.
related_artifacts: [sysmon, powershell-logs, scheduled-tasks, registry]
---

Windows escribe eventos en canales que se guardan como ficheros `.evtx`. El log de **Security** contiene los eventos de autenticación y auditoría, **System** los de servicios y drivers, y muchos componentes tienen su propio log *Operational* (PowerShell, Task Scheduler, RDP, Defender, Sysmon).

En una investigación, analiza los logs en un único timeline en lugar de revisarlos uno a uno en el Visor de eventos.

### Logon types (4624 / 4625)

| Tipo | Significado |
| --- | --- |
| 2 | Interactivo (consola) |
| 3 | Red (SMB, unidad mapeada, muchas herramientas de administración remota) |
| 4 | Batch (tareas programadas) |
| 5 | Servicio |
| 7 | Desbloqueo |
| 8 | NetworkCleartext |
| 9 | NewCredentials (`runas /netonly`) |
| 10 | RemoteInteractive (RDP) |
| 11 | CachedInteractive |
