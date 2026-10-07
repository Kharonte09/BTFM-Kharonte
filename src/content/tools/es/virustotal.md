---
name: VirusTotal
summary: Servicio online de análisis multimotor e inteligencia de amenazas para ficheros, URLs, dominios y direcciones IP.
category: malware-analysis
type: Reputación / inteligencia de amenazas
platforms: [Web]
license: Interfaz web pública gratuita; los servicios premium son comerciales
homepage: https://www.virustotal.com/
difficulty: basic
aliases: [VT]
tags: [reputación, búsqueda de hash, inteligencia de amenazas, iocs, opsec]
use_when:
  - Tienes un hash, URL, dominio o IP y quieres contexto de reputación rápido.
  - Quieres ver si una muestra ya es conocida y cómo la etiquetan los fabricantes.
  - Quieres relaciones — dominios contactados, ficheros soltados, ficheros padre, muestras que comunican.
look_for:
  - Fecha de primer envío — un «first seen» muy anterior a tu incidente sugiere malware commodity.
  - Nombres de detección (para intuir la familia) — fíate del consenso, no de un solo motor.
  - Pestañas de comportamiento/sandbox para IOCs de red y de sistema de ficheros.
  - Grafo de relaciones para infraestructura y muestras relacionadas.
workflow:
  - Busca primero el **hash**
  - Revisa detecciones y first seen
  - Revisa comportamiento / relaciones
  - Extrae IOCs
  - Sube el fichero solo si la política lo permite
outputs:
  - Resultado de detección por motor y recuento de consenso.
  - Metadatos del fichero, firmas y, cuando existen, informes de comportamiento en sandbox.
  - Relaciones entre ficheros, URLs, dominios e IPs.
notes:
  - '**OPSEC:** los ficheros subidos a VirusTotal se comparten con la comunidad de seguridad y los usuarios premium pueden descargarlos. Nunca subas documentos con datos confidenciales o personales, y ten en cuenta que el atacante puede vigilar los envíos de sus muestras.'
  - Cero detecciones no significa legítimo — las muestras nuevas o dirigidas a menudo no se detectan.
  - Los nombres de detección dependen de cada fabricante y suelen ser genéricos; no los trates como atribución.
complements: [Hybrid Analysis, ANY.RUN, YARA, PEStudio]
related_artifacts: [pe-executables, ip-domain]
---

VirusTotal (propiedad de Google) agrega motores antivirus, listas de bloqueo de URLs/dominios, sandboxes y comentarios de la comunidad. En el triaje es sobre todo un servicio de **consulta**: buscar un hash es pasivo, mientras que subir un fichero lo hace público.
