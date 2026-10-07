---
name: EvtxECmd
summary: Analiza registros de eventos .evtx de Windows y los normaliza a CSV/JSON mediante mapas de la comunidad, listos para el timeline.
category: windows
type: Parser de artefactos
platforms: [Windows]
license: Gratuita (MIT)
homepage: https://ericzimmerman.github.io/
difficulty: basic
tags: [registros de eventos, evtx, timeline, eric zimmerman, inicios de sesión]
use_when:
  - Has recolectado ficheros `.evtx` y los necesitas en una única tabla filtrable.
  - Necesitas correlacionar inicios de sesión, creación de procesos, servicios y PowerShell entre varios registros.
  - Quieres campos consistentes (usuario, equipo remoto, ejecutable) independientemente del XML de cada evento.
look_for:
  - Eventos de inicio de sesión (4624/4625/4648) — filtra por tipo de inicio de sesión y dirección de origen.
  - Instalación de servicios (7045) y creación de tareas programadas (4698, TaskScheduler 106).
  - Creación de procesos con línea de comandos (4688 / Sysmon 1).
  - Script blocks de PowerShell (4104) y borrado de registros (1102, System 104).
workflow:
  - Recolectar `winevt\Logs`
  - EvtxECmd → CSV
  - Cargar en Timeline Explorer
  - Filtrar por Event ID / ventana temporal
  - Pivotar por usuario, equipo y proceso
examples:
  - label: Analizar un directorio de registros completo
    command: 'EvtxECmd.exe -d "C:\Cases\triage\C\Windows\System32\winevt\Logs" --csv "C:\Cases\out" --csvf evtx.csv'
  - label: Analizar un único registro
    command: 'EvtxECmd.exe -f "C:\Cases\triage\Security.evtx" --csv "C:\Cases\out"'
  - label: Incluir solo Event IDs concretos
    command: 'EvtxECmd.exe -f "C:\Cases\triage\Security.evtx" --csv "C:\Cases\out" --inc 4624,4625,4648,4672'
outputs:
  - Una fila por evento con columnas comunes (fecha de creación, equipo, canal, Event ID, proveedor).
  - Campos normalizados por los mapas (`UserName`, `RemoteHost`, `ExecutableInfo`, `PayloadData1-6`) para los Event IDs mapeados.
  - El payload completo del evento para los campos no mapeados.
notes:
  - Actualiza los mapas (`EvtxECmd.exe --sync`); la normalización depende de ellos.
  - Las horas están en UTC.
  - Los registros rotan; comprueba el evento más antiguo de cada uno para conocer tu ventana de visibilidad.
complements: [KAPE, Timeline Explorer, Hayabusa, Chainsaw]
related_artifacts: [windows-event-logs, sysmon, powershell-logs, scheduled-tasks]
---

EvtxECmd forma parte de las herramientas de Eric Zimmerman. Lee los registros de eventos XML de Windows (`.evtx`) y usa **mapas** — ficheros YAML indexados por canal y Event ID — para extraer los campos útiles de cada evento a columnas consistentes.

Para un triaje orientado a detección sobre los mismos registros, herramientas basadas en Sigma como **Hayabusa** o **Chainsaw** son complementos habituales.
