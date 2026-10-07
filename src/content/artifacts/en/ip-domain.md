---
name: IPs, Domains & URLs
summary: Indicators, not evidence sources. An IP or domain only becomes an IOC once you know where you saw it, what it is and which hosts touched it.
category: indicators
coverage: intermediate
aliases: [IP Addresses & Domains, IP, Domain, URL, Suspicious IP, Suspicious domain, IOC, Direcciones IP y dominios]
tags: [iocs, enrichment, threat intelligence, infrastructure, c2]
start_here:
  - Note where you saw it and when (alert, email, sample, log).
  - Defang it before sharing (`hxxps://evil[.]example`).
  - Look up reputation — passively.
  - Search **your own** logs (proxy, DNS, firewall, EDR) for every host that contacted it.
  - Decide — block, monitor, or discard — and record why.
why:
  - Indicator from an alert, a phishing email or a sample.
  - Threat intel report or a request to check an IP.
  - Unknown destination in proxy / firewall logs.
questions:
  - Which internal hosts contacted it — first and last time?
  - Is it shared infrastructure (CDN, cloud) or dedicated?
  - Is it known malicious, and for what?
look_for:
  - First and last seen in **your** telemetry — that sets the scope window.
  - Recently registered domains and look-alike names.
  - Cloud / CDN addresses — blocking the IP may break legitimate services.
  - Other domains on the same IP; other IPs for the same domain.
tools_start: [VirusTotal, CyberChef]
tools_deeper: [Wireshark]
tool_questions:
  - tool: VirusTotal
    question: Is it known, and what is it related to (files, domains, URLs)?
  - tool: CyberChef
    question: Extract and defang indicators from text for a report.
correlate:
  - Indicator (IP / domain / URL)
  - Proxy, DNS and firewall logs — which hosts, when
  - Endpoint — which process made the connection (Sysmon `3` / `22`)
  - Related samples or emails
extract:
  - The indicator, defanged, with first / last seen
  - Hosts and users that contacted it
  - Related hashes, URLs and domains
mistakes:
  - Reputation ages — IPs change hands; record the date of every lookup.
  - Geolocation is approximate and is not attribution.
  - Don't look up sensitive internal names on third-party services.
  - A clean reputation does not make an indicator safe.
related_artifacts: [pcap, eml, sysmon]
---
