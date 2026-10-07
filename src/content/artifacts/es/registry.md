---
name: Registro de Windows
summary: Base de datos de configuración. En una investigación lo usas sobre todo para la persistencia (qué arranca solo) y la actividad del usuario.
category: windows
coverage: basic
aliases: [Windows Registry, Registry, hives, NTUSER.DAT, Registro]
tags: [persistencia, actividad de usuario, configuración, autoarranque]
start_here:
  - Revisa primero las ubicaciones de autoarranque — `Run` / `RunOnce` en HKLM y HKCU.
  - Lista los servicios y su `ImagePath`.
  - Para análisis offline, recolecta los hives **con** sus logs de transacciones.
  - Anota las últimas escrituras de claves dentro de la ventana del incidente.
start_commands:
  - label: Claves Run (en vivo)
    command: "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'"
  - label: Servicios con ruta del binario (en vivo)
    command: 'Get-CimInstance Win32_Service | Select-Object Name, State, StartMode, PathName'
why:
  - Sospecha de persistencia tras la ejecución de malware.
  - Necesitas saber qué abrió o ejecutó un usuario (actividad de usuario).
  - Servicio o entrada de autoarranque encontrada durante el triage.
locations:
  - label: Hives del sistema
    path: C:\Windows\System32\config\SYSTEM · SOFTWARE · SAM · SECURITY
  - label: Hive del usuario
    path: C:\Users\<user>\NTUSER.DAT
  - label: Claves de autoarranque
    path: HKLM\Software\Microsoft\Windows\CurrentVersion\Run · RunOnce (y HKCU)
look_for:
  - Valores Run / RunOnce que apuntan a `AppData`, `Temp`, `ProgramData` o a scripts.
  - Servicios cuyo `ImagePath` es inusual o ejecuta un script / LOLBin.
  - 'Cambios en `Shell` / `Userinit` de `Winlogon` y entradas `Debugger` en `Image File Execution Options`.'
  - Últimas escrituras de claves que coinciden con el timeline del incidente.
tools_start: [Registry Explorer, RECmd]
tools_deeper: [RegRipper]
correlate:
  - Entrada de autoarranque (clave Run, servicio)
  - Binario al que apunta → hash y análisis (PE)
  - Cuándo se creó — Sysmon `13`, `7045`
  - Qué proceso / usuario la creó
extract:
  - Ruta de la clave, nombre y dato del valor
  - Binario o comando que lanza
  - Marca de tiempo de última escritura
mistakes:
  - La última escritura es por clave, no por valor — no te dice qué valor cambió.
  - Sin los logs de transacciones (`.LOG1` / `.LOG2`) pueden faltar cambios recientes.
  - Muchos programas legítimos usan claves Run — juzga por ruta, firmante y momento.
related_artifacts: [scheduled-tasks, windows-event-logs, sysmon, pe-executables]
---
