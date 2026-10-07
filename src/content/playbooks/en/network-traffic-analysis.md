---
name: Network Traffic Analysis (PCAP)
summary: Work through a packet capture from overview to IOCs — hosts, protocols, DNS, HTTP, TLS, transferred files, credentials, C2 and exfiltration.
order: 2
scenario: A .pcap / .pcapng capture
icon: network
trigger: You have a `.pcap` / `.pcapng` — from a sensor, a sandbox, an endpoint capture or a lab challenge — and need to explain what happened on the wire.
tags: [pcap, wireshark, tshark, network, c2, exfiltration, btlo]
questions:
  - What is the IP, MAC address, hostname and user of the infected / suspicious host?
  - What time does the suspicious activity start (UTC)?
  - Which domain or IP was contacted first, and which one is the C2?
  - Which file was downloaded (name, URL, SHA-256), and what type is it really?
  - Were credentials sent in cleartext? Which protocol, user and password?
  - Is there beaconing? Which interval, port and protocol?
  - Was data exfiltrated? To where, how much and over which protocol?
  - Which user agent, JA3/JA4 or certificate identifies the malicious traffic?
steps:
  - title: Overview
    goal: Know the size, time span and shape of the capture before filtering.
    actions:
      - '**Statistics → Capture File Properties** (or `capinfos capture.pcap`) — first/last packet time, duration, packet count.'
      - '**Statistics → Protocol Hierarchy** — which protocols are present and in what proportion.'
      - Set **View → Time Display Format → UTC Date and Time of Day** so timestamps match your notes.
    tools: [Wireshark]
    artifacts: [pcap]
  - title: Hosts
    goal: Identify internal and external endpoints and the host of interest.
    actions:
      - '**Statistics → Endpoints / Conversations (IPv4, TCP, UDP)** — sort by bytes and packets.'
      - 'Identify the internal host — `dhcp` (`dhcp.option.hostname`), `nbns`, `kerberos.CNameString` for the user name, `eth.addr` for the MAC.'
      - List external IPs contacted by the host of interest.
    tools: [Wireshark]
  - title: DNS
    goal: Find which names the host resolved and when.
    actions:
      - 'Filter `dns.flags.response == 0` and list `dns.qry.name` (tshark `-T fields`).'
      - Look for newly seen, random-looking or look-alike domains, long subdomains and TXT queries.
      - Note the answer IPs — they connect names to the IP conversations.
    tools: [Wireshark, tshark]
    artifacts: [ip-domain]
  - title: HTTP
    goal: Reconstruct web requests, downloads and uploads.
    actions:
      - 'Filter `http.request` — review `http.host`, `http.request.uri`, `http.user_agent`; **Statistics → HTTP → Requests**.'
      - '**Follow → HTTP / TCP Stream** on suspicious requests to read headers and bodies.'
      - 'POSTs to raw IPs, Base64 in URIs or bodies, downloads of `.exe`, `.dll`, `.ps1`, `.hta`, archives.'
    tools: [Wireshark]
  - title: TLS
    goal: Characterise encrypted traffic from its metadata.
    actions:
      - 'Filter `tls.handshake.type == 1` and list `tls.handshake.extensions_server_name` (SNI).'
      - Inspect server certificates (issuer, subject, validity) — self-signed or freshly issued certs on odd domains are suspicious.
      - Note client fingerprints (JA3/JA4) if your tooling computes them.
    tools: [Wireshark, Zeek]
  - title: Files
    goal: Recover transferred files and triage them safely.
    actions:
      - '**File → Export Objects → HTTP / SMB / TFTP / IMF / FTP-DATA** into an isolated folder.'
      - Hash every exported file and check the real type; hand suspicious ones to the Malware Triage playbook.
    tools: [Wireshark, NetworkMiner, VirusTotal]
    escalate: Exported executables or documents with macros → Malware Triage / Malicious Office Document playbooks.
  - title: Credentials
    goal: Spot cleartext authentication.
    actions:
      - '`ftp.request.command == "USER" || ftp.request.command == "PASS"`, `http.authorization`, `smtp` AUTH, `pop`, `imap`, `telnet`.'
      - '`ntlmssp` and `kerberos` reveal user and domain names even when passwords are not visible.'
    tools: [Wireshark]
  - title: C2 and beaconing
    goal: Confirm command-and-control behaviour.
    actions:
      - Conversations with many similar-sized connections at regular intervals; **Statistics → I/O Graphs** filtered on the suspect IP.
      - Long-lived sessions to uncommon ports; repeated identical URIs or user agents.
    tools: [Wireshark, Zeek]
  - title: Exfiltration
    goal: Determine whether data left the network.
    actions:
      - Sort conversations by bytes **sent** from the internal host; look at large uploads, FTP STOR, HTTP POST, cloud storage.
      - DNS tunnelling — very long, high-entropy subdomains or high volumes of TXT queries to one domain.
  - title: Timeline and IOCs
    goal: Turn findings into a defensible story.
    actions:
      - 'Order key packets by time (frame numbers make good references: `frame.number == 1234`).'
      - Export the relevant packets only (**File → Export Specified Packets**) for the case file.
      - Defang and list IOCs with first-seen times.
iocs:
  - Infected host IP, MAC, hostname and user.
  - Malicious domains, IPs, URLs and ports.
  - Hashes of exported files.
  - User agents, certificates, JA3/JA4 fingerprints.
  - Exfiltration destination and volume.
escalate_when:
  - A payload was downloaded and executed on an endpoint.
  - Credentials were exposed or reused.
  - Data exfiltration is confirmed or likely.
  - Several internal hosts show the same C2 pattern.
related_playbooks: [malware-triage, windows-endpoint-investigation, phishing-investigation]
---

Start with **statistics, not packets**. Protocol Hierarchy, Endpoints and Conversations tell you where to look; display filters and Follow Stream tell you what happened.

Treat everything you export from a capture as live malware.
