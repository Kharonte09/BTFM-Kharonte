---
name: Direcciones IP y dominios
summary: Indicadores de red encontrados en registros, alertas, correos o muestras. Necesitan contexto y enriquecimiento antes de convertirse en IOCs accionables.
category: network
aliases: [IP Addresses & Domains, IP, Domain, Suspicious IP, Suspicious domain, URL, Dominio, IP sospechosa]
tags: [iocs, enriquecimiento, inteligencia de amenazas, infraestructura, c2]
evidence:
  - Dónde aparece el indicador en tu entorno (qué equipos, usuarios, momentos).
  - Contexto de propiedad y alojamiento — ASN, proveedor, geolocalización (aproximada).
  - Registro del dominio e historial DNS.
  - Reputación y relación con malware o campañas conocidas.
locations:
  - label: Fuentes internas
    path: Logs de firewall / proxy / DNS · telemetría EDR · Sysmon 3 y 22 · logs de la pasarela de correo
  - label: Muestras y documentos
    path: Cadenas, configuraciones, informes de sandbox, cuerpos y cabeceras de correo
questions:
  - ¿Qué equipos internos se comunicaron con este indicador, y cuándo por primera vez?
  - ¿Es infraestructura compartida (CDN, cloud, hosting) o dedicada?
  - ¿Es conocido como malicioso, y por qué?
  - ¿Qué más está alojado en él o relacionado con él?
tools: [VirusTotal, Wireshark, Zeek, CyberChef]
look_for:
  - Primera y última aparición en **tus** registros — eso define la ventana del alcance.
  - Dominios registrados recientemente y nombres parecidos a otros legítimos.
  - Direcciones de cloud y CDN — bloquear la IP puede romper servicios legítimos; prioriza indicadores de dominio/URL.
  - Dominios que resuelven a muchas IPs rápidamente (fast flux) o IPs que alojan muchos dominios no relacionados.
limitations:
  - Las IPs cambian de manos; la reputación caduca. Anota la fecha de cada consulta.
  - La geolocalización es aproximada y no es atribución.
  - Las consultas a servicios de terceros pueden ser visibles para otros — evita consultar nombres internos sensibles.
related_artifacts: [pcap, eml, sysmon]
review: true
---

Una IP o un dominio solo es un indicador cuando tiene **contexto**: dónde lo viste, qué es y por qué importa. Enriquécelo, delimita su alcance en tu propia telemetría y solo entonces bloquéalo o repórtalo.

Neutraliza (defang) los indicadores en los informes (`hxxps://evil[.]example`) para que no se puedan pulsar por accidente.
