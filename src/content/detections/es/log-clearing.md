---
name: Borrado de logs
summary: Alguien ha vaciado un event log para ocultar lo que pasó antes. El propio borrado deja un evento — averigua quién lo hizo, cuándo, y reconstruye el hueco con los logs que han sobrevivido.
order: 3
platforms: [Windows]
mitre: [T1070.001]
coverage: basic
review: true
aliases: [logs borrados, event log borrado, log clearing, antiforense]
tags: [evasión de defensas, antiforense, 1102, 104, event logs]
start_here:
  - Busca el `1102` en Security y el `104` en System.
  - Anota la cuenta que borró el log y la hora exacta (UTC).
  - Mira el evento más antiguo de cada log — ahí empieza tu visibilidad.
  - Reconstruye el hueco con lo que no se borró (Sysmon, PowerShell, otros equipos, el SIEM).
signs:
  - Un evento `1102` / `104` — a menudo el primero del log.
  - Un log cuyo evento más antiguo es mucho más reciente que el de los demás logs del mismo equipo.
  - '`wevtutil cl` o `Clear-EventLog` en la creación de procesos o en los logs de PowerShell.'
  - Un borrado justo después de logons, cuentas nuevas o ejecución de herramientas.
sources:
  - source: Log Security
    look: '`1102` — se borró el log de auditoría; indica la cuenta que lo hizo.'
  - source: Log System
    look: '`104` — se borró un fichero de log (cualquier otro: System, Application, PowerShell…).'
  - source: Creación de procesos / PowerShell
    look: '`4688` / Sysmon `1` con `wevtutil cl`; `4104` con `Clear-EventLog`.'
hunts:
  - source: Windows — en vivo (PowerShell como administrador)
    note: 'Para consultar un log exportado, cambia `LogName=''…''` por `Path=''.\Security.evtx''`.'
    commands:
      - label: Log Security borrado
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102} | Format-List TimeCreated, Message
      - label: Cualquier otro log borrado
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='System'; Id=104} | Format-List TimeCreated, Message
      - label: Evento más antiguo de un log — tu ventana de visibilidad
        command: |-
          Get-WinEvent -LogName Security -MaxEvents 1 -Oldest | Select-Object TimeCreated, Id
      - label: El comando que lo borró (Sysmon)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Where-Object { $_.Message -match 'wevtutil(\.exe)?"?\s+(cl|clear-log)\s|Clear-EventLog' } | Format-List TimeCreated, Message
      - label: Borrado desde PowerShell (script blocks)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104} | Where-Object { $_.Message -match 'Clear-EventLog|Remove-EventLog|wevtutil' } | Format-List TimeCreated, Message
confirm:
  - La cuenta del `1102` no es un administrador haciendo mantenimiento — o es una que se acaba de comprometer.
  - Actividad sospechosa en los logs que han sobrevivido, justo antes del borrado.
  - Varios logs borrados en el mismo minuto.
false_positives:
  - Un administrador que borra logs durante un mantenimiento, un despliegue de imagen o una resolución de problemas — cuenta esperada y documentado.
  - Máquinas de laboratorio y equipos recién instalados.
  - Rotar no es borrar — un log lleno que sobrescribe eventos antiguos no genera `1102` / `104`.
extract:
  - Cuenta que borró el log y su logon ID
  - Hora del borrado (UTC) y qué logs se borraron
  - Línea de comandos y proceso padre, si quedaron registrados
  - El hueco — último evento conocido por otra vía frente al primero tras el borrado
mistakes:
  - Tratar un log borrado como «no hay evidencia» — el borrado es evidencia, y otros logs suelen cubrir el hueco.
  - Mirar solo Security — es frecuente que borren un log y dejen Sysmon o PowerShell intactos.
  - Olvidar las copias reenviadas — el SIEM o un colector pueden conservar lo que se borró en local.
tools: [Event Viewer, EvtxECmd, Chainsaw, Hayabusa]
related_artifacts: [windows-event-logs, sysmon, powershell-logs]
related_playbooks: [windows-endpoint-investigation]
---
