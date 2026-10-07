---
name: Ejecutables PE (EXE / DLL)
summary: Ficheros Portable Executable de Windows — EXE, DLL, SYS y ensamblados .NET. La forma más habitual de payload de malware en Windows.
category: binaries
aliases: [PE Executables (EXE / DLL), EXE, DLL, PE, .NET assemblies, Portable Executable, Suspicious EXE, Ejecutable]
tags: [malware, análisis estático, hashes, imports, packers, .net]
evidence:
  - Hashes (MD5, SHA-1, SHA-256) e imphash para reputación y pivotaje.
  - Fecha de compilación, información de linker y compilador, Rich header.
  - Imports y exports — pistas de capacidades.
  - Secciones, entropía, recursos y overlay — pistas de empaquetado o payloads embebidos.
  - Firma Authenticode e información de versión.
  - Strings — URLs, rutas, comandos, mutex.
locations:
  - label: Ubicaciones habituales de drop
    path: '%TEMP% · %APPDATA% · %LOCALAPPDATA% · C:\ProgramData · C:\Users\Public · Downloads'
  - label: Evidencia de presencia pasada
    path: Amcache · Shimcache · Prefetch · $MFT
questions:
  - ¿Es conocido este fichero (malicioso o legítimo)?
  - ¿Está empaquetado, es .NET, es un instalador o está firmado?
  - ¿Qué puede hacer (red, persistencia, inyección, cifrado)?
  - ¿Qué IOCs puedo extraer para acotar el incidente?
  - ¿Necesita análisis dinámico o reversing?
tools: [Detect It Easy, PEStudio, FLOSS, capa, YARA, VirusTotal, Ghidra]
look_for:
  - Fecha de compilación que no encaja con la historia (en el futuro, o de hace décadas — puede falsificarse).
  - Pocos imports más `LoadLibrary`/`GetProcAddress` → resolución dinámica o empaquetado.
  - Secciones con entropía alta, nombres de sección raros, secciones ejecutables y escribibles.
  - Firmantes inválidos, caducados o inesperados; información de versión que imita a un fabricante legítimo.
  - Overlays y recursos que contienen cabeceras PE (`MZ`).
  - Ensamblados .NET — descompílalos con ILSpy / dnSpyEx en lugar de desensamblar.
limitations:
  - El análisis estático no ve lo que hace una muestra empaquetada o una etapa descargada — escala a sandbox o reversing.
  - Las fechas de compilación y la información de versión se falsifican trivialmente.
  - Una firma válida puede venir de un certificado robado o abusado.
related_artifacts: [amcache, prefetch, memory-dump]
---

Windows usa el formato Portable Executable (PE) para ejecutables, DLL y drivers. La cabecera describe secciones, imports, exports, recursos y el punto de entrada, y cada uno de ellos puede revelar cómo se construyó el fichero y qué pretende hacer.

En los ensamblados .NET el PE contiene una cabecera CLR y código IL; descompiladores como **ILSpy** o **dnSpyEx** (el fork mantenido del archivado dnSpy) recuperan un código muy cercano al fuente.
