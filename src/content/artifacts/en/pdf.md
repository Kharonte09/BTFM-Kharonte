---
name: PDF Documents
summary: In phishing a PDF is usually a container for a link or a QR code; less often it carries JavaScript or an embedded file. Find which, then follow the link.
category: documents
coverage: intermediate
aliases: [PDF]
tags: [phishing, javascript, embedded files, urls, qr]
start_here:
  - Hash the file and confirm it really is a PDF (`file`).
  - Run `pdfid` and check the risky keywords.
  - If a keyword is present, inspect that object with `pdf-parser`.
  - Extract every URL — including QR codes in images — and analyse them as indicators.
start_commands:
  - label: Keyword triage
    command: 'pdfid.py suspicious.pdf'
  - label: Find objects with JavaScript
    command: 'pdf-parser.py --search JavaScript suspicious.pdf'
why:
  - Phishing attachment, often an "invoice" or "shared document".
  - A user opened a PDF and then entered credentials on a page.
look_for:
  - '`/JavaScript`, `/JS`, `/OpenAction`, `/AA`, `/Launch`, `/EmbeddedFile`, `/URI`.'
  - A single page with a big "View document" button and one link.
  - QR codes pointing to login pages.
  - Object streams (`/ObjStm`) hiding the interesting objects.
tools_start: [pdfid.py]
tools_deeper: [pdf-parser.py, CyberChef, VirusTotal]
correlate:
  - PDF (hash, URLs)
  - URL → reputation and landing page
  - Proxy / DNS — who opened the link
  - Sign-in logs — credentials submitted?
extract:
  - SHA-256 of the PDF
  - URLs and domains (including from QR codes)
  - Embedded file names and hashes
mistakes:
  - '`pdfid` only counts keywords — a clean result does not mean there is no link.'
  - Links inside images (QR) are invisible to keyword tools.
  - Don't open the PDF in a normal reader on the analyst workstation.
related_artifacts: [eml, office-documents, ip-domain]
---
