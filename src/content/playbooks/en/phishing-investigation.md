---
name: Phishing Investigation
summary: From a reported email to scope, IOCs and a conclusion — headers, authentication, links, attachments, infrastructure and user impact.
order: 1
scenario: A suspicious email
icon: email
trigger: A user reports a suspicious email, a mail gateway alert fires, or an incident points to email as the initial access vector. Obtain the **original message as .eml/.msg** — not a forward.
tags: [phishing, email, initial access, bec, credential phishing]
steps:
  - title: Email
    goal: Secure the original message and record basic facts.
    actions:
      - Export the original `.eml` / `.msg` (or retrieve it from the mail platform / quarantine).
      - Hash the file and store it in the case folder. Do not open links or attachments.
      - Note recipient(s), received time (UTC), subject, display name and sender address.
    artifacts: [eml]
  - title: Headers
    goal: Reconstruct the delivery path and spot identity mismatches.
    actions:
      - Read `Received` headers bottom-up; identify the first external hop that your infrastructure recorded.
      - Compare `From`, `Reply-To`, `Return-Path` and `Sender`.
      - Check `Message-ID` domain and mailer headers for consistency with the claimed sender.
    artifacts: [eml]
  - title: Authentication
    goal: Determine whether the sending domain authorised the sending server.
    actions:
      - Read `Authentication-Results` added by **your** gateway — SPF, DKIM, DMARC verdicts and the domains they apply to.
      - A pass for a look-alike domain is still phishing; a fail for a legitimate domain may be forwarding — check ARC.
    escalate: SPF/DKIM pass for **your own** or a trusted partner's domain on a malicious message → possible account or tenant compromise.
  - title: URLs
    goal: Extract every link and understand where it really goes.
    actions:
      - Extract URLs from the HTML body (real `href`, not visible text), attachments and QR codes.
      - Defang and record them. Look up reputation (passive) before any interaction.
      - If needed, detonate in an isolated browser/sandbox — never from the analyst workstation.
    tools: [CyberChef, VirusTotal]
    artifacts: [ip-domain]
  - title: Attachments
    goal: Identify and triage each attachment safely.
    actions:
      - Extract attachments, hash them and look up the hashes.
      - Identify the real file type (archive, ISO/IMG, LNK, HTML, Office, PDF, OneNote).
      - Triage per type — see the document, LNK and binary artifacts.
    tools: [Detect It Easy, olevba, pdfid.py, YARA, VirusTotal]
    artifacts: [office-documents, pdf, lnk, pe-executables]
  - title: Infrastructure
    goal: Understand the sending and hosting infrastructure.
    actions:
      - Enrich sending IPs, link domains and landing pages (registration age, hosting, certificates).
      - Pivot on shared infrastructure for related domains.
    tools: [VirusTotal]
    artifacts: [ip-domain]
  - title: User interaction
    goal: Find out who received, opened, clicked or submitted credentials.
    actions:
      - Run a message trace for the same sender, subject, URL or attachment hash across the organisation.
      - Check proxy / DNS logs for clicks on the extracted URLs.
      - Check sign-in logs for affected users after the click (new IPs, MFA prompts, impossible travel).
    escalate: Credentials submitted or suspicious sign-ins → treat as account compromise (reset, revoke sessions, review mailbox rules).
  - title: Endpoint investigation
    goal: Confirm or rule out execution on the endpoint of users who opened the attachment.
    actions:
      - Look for child processes of Office / mail client / browser, and new files in Downloads or Temp.
      - Check persistence and outbound connections in the time window after opening.
    tools: [Velociraptor, EvtxECmd]
    artifacts: [sysmon, windows-event-logs, prefetch]
    escalate: Evidence of execution → switch to the Windows Endpoint Investigation and Malware Triage playbooks.
  - title: IOCs
    goal: Produce a clean, deduplicated indicator list.
    actions:
      - Sender addresses and domains, sending IPs, URLs, landing domains, attachment hashes, subject lines.
      - Mark each IOC with confidence and context (where seen, first seen).
  - title: Conclusion
    goal: Decide, contain and document.
    actions:
      - Classify — spam, credential phishing, malware delivery, BEC, or benign.
      - Purge the message from mailboxes, block indicators, notify affected users.
      - Record timeline, scope, actions taken and open questions.
iocs:
  - Sender address, envelope sender and sending domain.
  - Sending IP(s) from the first trusted `Received` hop.
  - URLs (full), landing domains and redirectors.
  - Attachment names and SHA-256 hashes.
  - Subject line and distinctive body strings for message trace.
escalate_when:
  - A user executed an attachment or submitted credentials.
  - The email came from a legitimate internal or partner account (compromised mailbox).
  - The campaign targets specific roles (finance, executives) — possible targeted attack / BEC.
  - The payload is unknown to reputation services.
related_playbooks: [malware-triage, windows-endpoint-investigation]
---

Work from evidence you can trust: headers added by your own infrastructure, logs from your own platforms, and analysis done in isolation. The email itself is attacker-controlled input.
