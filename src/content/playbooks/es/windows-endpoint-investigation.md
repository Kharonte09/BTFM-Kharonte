---
name: Investigación de endpoint Windows
summary: Investigación estructurada de un equipo Windows posiblemente comprometido — timeline, procesos, logons, persistencia, red, ficheros, registro y actividad del usuario.
order: 4
trigger: Se sospecha que un endpoint está comprometido (alerta del EDR, detección de malware, indicio de movimiento lateral, reporte de un usuario). Decide pronto si adquirir la **memoria** antes de contener o apagar.
tags: [endpoint, dfir, windows, timeline, movimiento lateral, persistencia]
steps:
  - title: Timeline
    goal: Recolectar y construir un timeline anclado en un evento conocido.
    actions:
      - Adquiere la memoria si el equipo está encendido y es relevante; después recolecta un triage.
      - Analiza los artefactos a CSV y únelos en un único timeline en UTC.
      - Ánclate en el primer evento malicioso conocido y trabaja hacia atrás y hacia delante.
    tools: [KAPE, Velociraptor, EvtxECmd, MFTECmd]
    artifacts: [memory-dump, windows-event-logs]
  - title: Procesos
    goal: Identificar ejecución maliciosa o anómala.
    actions:
      - Revisa los árboles de procesos (EDR, Sysmon `1`, `4688`, memoria).
      - Revisa los artefactos de ejecución de los binarios lanzados en la ventana.
    tools: [PECmd, AmcacheParser]
    artifacts: [prefetch, amcache, shimcache, sysmon, memory-dump]
  - title: Logons
    goal: Determinar qué cuentas se usaron y desde dónde.
    actions:
      - '`4624`/`4625`/`4648`/`4672` con tipos de logon y direcciones de origen; logs de RDP.'
      - Identifica el equipo de origen del movimiento lateral y pivota hacia él.
    tools: [EvtxECmd]
    artifacts: [windows-event-logs]
    escalate: Cuentas privilegiadas o de dominio usadas desde equipos inesperados → amplía el alcance al dominio.
  - title: Persistencia
    goal: Encontrar todos los mecanismos que permitirían al atacante volver.
    actions:
      - Servicios (`7045`), tareas programadas, claves Run, suscripciones WMI, carpetas de inicio, cuentas nuevas.
    tools: [RECmd, Velociraptor]
    artifacts: [scheduled-tasks, registry, windows-event-logs]
  - title: Red
    goal: Identificar C2 y conexiones laterales.
    actions:
      - Conexiones por proceso (Sysmon `3`, EDR, `netscan` de memoria), DNS (Sysmon `22`), logs de firewall/proxy.
    artifacts: [sysmon, memory-dump, ip-domain]
  - title: Ficheros
    goal: Encontrar herramientas soltadas, datos preparados para exfiltrar y ficheros borrados.
    actions:
      - '`$MFT` y USN journal para creaciones, renombrados y borrados en la ventana.'
      - Recolecta los ficheros sospechosos para el triage de malware.
    tools: [MFTECmd]
    artifacts: [pe-executables]
  - title: Registro
    goal: Recuperar cambios de configuración y evidencia de ejecución/uso.
    actions:
      - Autoarranques, servicios, IFEO, COM hijacks; BAM, UserAssist; dispositivos USB.
    tools: [RECmd]
    artifacts: [registry, shimcache]
  - title: Actividad del usuario
    goal: Entender qué hizo el usuario (o el atacante como ese usuario).
    actions:
      - LNK / Jump Lists, ShellBags, historial del navegador, historial de PowerShell.
    artifacts: [lnk, powershell-logs]
  - title: IOCs
    goal: Consolidar hallazgos para el alcance y la contención.
    actions:
      - Hashes, rutas, cuentas, equipos de origen, dominios/IPs, nombres de persistencia.
      - Búscalos en toda la flota antes de dar por cerrado el alcance.
    tools: [Velociraptor, YARA]
iocs:
  - Hashes y rutas de ficheros maliciosos.
  - Cuentas comprometidas y equipos de origen.
  - Nombres de persistencia (tareas, servicios, valores del registro).
  - Dominios e IPs de C2.
escalate_when:
  - Hay cuentas de administrador de dominio o de servicio implicadas.
  - Hay evidencia de credential dumping o movimiento lateral a otros equipos.
  - Hay indicios de preparación o exfiltración de datos.
  - Se borraron logs o se manipularon herramientas de seguridad.
related_playbooks: [malware-triage, suspicious-powershell]
---

Mantén todo en **UTC**, anota la zona horaria del equipo y registra cada acción que hagas en un sistema en vivo: pasa a formar parte de la evidencia.
