---
name: Captura de tráfico (PCAP)
summary: Tráfico de red grabado. Muestra equipos, protocolos, payloads y tiempos — la verdad de referencia del comportamiento en red.
category: network
aliases: [Packet Capture (PCAP), PCAP, PCAPNG, network capture, DNS, HTTP, TLS, Captura de red]
tags: [red, c2, exfiltración, dns, http, tls, beaconing]
evidence:
  - Equipos que se comunican, puertos, protocolos y volúmenes a lo largo del tiempo.
  - Consultas y respuestas DNS.
  - Peticiones/respuestas HTTP, user agents y ficheros transferidos.
  - Metadatos TLS — SNI, certificados, fingerprints del cliente.
  - Credenciales en claro y comandos de protocolo.
locations:
  - label: Fuentes
    path: Taps de red / puertos SPAN · sensores IDS/NSM · informes de sandbox · capturas en el endpoint (pktmon, tcpdump)
questions:
  - ¿Qué equipo contactó con qué infraestructura externa, y cuándo?
  - ¿Hay beaconing (conexiones regulares y periódicas)?
  - ¿Se descargó un payload? ¿Se puede extraer?
  - ¿Se exfiltraron datos (volumen, destino, protocolo)?
  - ¿Confirma o desmiente el tráfico una alerta del IDS?
tools: [Wireshark, tshark, Zeek, Suricata, NetworkMiner, CyberChef]
look_for:
  - Conexiones periódicas de tamaño similar (beaconing).
  - DNS — subdominios largos o con entropía alta, muchos NXDOMAIN, consultas TXT, dominios recién vistos.
  - HTTP — POST a IPs directas, descargas de ejecutables, user agents raros, Base64 en URIs o cuerpos.
  - TLS — certificados autofirmados o emitidos recientemente, SNI que no coincide con el certificado, fingerprints de cliente inusuales.
  - Transferencias salientes grandes, sobre todo a almacenamiento cloud o puertos poco comunes.
limitations:
  - El tráfico cifrado oculta los payloads; solo tienes metadatos.
  - Las capturas completas son caras de almacenar — la cobertura suele ser parcial en tiempo o alcance.
  - Una captura del segmento equivocado puede no ver el tráfico este-oeste.
related_artifacts: [ip-domain, memory-dump, sysmon]
---

Un fichero PCAP/PCAPNG guarda tramas en bruto con marcas de tiempo. Empieza por los **resúmenes** (conversaciones, jerarquía de protocolos, logs de Zeek) antes de leer paquetes concretos — en capturas grandes ahorra horas.

Trata los ficheros y payloads exportados como malware activo.
