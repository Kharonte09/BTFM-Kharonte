---
name: PowerShell sospechoso
summary: Decodificar, desofuscar y contextualizar un comando de PowerShell — y averiguar quién lo ejecutó, qué contactó y si dejó persistencia.
coverage: basic
order: 5
scenario: PowerShell sospechoso en los logs
icon: terminal
tags: [powershell, desofuscación, living off the land, ejecución]
trigger: Una alerta, una entrada de log o un evento del EDR muestra PowerShell con contenido codificado, ofuscado o de tipo descargar-y-ejecutar.
objective: Entender qué hizo el PowerShell, quién lo ejecutó y por qué, y si llevó a un payload, C2 o persistencia.
initial_triage:
  - Consigue la línea de comandos completa y el script block `4104` correspondiente.
  - Decodifícalo / desofúscalo como texto — nunca lo ejecutes.
  - Identifica el proceso padre y el usuario.
  - Revisa la actividad de red en torno a la hora de ejecución.
  - Busca tareas, servicios o claves Run creados en el mismo momento.
evidence:
  - Línea de comandos (`4688`, Sysmon `1`, EDR)
  - Log PowerShell Operational (`4104`)
  - Árbol de procesos
  - Proxy / DNS / eventos de red de Sysmon
  - Ubicaciones de persistencia
steps:
  - title: Comando
    goal: Capturar la línea de comandos exacta y su origen.
    actions:
      - Copia la línea de comandos completa del evento (`4688`, Sysmon `1`, `4104`, EDR), no de una interfaz que la trunque.
      - Registra equipo, usuario, hora (UTC) y fuente del evento.
    artifacts: [powershell-logs, sysmon, windows-event-logs]
  - title: Codificación
    goal: Quitar la codificación de transporte.
    actions:
      - '`-EncodedCommand` / `-enc` → Base64 de texto **UTF-16LE**.'
      - Busca capas anidadas — Base64 + Gzip/Deflate (`IO.Compression`), arrays de caracteres, `-bxor`.
    tools: [CyberChef]
  - title: Desofuscación
    goal: Recuperar la lógica legible sin ejecutarla.
    actions:
      - Resuelve concatenaciones, format strings `-f`, strings invertidos, acentos graves y trucos de mayúsculas.
      - Prioriza el **script block `4104`** — a menudo ya contiene la capa desofuscada.
      - Nunca hagas `IEX` del contenido decodificado «para ver qué hace»; si tienes que evaluarlo en una sandbox, sustituye `IEX` por una salida a fichero.
    tools: [CyberChef]
    artifacts: [powershell-logs]
  - title: Contexto de ejecución
    goal: Entender con qué identidad y privilegios se ejecutó.
    actions:
      - Cuenta de usuario, nivel de integridad, interactivo frente a servicio/tarea, sesión de inicio.
      - Correlaciona con los eventos de logon de esa misma sesión.
    artifacts: [windows-event-logs]
  - title: Proceso padre
    goal: Averiguar qué lanzó PowerShell.
    actions:
      - Aplicaciones Office, `mshta.exe`, `wscript.exe`, `wmiprvse.exe`, `services.exe`, `svchost.exe` (tarea) — cada uno apunta a un vector inicial distinto.
      - Recorre el árbol de procesos hasta el origen.
    artifacts: [sysmon]
  - title: Actividad de red
    goal: Identificar orígenes de descarga y C2.
    actions:
      - Extrae URLs/IPs del script decodificado; revisa proxy, DNS y Sysmon `3`/`22` en torno a la hora de ejecución.
      - Recupera los payloads descargados (del disco, de la caché del proxy o de la URL en una sandbox).
    artifacts: [ip-domain, pcap]
  - title: Persistencia
    goal: Comprobar si volverá a ejecutarse.
    actions:
      - Tareas programadas, claves Run, servicios y suscripciones WMI creadas en el mismo periodo.
      - Comprueba si el mismo comando aparece en la acción de una tarea o en la ruta de imagen de un servicio.
    artifacts: [scheduled-tasks, registry]
  - title: IOCs
    goal: Extraer indicadores y detecciones.
    actions:
      - URLs, dominios, IPs, hashes de ficheros descargados, rutas de ficheros, nombres de tareas/servicios.
      - Fragmentos distintivos del script para hacer hunting en los `4104` de toda la flota.
correlation:
  - Línea de comandos
  - Script block `4104`
  - Proceso padre y usuario / logon
  - Red — descargas y C2
  - Persistencia
  - Payload descargado → EXE sospechoso
iocs:
  - URLs, dominios e IPs de descarga.
  - Hashes de los payloads descargados.
  - Strings distintivos del script (nombres de variables, nombres de funciones, user agents).
  - Artefactos de persistencia (nombres de tareas, valores del registro).
decision_points:
  - decision: close
    when: Actividad legítima de administración o de software, confirmada con el responsable.
  - decision: deeper
    when: Descarga una segunda etapa — analiza el payload (EXE sospechoso).
  - decision: isolate
    when: Se observa tráfico de C2, bypass de AMSI o acceso a credenciales (LSASS).
  - decision: escalate
    when: El padre es un proceso de servidor (servidor web, SQL) — posible explotación — o varios equipos ejecutan el mismo script.
output:
  - Qué hizo el script, en palabras claras
  - Quién lo ejecutó, desde qué padre y en qué equipo
  - IOCs — URLs, dominios, IPs, hashes de payloads, strings del script
  - Persistencia encontrada
  - Timeline (UTC)
  - Veredicto y siguiente acción
related_playbooks: [windows-endpoint-investigation, suspicious-exe]
---

PowerShell es una herramienta de administración legítima — la pregunta nunca es «¿se usó PowerShell?», sino **qué hizo, quién lo ejecutó y por qué**.
