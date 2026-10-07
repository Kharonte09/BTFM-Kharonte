---
name: Email Message (EML / MSG)
summary: A raw email with full headers, body parts and attachments. The starting point of any phishing investigation.
category: phishing
aliases: [EML, MSG, Email, Email headers, Phishing email]
tags: [phishing, headers, spf, dkim, dmarc, attachments, urls, initial access]
evidence:
  - Delivery path — `Received` headers added by each mail server.
  - Sender identity claims — `From`, `Reply-To`, `Return-Path`, `Sender`.
  - Authentication results — SPF, DKIM, DMARC (and ARC for forwarded mail).
  - Message identifiers — `Message-ID`, `Date`, mailer/user-agent headers.
  - Body (text/HTML) with links, and MIME-encoded attachments.
locations:
  - label: Export from client
    path: Outlook "Save as" (.msg) · Thunderbird / webmail "Show original" / "Download message" (.eml)
  - label: Mail platform
    path: Message trace / quarantine export in the mail gateway or cloud mail admin portal
questions:
  - Who really sent this, and from which infrastructure?
  - Did SPF / DKIM / DMARC pass, and for which domain?
  - Is `Reply-To` different from `From` (BEC indicator)?
  - Which URLs and attachments does it contain, and where do they lead?
  - Who else in the organisation received it?
tools: [CyberChef, VirusTotal, emldump.py, olevba, Wireshark]
look_for:
  - Display name impersonating an internal person while the address is external.
  - Look-alike domains (typosquatting, homoglyphs, extra subdomains).
  - '`Authentication-Results` with `spf=fail`, `dkim=fail`, `dmarc=fail` — or passing for an unexpected domain.'
  - '`Reply-To` / `Return-Path` mismatched with `From`.'
  - Links whose visible text differs from the real `href`; URL shorteners and redirectors.
  - Attachments — archives (ZIP/ISO/IMG), HTML smuggling files, LNK, OneNote, macro documents, PDF with links.
  - The **first** external `Received` hop (read the chain bottom-up).
limitations:
  - Headers below your own mail servers can be forged; trust only those added by infrastructure you control.
  - A forwarded message loses the original headers — always request the original as an attachment (.eml/.msg).
  - SPF/DKIM pass proves the domain authorised the server, not that the sender is benign.
related_artifacts: [office-documents, pdf, lnk, ip-domain]
---

An `.eml` file is the raw RFC 5322 message: headers followed by MIME body parts. Outlook's `.msg` is an OLE compound file containing the same information in a different container; convert it or open it with a parser before analysis.

**Never open the attachment or click links** on an analyst workstation. Extract them, hash them and analyse them in an isolated environment.
