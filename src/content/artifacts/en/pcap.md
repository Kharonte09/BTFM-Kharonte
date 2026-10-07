---
name: Packet Capture (PCAP)
summary: Recorded network traffic. Start from statistics, not packets — find the hosts, the protocols and the odd conversations, then read the streams that matter.
category: network
coverage: intermediate
aliases: [PCAP, PCAPNG, network capture, DNS, HTTP, TLS, Captura de tráfico, Network traffic]
tags: [network, wireshark, c2, exfiltration, dns, http, tls]
start_here:
  - Check the capture's time span and size (**Statistics → Capture File Properties**).
  - '**Statistics → Protocol Hierarchy** — which protocols are present.'
  - '**Statistics → Conversations / Endpoints** — top talkers and the host of interest.'
  - Filter DNS queries and HTTP requests from that host.
  - '**Follow → TCP / HTTP Stream** on the suspicious sessions; **Export Objects** for transferred files.'
start_commands:
  - label: DNS queries
    command: 'dns.flags.response == 0'
  - label: HTTP requests
    command: 'http.request'
  - label: TLS Client Hello (SNI)
    command: 'tls.handshake.type == 1'
  - label: Conversation statistics (tshark)
    command: 'tshark -r capture.pcap -q -z conv,ip'
why:
  - IDS / NDR alert to confirm or discard.
  - Sandbox run of a sample — what did it contact?
  - Suspected C2, beaconing or exfiltration.
  - Lab or challenge with a capture to explain.
questions:
  - Which internal host is involved (IP, MAC, hostname, user)?
  - Which domain or IP did it contact first, and which looks like C2?
  - Was a file downloaded? Which one?
  - Were credentials sent in cleartext?
  - Did data leave the network?
look_for:
  - Periodic connections of similar size (beaconing).
  - DNS — random-looking or look-alike domains, long subdomains, many NXDOMAIN, TXT queries.
  - HTTP — POSTs to raw IPs, executable downloads, rare user agents, Base64 in URIs.
  - TLS — self-signed or fresh certificates, SNI that doesn't match the certificate.
  - Large outbound transfers; cleartext FTP / HTTP / SMTP authentication.
  - 'Host identification — `dhcp` (hostname), `nbns`, `kerberos.CNameString` (user).'
tools_start: [Wireshark]
tools_deeper: [Zeek, NetworkMiner]
tool_questions:
  - tool: Wireshark
    question: What happened, packet by packet and stream by stream?
  - tool: Zeek
    question: Summary logs (conn, dns, http, ssl) for large captures.
  - tool: NetworkMiner
    question: Which files, hosts and credentials can be extracted quickly?
correlate:
  - Suspicious conversation (IP, port, time)
  - Domain → DNS query and answer
  - Host → process on the endpoint (Sysmon `3` / `22`, EDR)
  - Exported file → hash → PE / document analysis
  - Same IOC on other hosts (proxy, firewall logs)
extract:
  - Internal host IP, MAC, hostname, user
  - Malicious domains, IPs, URLs, ports
  - Hashes of exported files
  - User agents, certificates, JA3/JA4 if available
  - Times of first contact and of exfiltration
mistakes:
  - Exported objects can be live malware — export them only into an isolated folder / VM.
  - Encrypted traffic hides payloads — work with metadata (SNI, certificates, timing, sizes).
  - Display filters and capture filters (BPF) use different syntax.
  - Set the time format to UTC before writing your timeline.
related_artifacts: [ip-domain, sysmon, pe-executables, memory-dump]
---
