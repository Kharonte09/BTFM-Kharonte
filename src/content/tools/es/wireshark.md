---
name: Wireshark
summary: Analizador de protocolos de red para inspeccionar capturas de tráfico de forma interactiva. Incluye tshark para línea de comandos.
category: network
type: Análisis de paquetes
platforms: [Windows, Linux, macOS]
license: Código abierto (GPL-2.0)
homepage: https://www.wireshark.org/
coverage: intermediate
aliases: [tshark]
tags: [pcap, red, dns, http, tls, c2]
use_when:
  - Tienes un PCAP/PCAPNG y necesitas entender quién habló con quién y cómo.
  - Necesitas reconstruir una sesión (petición HTTP, fichero descargado, transferencia SMB).
  - Quieres validar un IOC de red o una alerta del IDS a nivel de paquete.
look_for:
  - Los que más hablan y conexiones largas o periódicas (**Statistics → Conversations**).
  - Consultas DNS a dominios inusuales o recién vistos; subdominios con entropía alta.
  - Peticiones HTTP con user agents raros, POST a IPs directas, descargas de ejecutables.
  - Valores SNI de TLS y certificados (autofirmados, nombres que no coinciden).
  - Credenciales en claro (FTP, HTTP basic, SMTP AUTH).
examples:
  - label: Filtro de visualización — peticiones HTTP y consultas DNS
    command: 'http.request || dns.flags.response == 0'
  - label: Filtro de visualización — TLS Client Hello con SNI
    command: 'tls.handshake.type == 1'
  - label: tshark — listar consultas DNS como campos
    command: 'tshark -r capture.pcap -Y "dns.flags.response == 0" -T fields -e frame.time -e ip.src -e dns.qry.name'
  - label: tshark — estadísticas de conversaciones IP
    command: 'tshark -r capture.pcap -q -z conv,ip'
  - label: tshark — exportar objetos HTTP
    command: 'tshark -r capture.pcap --export-objects http,./http_objects'
outputs:
  - Paquetes diseccionados con los campos de cada protocolo.
  - Estadísticas (conversaciones, endpoints, jerarquía de protocolos, gráficas de E/S).
  - Streams reensamblados y objetos exportados (HTTP, SMB, TFTP, IMF…).
mistakes:
  - 'Los **filtros de visualización** (`ip.addr == 10.0.0.5`) y los **filtros de captura** (BPF, `host 10.0.0.5`) usan sintaxis distintas.'
  - Los objetos exportados pueden ser malware activo. Expórtalos solo en un entorno de análisis aislado.
  - Las capturas grandes se trocean más rápido con `tshark`/`editcap`, o se resumen antes con Zeek.
  - El tráfico TLS cifrado no se puede leer sin claves; céntrate en los metadatos (SNI, certificados, tiempos, tamaños).
complements: [Zeek, NetworkMiner, Suricata, CyberChef]
related_artifacts: [pcap, ip-domain]
---
