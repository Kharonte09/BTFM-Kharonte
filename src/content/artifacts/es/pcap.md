---
name: Captura de tráfico (PCAP)
summary: Tráfico de red grabado. Empieza por las estadísticas, no por los paquetes — encuentra los equipos, los protocolos y las conversaciones raras, y luego lee los streams que importan.
category: network
coverage: intermediate
aliases: [Packet Capture (PCAP), PCAP, PCAPNG, network capture, DNS, HTTP, TLS, Captura de red, Network traffic]
tags: [red, wireshark, c2, exfiltración, dns, http, tls]
start_here:
  - Mira el rango temporal y el tamaño de la captura (**Statistics → Capture File Properties**).
  - '**Statistics → Protocol Hierarchy** — qué protocolos hay.'
  - '**Statistics → Conversations / Endpoints** — quién habla más y el equipo de interés.'
  - Filtra las consultas DNS y las peticiones HTTP de ese equipo.
  - '**Follow → TCP / HTTP Stream** en las sesiones sospechosas; **Export Objects** para los ficheros transferidos.'
start_commands:
  - label: Consultas DNS
    command: 'dns.flags.response == 0'
  - label: Peticiones HTTP
    command: 'http.request'
  - label: TLS Client Hello (SNI)
    command: 'tls.handshake.type == 1'
  - label: Estadísticas de conversaciones (tshark)
    command: 'tshark -r capture.pcap -q -z conv,ip'
why:
  - Alerta del IDS / NDR que confirmar o descartar.
  - Ejecución de una muestra en sandbox — ¿con qué contactó?
  - Sospecha de C2, beaconing o exfiltración.
  - Laboratorio o reto con una captura que explicar.
questions:
  - ¿Qué equipo interno está implicado (IP, MAC, hostname, usuario)?
  - ¿Qué dominio o IP contactó primero y cuál parece el C2?
  - ¿Se descargó un fichero? ¿Cuál?
  - ¿Se enviaron credenciales en claro?
  - ¿Salieron datos de la red?
look_for:
  - Conexiones periódicas de tamaño similar (beaconing).
  - DNS — dominios aleatorios o parecidos a otros legítimos, subdominios largos, muchos NXDOMAIN, consultas TXT.
  - HTTP — POST a IPs directas, descargas de ejecutables, user agents raros, Base64 en URIs.
  - TLS — certificados autofirmados o recientes, SNI que no coincide con el certificado.
  - Transferencias salientes grandes; autenticación FTP / HTTP / SMTP en claro.
  - 'Identificar el equipo — `dhcp` (hostname), `nbns`, `kerberos.CNameString` (usuario).'
tools_start: [Wireshark]
tools_deeper: [Zeek, NetworkMiner]
tool_questions:
  - tool: Wireshark
    question: ¿Qué pasó, paquete a paquete y stream a stream?
  - tool: Zeek
    question: Logs resumen (conn, dns, http, ssl) para capturas grandes.
  - tool: NetworkMiner
    question: ¿Qué ficheros, equipos y credenciales se pueden extraer rápido?
correlate:
  - Conversación sospechosa (IP, puerto, hora)
  - Dominio → consulta y respuesta DNS
  - Equipo → proceso en el endpoint (Sysmon `3` / `22`, EDR)
  - Fichero exportado → hash → análisis de PE / documento
  - Mismo IOC en otros equipos (logs de proxy, firewall)
extract:
  - IP, MAC, hostname y usuario del equipo interno
  - Dominios, IPs, URLs y puertos maliciosos
  - Hashes de los ficheros exportados
  - User agents, certificados, JA3/JA4 si están disponibles
  - Horas del primer contacto y de la exfiltración
mistakes:
  - Los objetos exportados pueden ser malware activo — expórtalos solo a una carpeta / VM aislada.
  - El tráfico cifrado oculta los payloads — trabaja con metadatos (SNI, certificados, tiempos, tamaños).
  - Los display filters y los capture filters (BPF) usan sintaxis distintas.
  - Pon el formato de hora en UTC antes de escribir tu timeline.
related_artifacts: [ip-domain, sysmon, pe-executables, memory-dump]
---
