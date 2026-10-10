---
name: ExifTool
summary: Reads the metadata of almost any file — images, Office documents, PDF, media. Author, software, timestamps, GPS and whatever was left in a comment field.
category: general
type: Metadata extraction
platforms: [Windows, Linux, macOS]
license: Open source (Perl license)
homepage: https://exiftool.org
coverage: basic
aliases: [exiftool]
tags: [metadata, exif, documents, images, gps, timestamps, ctf]
use_when:
  - You need to know who created a document, with what software and when.
  - An image may carry GPS coordinates, a device model or an embedded thumbnail.
  - A challenge file looks clean — flags and hints are often hidden in `Comment`, `Author` or `Description`.
  - The extension is doubtful and you want a second opinion on the real file type.
look_for:
  - '`Author`, `Creator`, `Last Modified By`, `Company` — user and organisation names.'
  - '`Producer`, `Creator Tool`, `Software` — what generated the file.'
  - Create / modify dates that contradict each other or the story you were told.
  - GPS tags and device make / model in images.
  - 'Free-text fields (`Comment`, `Description`, `Subject`, `Keywords`) with Base64 or odd content.'
  - '`File Type` different from the extension, or a warning about trailing data.'
examples:
  - label: All standard metadata
    command: 'exiftool suspicious.docx'
  - label: Everything, including duplicate and unknown tags, grouped
    command: 'exiftool -a -u -g1 suspicious.jpg'
  - label: Every timestamp
    command: 'exiftool -time:all -a -G1 -s suspicious.pdf'
  - label: GPS as decimal coordinates
    command: 'exiftool -n -GPSLatitude -GPSLongitude photo.jpg'
  - label: Extract the embedded thumbnail
    command: 'exiftool -b -ThumbnailImage photo.jpg > thumb.jpg'
  - label: A whole folder to CSV
    command: 'exiftool -csv -r ./evidence > metadata.csv'
outputs:
  - Tag / value pairs per file, optionally grouped by metadata family.
  - CSV or JSON (`-csv`, `-json`) for many files at once.
  - Binary tag content (`-b`), such as thumbnails.
mistakes:
  - Metadata is trivial to edit or strip — treat it as a lead, never as proof on its own.
  - '`File Modification Date` and similar come from the filesystem, not from the document. They change when you copy or download the file.'
  - ExifTool can also write tags. Work on a copy, never on the original evidence.
  - Check which timezone each date is in before putting it on a timeline.
complements: [strings, binwalk, oletools, CyberChef]
related_artifacts: [office-documents, pdf]
---
