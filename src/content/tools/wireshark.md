---
name: Wireshark
summary: Network protocol analyser for interactive inspection of packet captures. Includes the command-line tshark.
category: network
type: Packet analysis
platforms: [Windows, Linux, macOS]
license: Open source (GPL-2.0)
homepage: https://www.wireshark.org/
difficulty: intermediate
aliases: [tshark]
tags: [pcap, network, dns, http, tls, c2]
use_when:
  - You have a PCAP/PCAPNG and need to understand who talked to whom and how.
  - You need to reconstruct a session (HTTP request, downloaded file, SMB transfer).
  - You want to validate a network IOC or an IDS alert at packet level.
look_for:
  - Top talkers and long-lived or periodic connections (**Statistics → Conversations**).
  - DNS queries to unusual or newly seen domains; high-entropy subdomains.
  - HTTP requests with odd user agents, POSTs to raw IPs, downloads of executables.
  - TLS SNI values and certificates (self-signed, mismatched names).
  - Cleartext credentials (FTP, HTTP basic, SMTP AUTH).
workflow:
  - Protocol Hierarchy / Conversations
  - Filter (`dns`, `http.request`, `tls.handshake`)
  - Follow stream
  - Export objects
  - Extract IOCs
examples:
  - label: Display filter — HTTP requests and DNS queries
    command: 'http.request || dns.flags.response == 0'
  - label: Display filter — TLS Client Hello with SNI
    command: 'tls.handshake.type == 1'
  - label: tshark — list DNS queries as fields
    command: 'tshark -r capture.pcap -Y "dns.flags.response == 0" -T fields -e frame.time -e ip.src -e dns.qry.name'
  - label: tshark — IP conversation statistics
    command: 'tshark -r capture.pcap -q -z conv,ip'
  - label: tshark — export HTTP objects
    command: 'tshark -r capture.pcap --export-objects http,./http_objects'
outputs:
  - Dissected packets with protocol fields.
  - Statistics (conversations, endpoints, protocol hierarchy, I/O graphs).
  - Reassembled streams and exported objects (HTTP, SMB, TFTP, IMF…).
notes:
  - '**Display filters** (`ip.addr == 10.0.0.5`) and **capture filters** (BPF, `host 10.0.0.5`) use different syntax.'
  - Exported objects may be live malware. Export into an isolated analysis environment only.
  - Large captures are faster to slice with `tshark`/`editcap` or to summarise with Zeek first.
  - Encrypted TLS payloads cannot be read without keys; focus on metadata (SNI, certs, timing, sizes).
complements: [Zeek, NetworkMiner, Suricata, CyberChef]
related_artifacts: [pcap, ip-domain]
---

Wireshark is the reference GUI for packet analysis. Its dissectors decode thousands of protocols, and the same engine is available on the command line as **tshark**, which is ideal for scripting and for extracting fields from large captures.
