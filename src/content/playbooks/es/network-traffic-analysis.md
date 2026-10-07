---
name: Análisis de tráfico de red (PCAP)
summary: Recorrer una captura de tráfico de la visión general a los IOCs — equipos, protocolos, DNS, HTTP, TLS, ficheros transferidos, credenciales, C2 y exfiltración.
order: 2
scenario: Una captura .pcap / .pcapng
icon: network
trigger: Tienes un `.pcap` / `.pcapng` — de un sensor, una sandbox, una captura en el endpoint o un reto de laboratorio — y necesitas explicar qué pasó en la red.
tags: [pcap, wireshark, tshark, red, c2, exfiltración, btlo]
questions:
  - ¿Cuál es la IP, la MAC, el hostname y el usuario del equipo infectado / sospechoso?
  - ¿A qué hora empieza la actividad sospechosa (UTC)?
  - ¿Qué dominio o IP se contactó primero y cuál es el C2?
  - ¿Qué fichero se descargó (nombre, URL, SHA-256) y de qué tipo es realmente?
  - ¿Se enviaron credenciales en claro? ¿Con qué protocolo, usuario y contraseña?
  - ¿Hay beaconing? ¿Con qué intervalo, puerto y protocolo?
  - ¿Se exfiltraron datos? ¿Adónde, cuántos y por qué protocolo?
  - ¿Qué user agent, JA3/JA4 o certificado identifica el tráfico malicioso?
steps:
  - title: Visión general
    goal: Conocer el tamaño, el rango temporal y la forma de la captura antes de filtrar.
    actions:
      - '**Statistics → Capture File Properties** (o `capinfos capture.pcap`) — hora del primer/último paquete, duración, número de paquetes.'
      - '**Statistics → Protocol Hierarchy** — qué protocolos hay y en qué proporción.'
      - Pon **View → Time Display Format → UTC Date and Time of Day** para que las horas coincidan con tus notas.
    tools: [Wireshark]
    artifacts: [pcap]
  - title: Hosts
    goal: Identificar los endpoints internos y externos y el equipo de interés.
    actions:
      - '**Statistics → Endpoints / Conversations (IPv4, TCP, UDP)** — ordena por bytes y paquetes.'
      - 'Identifica el equipo interno — `dhcp` (`dhcp.option.hostname`), `nbns`, `kerberos.CNameString` para el usuario, `eth.addr` para la MAC.'
      - Lista las IPs externas que contactó el equipo de interés.
    tools: [Wireshark]
  - title: DNS
    goal: Ver qué nombres resolvió el equipo y cuándo.
    actions:
      - 'Filtra `dns.flags.response == 0` y lista `dns.qry.name` (tshark `-T fields`).'
      - Busca dominios recién vistos, aleatorios o parecidos a otros legítimos, subdominios largos y consultas TXT.
      - Anota las IPs de respuesta — conectan los nombres con las conversaciones IP.
    tools: [Wireshark, tshark]
    artifacts: [ip-domain]
  - title: HTTP
    goal: Reconstruir peticiones web, descargas y subidas.
    actions:
      - 'Filtra `http.request` — revisa `http.host`, `http.request.uri`, `http.user_agent`; **Statistics → HTTP → Requests**.'
      - '**Follow → HTTP / TCP Stream** en las peticiones sospechosas para leer headers y cuerpos.'
      - 'POST a IPs directas, Base64 en URIs o cuerpos, descargas de `.exe`, `.dll`, `.ps1`, `.hta`, archivos comprimidos.'
    tools: [Wireshark]
  - title: TLS
    goal: Caracterizar el tráfico cifrado por sus metadatos.
    actions:
      - 'Filtra `tls.handshake.type == 1` y lista `tls.handshake.extensions_server_name` (SNI).'
      - Revisa los certificados del servidor (emisor, sujeto, validez) — certificados autofirmados o recién emitidos en dominios raros son sospechosos.
      - Anota los fingerprints de cliente (JA3/JA4) si tu herramienta los calcula.
    tools: [Wireshark, Zeek]
  - title: Ficheros
    goal: Recuperar los ficheros transferidos y triarlos de forma segura.
    actions:
      - '**File → Export Objects → HTTP / SMB / TFTP / IMF / FTP-DATA** a una carpeta aislada.'
      - Calcula el hash de cada fichero exportado y comprueba su tipo real; pasa los sospechosos al playbook Malware Triage.
    tools: [Wireshark, NetworkMiner, VirusTotal]
    escalate: Ejecutables o documentos con macros exportados → playbooks Malware Triage / Documento Office malicioso.
  - title: Credenciales
    goal: Detectar autenticación en claro.
    actions:
      - '`ftp.request.command == "USER" || ftp.request.command == "PASS"`, `http.authorization`, AUTH de `smtp`, `pop`, `imap`, `telnet`.'
      - '`ntlmssp` y `kerberos` revelan nombres de usuario y dominio aunque no se vean contraseñas.'
    tools: [Wireshark]
  - title: C2 y beaconing
    goal: Confirmar comportamiento de command-and-control.
    actions:
      - Conversaciones con muchas conexiones de tamaño similar a intervalos regulares; **Statistics → I/O Graphs** filtrado por la IP sospechosa.
      - Sesiones largas a puertos poco comunes; URIs o user agents idénticos repetidos.
    tools: [Wireshark, Zeek]
  - title: Exfiltración
    goal: Determinar si salieron datos de la red.
    actions:
      - Ordena las conversaciones por bytes **enviados** desde el equipo interno; mira subidas grandes, FTP STOR, HTTP POST, almacenamiento cloud.
      - DNS tunneling — subdominios muy largos y con entropía alta o muchas consultas TXT a un mismo dominio.
  - title: Timeline e IOCs
    goal: Convertir los hallazgos en una historia defendible.
    actions:
      - 'Ordena los paquetes clave por tiempo (los números de frame son buenas referencias: `frame.number == 1234`).'
      - Exporta solo los paquetes relevantes (**File → Export Specified Packets**) para el caso.
      - Haz defang y lista los IOCs con su primera aparición.
iocs:
  - IP, MAC, hostname y usuario del equipo infectado.
  - Dominios, IPs, URLs y puertos maliciosos.
  - Hashes de los ficheros exportados.
  - User agents, certificados, fingerprints JA3/JA4.
  - Destino y volumen de la exfiltración.
escalate_when:
  - Se descargó y ejecutó un payload en un endpoint.
  - Se expusieron o reutilizaron credenciales.
  - La exfiltración de datos está confirmada o es probable.
  - Varios equipos internos muestran el mismo patrón de C2.
related_playbooks: [malware-triage, windows-endpoint-investigation, phishing-investigation]
---

Empieza por las **estadísticas, no por los paquetes**. Protocol Hierarchy, Endpoints y Conversations te dicen dónde mirar; los display filters y Follow Stream te dicen qué pasó. Consulta la cheatsheet **Wireshark Display Filters** para tener los filtros a mano.

Trata todo lo que exportes de una captura como malware activo.
