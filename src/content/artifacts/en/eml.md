---
name: Email (EML / MSG)
summary: A raw email with full headers, body and attachments. Find out who really sent it, whether authentication passed, and what the links and attachments do.
category: email
coverage: intermediate
aliases: [Email Message (EML / MSG), EML, MSG, Email, Email headers, Phishing email, Correo, Cabeceras de correo]
tags: [phishing, headers, spf, dkim, dmarc, attachments, urls]
start_here:
  - Get the **original** message as `.eml` / `.msg` — not a forward.
  - Hash it and store it in the case folder. Don't open links or attachments.
  - Read the `Received` headers bottom-up and find the first hop your infrastructure recorded.
  - Check `Authentication-Results` (SPF / DKIM / DMARC) and compare `From`, `Reply-To`, `Return-Path`.
  - Extract URLs and attachments, defang them, look up their reputation.
why:
  - A user reported a suspicious email.
  - Mail gateway alert or a campaign hitting several mailboxes.
  - An incident points to email as initial access.
questions:
  - Who really sent it, and from which infrastructure?
  - Did SPF / DKIM / DMARC pass — and for which domain?
  - Where do the links really go, and what are the attachments?
  - Who else received it, and who clicked?
look_for:
  - Display name of an internal person with an external address.
  - Look-alike domains (typosquatting, homoglyphs, extra subdomains).
  - '`spf=fail`, `dkim=fail`, `dmarc=fail` — or a pass for an unexpected domain.'
  - '`Reply-To` / `Return-Path` different from `From`.'
  - Link text different from the real `href`; shorteners and redirectors.
  - Attachments — archives (ZIP / ISO / IMG), HTML, LNK, Office with macros, PDF with links.
tools_start: [CyberChef, VirusTotal]
tools_deeper: [oletools, pdfid.py, ANY.RUN]
tool_questions:
  - tool: CyberChef
    question: Decode headers / bodies and extract + defang URLs.
  - tool: VirusTotal
    question: Are the URLs, domains or attachment hashes already known?
  - tool: ANY.RUN
    question: What happens when the link or attachment is opened?
correlate:
  - Email (sender, URLs, attachment hash)
  - Message trace — who else received it
  - Proxy / DNS — who clicked
  - Sign-in logs — credentials used after the click?
  - Endpoint — did the attachment execute?
extract:
  - Sender address, envelope sender and domain
  - Sending IP from the first trusted `Received` hop
  - URLs, landing domains and redirectors
  - Attachment names and SHA-256
  - Subject line for message trace
mistakes:
  - Headers above your own mail servers can be forged — trust only those your infrastructure added.
  - SPF/DKIM pass proves the domain authorised the server, not that the sender is benign.
  - A forwarded message loses the original headers.
  - Never click links or open attachments on the analyst workstation.
related_artifacts: [office-documents, pdf, lnk, ip-domain]
---
