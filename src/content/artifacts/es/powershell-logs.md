---
name: Registros de PowerShell
summary: Registro de script blocks, módulos y motor, transcripciones e historial de consola. La fuente principal para reconstruir actividad de PowerShell.
category: windows
aliases: [PowerShell Logs, PowerShell, Script Block Logging, 4104, PSReadLine]
tags: [powershell, ejecución, desofuscación, living off the land]
evidence:
  - El contenido de los script blocks ejecutados (`4104`), a menudo ya resueltas las capas de ofuscación.
  - Detalles de ejecución de pipelines y módulos (`4103`).
  - Arranque/parada del motor con la aplicación anfitriona y la línea de comandos (registro Windows PowerShell `400`/`403`).
  - Comandos tecleados por un usuario (historial de PSReadLine).
locations:
  - label: Registro operativo
    path: Microsoft-Windows-PowerShell/Operational
  - label: Registro clásico
    path: Windows PowerShell.evtx
  - label: Historial de consola
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
  - label: Transcripciones (si están activas)
    path: Directorio configurado (por defecto, bajo la carpeta Documentos del usuario)
questions:
  - ¿Qué hizo exactamente el comando o script de PowerShell?
  - ¿Se ejecutó un comando codificado o un download cradle?
  - ¿Qué usuario y qué proceso padre lanzaron PowerShell?
  - ¿Se manipuló AMSI o el registro de eventos?
tools: [EvtxECmd, CyberChef, Hayabusa, Chainsaw, PowerShell]
look_for:
  - '`-EncodedCommand` / `-enc`, `-NoProfile`, `-WindowStyle Hidden`, `-ExecutionPolicy Bypass`.'
  - Download cradles — `Net.WebClient`, `DownloadString`, `Invoke-WebRequest`, `iwr`, `Start-BitsTransfer`.
  - '`IEX` / `Invoke-Expression` sobre contenido descargado o decodificado.'
  - '`FromBase64String`, `-bxor`, arrays de `[char]`, inversión y concatenación de cadenas como ofuscación.'
  - Referencias a `AmsiUtils`, `amsiInitFailed` o manipulación por reflexión.
  - 'Eventos `4104` con nivel **Warning** — Windows marca los script blocks que considera sospechosos.'
limitations:
  - El registro de script blocks y de módulos debe activarse por política para tener cobertura completa.
  - Los scripts grandes se dividen en varios eventos `4104` (revisa los campos de número de mensaje / total).
  - PowerShell v2 (si está instalado) evita el registro de script blocks — busca degradaciones de versión.
  - El historial de PSReadLine solo cubre sesiones interactivas de consola y puede borrarse.
related_artifacts: [windows-event-logs, sysmon, scheduled-tasks]
---

PowerShell tiene varias fuentes de registro independientes. El **registro de script blocks** (`4104`) es la más valiosa porque guarda el código que el motor compila realmente — después de resolver capas como `-EncodedCommand` o la concatenación de cadenas.

Incluso sin configuración explícita, Windows PowerShell 5 y posteriores registran automáticamente con nivel Warning los script blocks con contenido sospechoso.
