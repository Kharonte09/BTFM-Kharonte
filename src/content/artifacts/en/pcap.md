---
name: Packet Capture (PCAP)
summary: Recorded network traffic. Shows hosts, protocols, payloads and timing — the ground truth for network behaviour.
category: network
aliases: [PCAP, PCAPNG, network capture, DNS, HTTP, TLS]
tags: [network, c2, exfiltration, dns, http, tls, beaconing]
evidence:
  - Communicating hosts, ports, protocols and volumes over time.
  - DNS queries and answers.
  - HTTP requests/responses, user agents and transferred files.
  - TLS metadata — SNI, certificates, client fingerprints.
  - Cleartext credentials and protocol commands.
locations:
  - label: Sources
    path: Network taps / SPAN ports · IDS/NSM sensors · sandbox reports · endpoint captures (pktmon, tcpdump)
questions:
  - Which host contacted which external infrastructure, and when?
  - Is there beaconing (regular, periodic connections)?
  - Was a payload downloaded? Can it be extracted?
  - Was data exfiltrated (volume, destination, protocol)?
  - Does the traffic confirm or refute an IDS alert?
tools: [Wireshark, tshark, Zeek, Suricata, NetworkMiner, CyberChef]
look_for:
  - Periodic connections with similar sizes (beaconing).
  - DNS — long or high-entropy subdomains, many NXDOMAINs, TXT queries, newly seen domains.
  - HTTP — POSTs to raw IPs, executable downloads, rare user agents, Base64 in URIs or bodies.
  - TLS — self-signed or recently issued certificates, SNI that does not match the certificate, unusual client fingerprints.
  - Large outbound transfers, especially to cloud storage or uncommon ports.
limitations:
  - Encrypted traffic hides payloads; you get metadata only.
  - Full captures are expensive to store — coverage is often partial in time or scope.
  - Captures from the wrong network segment can miss east-west traffic.
related_artifacts: [ip-domain, memory-dump, sysmon]
---

A PCAP/PCAPNG file stores raw frames with timestamps. Start with **summaries** (conversations, protocol hierarchy, Zeek logs) before reading individual packets — on large captures this saves hours.

Treat exported files and payloads as live malware.
