---
name: Sysmon
summary: System Monitor de Sysinternals. Registro basado en driver de creación de procesos, conexiones de red y actividad de ficheros y registro en un canal de eventos.
category: windows
aliases: [System Monitor, Sysmon logs]
tags: [creación de procesos, red, detección, telemetría, ejecución]
evidence:
  - Creación de procesos con línea de comandos completa, hashes, proceso padre y usuario.
  - Conexiones de red atribuidas a un proceso.
  - Creación de ficheros, modificación del registro, consultas DNS y carga de imágenes (según la configuración).
  - Acceso a procesos y creación de hilos remotos (habituales en robo de credenciales e inyección).
locations:
  - label: Canal de eventos
    path: Microsoft-Windows-Sysmon/Operational
  - label: Fichero de registro
    path: C:\Windows\System32\winevt\Logs\Microsoft-Windows-Sysmon%4Operational.evtx
questions:
  - ¿Qué proceso lanzó este proceso (cadena de padres)?
  - ¿Qué proceso hizo esta conexión de red o consulta DNS?
  - ¿Qué fichero escribió este proceso y cuál es su hash?
  - ¿Accedió algún proceso a la memoria de `lsass.exe`?
  - ¿Se creó un hilo remoto en otro proceso?
tools: [EvtxECmd, Hayabusa, Chainsaw, Velociraptor, Event Viewer]
look_for:
  - 'Evento `1` — aplicaciones Office, navegadores o `wmiprvse.exe` lanzando `cmd.exe` / `powershell.exe`.'
  - 'Evento `3` — conexiones de red de procesos que no deberían hablar con Internet.'
  - 'Evento `10` — `TargetImage` `lsass.exe` con `GrantedAccess` sospechoso desde orígenes inusuales.'
  - 'Evento `8` — `CreateRemoteThread` hacia otro proceso.'
  - 'Evento `11` — ejecutables o scripts escritos en rutas escribibles por el usuario.'
  - 'Eventos `12`/`13` — modificación de claves Run y de servicios.'
  - 'Evento `22` — consultas DNS a dominios raros o recién vistos.'
limitations:
  - No viene instalado por defecto — hay que desplegarlo con una configuración.
  - Solo registra lo que incluye la configuración; los eventos ruidosos suelen filtrarse.
  - La cobertura de los eventos `3` y `22` depende mucho de la configuración y a menudo se desactivan por volumen.
  - Un atacante con privilegios de administrador puede descargar el driver o cambiar la configuración (busca el evento `16` y paradas del servicio).
related_artifacts: [windows-event-logs, powershell-logs, pcap]
---

Sysmon es una herramienta gratuita de Microsoft Sysinternals que se instala como servicio y driver. Escribe telemetría detallada en su propio canal de eventos, controlada por una configuración XML que define qué eventos se incluyen o excluyen.

Las configuraciones de la comunidad más usadas (p. ej. `sysmon-config` de SwiftOnSecurity o `sysmon-modular` de Olaf Hartong) son buenos puntos de partida. Comprueba siempre **qué configuración se desplegó** antes de concluir que algo *no* ocurrió.

Consulta la cheatsheet **Windows Event IDs** para la lista completa de eventos de Sysmon.
