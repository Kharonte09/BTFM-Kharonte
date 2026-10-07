---
name: Registros de eventos de Windows
summary: Registros estructurados que escriben Windows y las aplicaciones (.evtx). Fuente principal para inicios de sesión, creación de procesos, servicios, tareas y manipulación de registros.
category: windows
aliases: [Windows Event Logs, evtx, Event Logs, Security log, Visor de eventos]
tags: [inicios de sesión, movimiento lateral, ejecución, persistencia, timeline]
evidence:
  - Autenticación — inicios de sesión correctos y fallidos, tipo de inicio de sesión, equipo de origen y cuenta.
  - Creación de procesos (si la auditoría está activa), incluida la línea de comandos.
  - Instalación de servicios, creación de tareas programadas, cambios de cuentas y grupos.
  - Borrado de registros y cambios en la política de auditoría.
locations:
  - label: Ficheros de registro
    path: C:\Windows\System32\winevt\Logs\*.evtx
  - label: Canales principales
    path: Security.evtx · System.evtx · Application.evtx
  - label: Registros operativos útiles
    path: Microsoft-Windows-PowerShell%4Operational.evtx · Microsoft-Windows-Sysmon%4Operational.evtx · Microsoft-Windows-TaskScheduler%4Operational.evtx · Microsoft-Windows-TerminalServices-*.evtx
questions:
  - ¿Quién inició sesión, cuándo y desde dónde?
  - ¿Qué tipo de inicio de sesión se usó (interactivo, de red, RDP)?
  - ¿Qué proceso se ejecutó y con qué línea de comandos?
  - ¿Hubo movimiento lateral (inicios de sesión de red, credenciales explícitas, servicios remotos)?
  - ¿Se creó persistencia (servicio, tarea programada, cuenta nueva)?
  - ¿Se borraron registros?
tools: [EvtxECmd, Event Viewer, Hayabusa, Chainsaw, Velociraptor, KAPE]
look_for:
  - '`4624` con tipo de inicio de sesión 3 o 10 desde equipos inesperados; ráfagas de `4625` (fuerza bruta / password spraying).'
  - '`4648` (credenciales explícitas) y `4672` (privilegios especiales) justo después de un inicio de sesión.'
  - '`4688` / Sysmon `1` con LOLBins o líneas de comandos codificadas.'
  - '`7045` servicios nuevos con rutas en `%TEMP%`, `ADMIN$` o one-liners de PowerShell.'
  - '`4698` / TaskScheduler `106` tareas programadas nuevas.'
  - '`1102` (Security) o `104` (System) — registro borrado.'
  - Huecos en el timeline — el registro se detuvo o rotó.
limitations:
  - Muchos eventos valiosos dependen de la **política de auditoría** (p. ej. línea de comandos en `4688`, acceso a objetos) y vienen desactivados por defecto.
  - Los registros tienen un tamaño máximo y rotan; en servidores con mucha actividad el log de Security puede cubrir solo horas.
  - Un atacante con privilegios de administrador puede borrar o manipular los registros.
  - Las marcas de tiempo del fichero están en UTC; los visores las muestran en hora local.
related_artifacts: [sysmon, powershell-logs, scheduled-tasks, registry]
---

Windows escribe eventos en canales que se guardan como ficheros `.evtx`. El registro de **Security** contiene los eventos de autenticación y auditoría, **System** los de servicios y drivers, y muchos componentes tienen su propio registro *Operational* (PowerShell, Task Scheduler, RDP, Defender, Sysmon).

En una investigación, analiza los registros en un único timeline en lugar de revisarlos uno a uno en el Visor de eventos. Consulta la cheatsheet **Windows Event IDs** para los IDs más útiles.

### Tipos de inicio de sesión (4624 / 4625)

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
