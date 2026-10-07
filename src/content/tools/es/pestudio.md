---
name: PEStudio
summary: Herramienta de análisis estático de ejecutables Windows. Muestra indicadores sospechosos, imports, strings y recursos sin ejecutar la muestra.
category: malware-analysis
type: Análisis estático
platforms: [Windows]
license: Edición gratuita y edición Pro de pago — revisa la licencia para uso comercial
homepage: https://www.winitor.com/
difficulty: basic
aliases: [pestudio]
tags: [análisis estático, pe, imports, strings, triage]
use_when:
  - Triage estático rápido de un EXE o DLL sospechoso.
  - Quieres una vista priorizada de «qué es raro» en un PE antes de profundizar.
  - Necesitas hashes, fecha de compilación, imphash y estado de la firma en un solo sitio.
look_for:
  - Imports marcados como sospechosos (inyección de procesos, keylogging, criptografía, red).
  - Strings con URLs, IPs, rutas del registro, comandos o user agents.
  - Recursos con ejecutables embebidos o entropía alta.
  - Incoherencias entre información de versión, nombre de fichero y firma.
  - Datos de overlay añadidos tras la última sección.
workflow:
  - Hashes y firma
  - Vista de indicadores
  - Imports / strings
  - Recursos / overlay
  - Siguiente — capa · FLOSS · sandbox
outputs:
  - Hashes del fichero (MD5, SHA-1, SHA-256), imphash e información básica de cabeceras.
  - Lista de indicadores ordenada por severidad.
  - Imports, exports, secciones, recursos, strings e información de versión.
  - Informe exportable (el formato depende de la edición).
notes:
  - PEStudio no ejecuta la muestra, pero analiza igualmente las muestras en una VM aislada.
  - Puede consultar el hash en VirusTotal — eso envía el hash a un tercero. Desactívalo si tu caso lo requiere.
  - Los indicadores son heurísticas, no veredictos. Muchos programas legítimos activan alguno.
complements: [Detect It Easy, FLOSS, capa, YARA]
related_artifacts: [pe-executables]
review: true
---

PEStudio (Winitor) analiza ficheros Portable Executable y resalta propiedades que suelen asociarse a software malicioso: imports sospechosos, secciones anómalas, ficheros embebidos, strings sospechosos y más. Es una primera vista estática típica de un binario Windows.
