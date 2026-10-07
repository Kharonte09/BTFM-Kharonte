---
name: EXE sospechoso
summary: Triage de un ejecutable Windows del hash a los IOCs — identificar, analizar en estático, consultar reputación, observar el comportamiento y decidir si hacer reversing.
order: 4
scenario: Un .exe / .dll sospechoso
icon: binaries
trigger: Tienes un `.exe` / `.dll` sospechoso — de una alerta, un endpoint, un adjunto o una descarga. Cópialo a un entorno de análisis aislado (idealmente dentro de un archivo con contraseña, por convención `infected`).
tags: [malware, pe, análisis estático, sandbox, triage]
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
iocs:
  - SHA-256 / SHA-1 / MD5 e imphash.
  - Nombres y rutas de los ficheros soltados.
  - Mutex, named pipes, nombres de servicios y tareas, claves del registro.
  - Dominios, IPs y URLs de C2, user agents, fingerprints JA3/JA4 si están disponibles.
escalate_when:
  - La muestra es desconocida o dirigida (sin resultados públicos, nombres internos en los strings).
  - Las capacidades incluyen robo de credenciales, movimiento lateral o comportamiento de ransomware.
  - Se encuentra evidencia de persistencia o C2 en endpoints de producción.
related_playbooks: [malware-triage, windows-endpoint-investigation]
---

Haz todos los pasos en un sistema de análisis aislado. Los pasos estáticos se pueden repetir sin riesgo; los dinámicos modifican el entorno y deben hacerse en una VM desechable o en una sandbox.
