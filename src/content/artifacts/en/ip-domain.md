---
name: IP Addresses & Domains
summary: Network indicators found in logs, alerts, emails or samples. Need context and enrichment before they become actionable IOCs.
category: network
aliases: [IP, Domain, Suspicious IP, Suspicious domain, URL]
tags: [iocs, enrichment, threat intelligence, infrastructure, c2]
evidence:
  - Where in your environment the indicator appears (which hosts, users, times).
  - Ownership and hosting context — ASN, provider, geolocation (approximate).
  - Domain registration and DNS history.
  - Reputation and relations to known malware or campaigns.
locations:
  - label: Internal sources
    path: Firewall / proxy / DNS logs · EDR telemetry · Sysmon 3 and 22 · mail gateway logs
  - label: Samples & documents
    path: Strings, configs, sandbox reports, email bodies and headers
questions:
  - Which internal hosts communicated with this indicator, and when first?
  - Is it shared infrastructure (CDN, cloud, hosting) or dedicated?
  - Is it known malicious, and for what?
  - What else is hosted on it or related to it?
tools: [VirusTotal, Wireshark, Zeek, CyberChef]
look_for:
  - First and last seen in **your** logs — that defines the scope window.
  - Recently registered domains and look-alike names.
  - Cloud and CDN addresses — blocking the IP may break legitimate services; prefer domain/URL indicators.
  - Domains resolving to many IPs quickly (fast flux) or IPs hosting many unrelated domains.
limitations:
  - IPs change hands; reputation is time-sensitive. Record the date of every lookup.
  - Geolocation is approximate and not attribution.
  - Lookups on third-party services may be visible to others — avoid querying sensitive internal names.
related_artifacts: [pcap, eml, sysmon]
review: true
---

An IP or domain is only an indicator once it has **context**: where you saw it, what it is, and why it matters. Enrich it, scope it in your own telemetry, and only then block or report it.

Defang indicators in reports (`hxxps://evil[.]example`) so they cannot be clicked accidentally.
