---
name: PE / EXE / DLL
summary: Ejecutables y librerías de Windows (EXE, DLL, SYS, .NET). El payload de malware más habitual — identifícalo, consulta su reputación, averigua qué hace y dónde se ejecutó.
category: binaries
coverage: basic
aliases: [PE Executables (EXE / DLL), EXE, DLL, PE, .NET assemblies, Portable Executable, Suspicious EXE, Ejecutable]
tags: [malware, análisis estático, hashes, imports, packers]
start_here:
  - Preserva la muestra original (cópiala a una VM de análisis aislada, idealmente en un archivo con contraseña `infected`).
  - Calcula el SHA-256 y anota de dónde salió el fichero.
  - Identifica el tipo real y la arquitectura — ¿empaquetado? ¿.NET? ¿instalador?
  - Comprueba la firma Authenticode y la información de versión.
  - Consulta la reputación del **hash** (no subas el fichero).
start_commands:
  - label: Hash (Windows)
    command: 'Get-FileHash .\sample.exe -Algorithm SHA256'
  - label: Firma
    command: 'Get-AuthenticodeSignature .\sample.exe'
  - label: Hash y tipo (Linux)
    command: 'sha256sum sample.exe && file sample.exe'
why:
  - Alerta del EDR / antivirus sobre un ejecutable.
  - Descarga sospechosa o fichero escrito por Office, un navegador o un script.
  - Adjunto de correo (o un EXE dentro de un ZIP / ISO / IMG).
  - Binario desconocido encontrado en el triage de un endpoint.
  - Ejecución inesperada de un proceso desde una ruta escribible por el usuario.
look_for:
  - Imports sospechosos (inyección de procesos, keylogging, cifrado, red) o muy pocos imports más `LoadLibrary`/`GetProcAddress`.
  - URLs, IPs, dominios, comandos y rutas del registro en los strings.
  - Nombres de sección raros, secciones ejecutables y escribibles, entropía alta (empaquetado).
  - Overlays o recursos que contienen otro PE (`MZ`).
  - Firmantes inválidos, caducados o inesperados; información de versión que imita a un fabricante legítimo.
  - Fecha de compilación que no encaja con la historia (se puede falsificar).
tools_start: [Detect It Easy, PEStudio, FLOSS]
tools_deeper: [capa, Ghidra]
tool_questions:
  - tool: Detect It Easy
    question: ¿Qué es — compilador, packer, .NET, instalador?
  - tool: PEStudio
    question: ¿Qué propiedades son sospechosas (imports, secciones, recursos, firma)?
  - tool: FLOSS
    question: ¿Qué strings contiene, incluidos los ofuscados?
  - tool: capa
    question: ¿Qué podría hacer (capacidades, técnicas ATT&CK candidatas)?
  - tool: VirusTotal
    question: ¿Esta muestra ya es conocida?
  - tool: ANY.RUN
    question: ¿Qué pasa cuando se ejecuta?
  - tool: Hybrid Analysis
    question: ¿Qué comportamiento e indicadores se observan?
correlate:
  - PE en disco (ruta, hash)
  - Creación de proceso — Sysmon `1` / Security `4688`
  - Línea de comandos y proceso padre
  - Conexiones de red — Sysmon `3` / `22`
  - Ficheros escritos — Sysmon `11`
  - Persistencia — claves Run, servicios, tareas programadas
extract:
  - SHA-256 (y MD5 / SHA-1 para consultas antiguas), imphash
  - Nombre de fichero y ruta completa
  - Dominios, URLs e IPs
  - Mutex, named pipes
  - Claves del registro y rutas de ficheros soltados
  - Líneas de comandos que lanza
mistakes:
  - No ejecutes muestras desconocidas en tu estación de trabajo normal — usa una VM aislada o una sandbox.
  - El número de detecciones de VirusTotal no es evidencia suficiente por sí solo; cero detecciones no significa legítimo.
  - Una API o un import sospechoso no implica automáticamente comportamiento malicioso.
  - Subir el fichero (en lugar de buscar el hash) lo hace público.
related_artifacts: [sysmon, windows-event-logs, registry, pcap, memory-dump]
---
