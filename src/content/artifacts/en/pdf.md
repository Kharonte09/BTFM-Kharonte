---
name: PDF Documents
summary: Portable Document Format files. Used in phishing for malicious links and QR codes, and less often for JavaScript or embedded files.
category: phishing
aliases: [PDF]
tags: [phishing, javascript, embedded files, urls, maldoc]
evidence:
  - URLs and actions (`/URI`, `/Launch`, `/OpenAction`, `/AA`).
  - Embedded JavaScript and embedded files.
  - Forms and XFA content.
  - Producer/creator metadata and creation dates.
locations:
  - label: Delivery
    path: Email attachments · downloads · links to file-sharing services
questions:
  - Does the PDF contain JavaScript or auto-actions?
  - Which URLs does it link to (including QR codes in images)?
  - Does it embed another file?
tools: [pdfid.py, pdf-parser.py, CyberChef, VirusTotal, YARA]
look_for:
  - Keywords — `/JS`, `/JavaScript`, `/OpenAction`, `/AA`, `/Launch`, `/EmbeddedFile`, `/URI`, `/AcroForm`, `/XFA`, `/ObjStm`.
  - A single page with a big "View document" button and a link — classic credential-phishing lure.
  - QR codes pointing to login pages (quishing) — decode them offline.
  - Object streams (`/ObjStm`) hiding the interesting objects — decompress before concluding.
limitations:
  - '`pdfid` counts keywords; obfuscated names (e.g. `/J#61vaScript`) are normalised but you should still inspect objects.'
  - Links inside images (QR) are invisible to keyword tools.
  - Reader exploits depend on the reader version — static analysis shows intent, not success.
related_artifacts: [eml, office-documents]
review: true
---

A PDF is a set of objects (dictionaries, streams) referenced from a trailer. Didier Stevens' **pdfid.py** gives a fast keyword triage; **pdf-parser.py** lets you search, decompress and dump individual objects.

In current phishing campaigns PDFs are mostly **containers for a link or QR code**; extract and analyse the URL as the next step.
