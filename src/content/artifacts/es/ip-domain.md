---
name: IPs, dominios y URLs
summary: Indicadores, no fuentes de evidencia. Una IP o un dominio solo se convierte en IOC cuando sabes dónde lo viste, qué es y qué equipos lo tocaron.
category: indicators
coverage: intermediate
aliases: [IP Addresses & Domains, IPs, Domains & URLs, IP, Domain, URL, Suspicious IP, Suspicious domain, IOC, Direcciones IP y dominios]
tags: [iocs, enriquecimiento, threat intelligence, infraestructura, c2]
start_here:
  - Anota dónde lo viste y cuándo (alerta, correo, muestra, log).
  - Haz defang antes de compartirlo (`hxxps://evil[.]example`).
  - Consulta su reputación — de forma pasiva.
  - Busca en **tus** logs (proxy, DNS, firewall, EDR) todos los equipos que lo contactaron.
  - Decide — bloquear, vigilar o descartar — y deja escrito por qué.
why:
  - Indicador de una alerta, un correo de phishing o una muestra.
  - Informe de threat intel o una petición para revisar una IP.
  - Destino desconocido en los logs del proxy / firewall.
questions:
  - ¿Qué equipos internos lo contactaron — primera y última vez?
  - ¿Es infraestructura compartida (CDN, cloud) o dedicada?
  - ¿Se conoce como malicioso, y por qué?
look_for:
  - Primera y última aparición en **tu** telemetría — eso fija la ventana del alcance.
  - Dominios registrados recientemente y nombres parecidos a otros legítimos.
  - Direcciones de cloud / CDN — bloquear la IP puede romper servicios legítimos.
  - Otros dominios en la misma IP; otras IPs para el mismo dominio.
tools_start: [VirusTotal, CyberChef]
tools_deeper: [Wireshark]
tool_questions:
  - tool: VirusTotal
    question: ¿Se conoce, y con qué está relacionado (ficheros, dominios, URLs)?
  - tool: CyberChef
    question: Extraer indicadores de un texto y hacer defang para un informe.
correlate:
  - Indicador (IP / dominio / URL)
  - Logs de proxy, DNS y firewall — qué equipos y cuándo
  - Endpoint — qué proceso hizo la conexión (Sysmon `3` / `22`)
  - Muestras o correos relacionados
extract:
  - El indicador, con defang, con primera / última aparición
  - Equipos y usuarios que lo contactaron
  - Hashes, URLs y dominios relacionados
mistakes:
  - La reputación caduca — las IPs cambian de manos; anota la fecha de cada consulta.
  - La geolocalización es aproximada y no es atribución.
  - No consultes nombres internos sensibles en servicios de terceros.
  - Una reputación limpia no hace que un indicador sea seguro.
related_artifacts: [pcap, eml, sysmon]
---
