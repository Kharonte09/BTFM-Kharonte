---
name: EXE sospechoso
summary: Triage de un ejecutable Windows del hash a los IOCs — identificar, analizar en estático, consultar reputación, observar el comportamiento y decidir si hacer reversing.
coverage: basic
order: 4
scenario: Un .exe / .dll sospechoso
icon: binaries
tags: [malware, pe, análisis estático, sandbox, triage]
trigger: Tienes un `.exe` / `.dll` sospechoso — de una alerta, un endpoint, un adjunto o una descarga. Cópialo a un entorno de análisis aislado (idealmente dentro de un archivo con contraseña, por convención `infected`).
objective: Determinar si el ejecutable es malicioso, qué hace y qué IOCs permiten acotar su alcance.
initial_triage:
  - Copia la muestra a una VM aislada; calcula el SHA-256.
  - Identifica el tipo real — empaquetado, .NET, instalador, nativo.
  - Revisa la firma y la información de versión.
  - Consulta el hash (no subas la muestra por defecto).
  - Averigua de dónde vino y si se ejecutó (Sysmon `1`, Prefetch).
evidence:
  - La muestra
  - Dónde se encontró (equipo, ruta, hora)
  - Telemetría de procesos y red de ese equipo
  - Informe de sandbox, si la política lo permite
steps:
  - title: Hash
    goal: Obtener el hash del fichero antes de nada.
    actions:
      - Calcula el SHA-256 (y MD5/SHA-1 para consultas en sistemas antiguos).
      - Registra ruta de origen, equipo, momento de la recolección y quién lo recolectó.
    tools: [PowerShell]
  - title: Identificación del fichero
    goal: Saber con qué estás tratando.
    actions:
      - Comprueba el tipo real, la arquitectura, el compilador, el packer o el instalador.
      - Decide la vía — empaquetado (desempaquetar/sandbox), .NET (descompilar), instalador/SFX (extraer), nativo (estático).
    tools: [Detect It Easy]
    artifacts: [pe-executables]
  - title: Metadatos
    goal: Reunir propiedades que apoyen o contradigan la historia.
    actions:
      - Fecha de compilación, información de versión, nombre de fichero original, ruta PDB.
      - Firma Authenticode — validez, firmante, sello de tiempo.
      - Imphash y Rich header para agrupar muestras.
    tools: [PEStudio]
  - title: Análisis estático
    goal: Conocer capacidades e IOCs sin ejecutar.
    actions:
      - Revisa imports, secciones, entropía, recursos y overlay.
      - Extrae strings, incluidos los ofuscados.
      - Identifica capacidades y técnicas ATT&CK candidatas.
      - Analiza con conjuntos de reglas YARA.
    tools: [PEStudio, FLOSS, capa, YARA]
  - title: Reputación
    goal: Comprobar si la muestra o sus IOCs ya son conocidos.
    actions:
      - Consulta el **hash** (pasivo). No subas el fichero salvo que la política lo permita.
      - Revisa la fecha de primera aparición, los nombres de detección, el comportamiento y las relaciones.
      - Consulta los dominios/IPs extraídos.
    tools: [VirusTotal]
    artifacts: [ip-domain]
  - title: Sandbox
    goal: Observar el comportamiento de forma segura.
    actions:
      - Ejecútalo en una sandbox aislada (interna, o pública si la política lo permite — los envíos públicos pueden ser visibles para otros).
      - Registra árbol de procesos, ficheros escritos, cambios en el registro y actividad de red.
    tools: [ANY.RUN, Hybrid Analysis]
  - title: Comportamiento de red
    goal: Extraer indicadores de red y entender el C2.
    actions:
      - Revisa la actividad DNS, HTTP y TLS de la captura de la sandbox.
      - Anota intervalos de beacon, URIs, user agents y certificados.
    tools: [Wireshark]
    artifacts: [pcap, ip-domain]
  - title: Persistencia
    goal: Identificar cómo sobrevive la muestra a los reinicios.
    actions:
      - Claves Run, servicios, tareas programadas, carpeta Inicio, suscripciones WMI.
      - Úsalos como consultas de hunting en toda la flota.
    artifacts: [registry, scheduled-tasks]
  - title: Análisis profundo
    goal: Responder preguntas concretas que el triage no pudo resolver.
    actions:
      - Decide qué necesitas — extraer la configuración, el protocolo, la rutina de descifrado.
      - Desempaqueta si hace falta y haz reversing de funciones concretas (empieza por las direcciones de capa).
    tools: [Ghidra, x64dbg, ILSpy]
    escalate: Haz reversing solo cuando la respuesta cambie la respuesta al incidente — acótalo en tiempo.
  - title: IOCs
    goal: Entregar indicadores y detecciones.
    actions:
      - Hashes, nombres/rutas de ficheros, mutex, claves del registro, nombres de tareas/servicios, dominios, IPs, URLs, user agents.
      - Escribe o afina una regla YARA y consultas de hunting.
    tools: [YARA]
correlation:
  - Muestra (hash, ruta)
  - Creación de proceso — Sysmon `1` / `4688`
  - Proceso padre y usuario
  - Red — Sysmon `3` / `22`, proxy
  - Persistencia — claves Run, servicios, tareas
iocs:
  - SHA-256 / SHA-1 / MD5 e imphash.
  - Nombres y rutas de los ficheros soltados.
  - Mutex, named pipes, nombres de servicios y tareas, claves del registro.
  - Dominios, IPs y URLs de C2, user agents, fingerprints JA3/JA4 si están disponibles.
decision_points:
  - decision: close
    when: Software legítimo conocido, firmado correctamente y con el comportamiento esperado.
  - decision: deeper
    when: Muestra empaquetada, desconocida o evasiva — sandbox y, solo si la respuesta cambia la actuación, reversing de funciones concretas.
  - decision: isolate
    when: Se ejecutó en un equipo de producción y muestra C2 o persistencia.
  - decision: escalate
    when: Capacidades de robo de credenciales, movimiento lateral o ransomware, o varios equipos afectados.
output:
  - Veredicto y nivel de confianza
  - IOCs — hashes, rutas, dominios, IPs, mutex, nombres de persistencia
  - Equipos afectados
  - Resumen del comportamiento
  - Regla YARA o consultas de hunting
  - Siguiente acción
related_playbooks: [malware-triage, windows-endpoint-investigation]
---

Haz todos los pasos en un sistema de análisis aislado. Los pasos estáticos se pueden repetir sin riesgo; los dinámicos modifican el entorno y deben hacerse en una VM desechable o en una sandbox.
