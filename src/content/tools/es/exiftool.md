---
name: ExifTool
summary: Lee los metadatos de casi cualquier fichero — imágenes, documentos Office, PDF, multimedia. Autor, software, fechas, GPS y lo que se haya quedado en un campo de comentario.
category: general
type: Extracción de metadatos
platforms: [Windows, Linux, macOS]
license: Código abierto (licencia Perl)
homepage: https://exiftool.org
coverage: basic
aliases: [exiftool]
tags: [metadatos, exif, documentos, imágenes, gps, timestamps, ctf]
use_when:
  - Necesitas saber quién creó un documento, con qué software y cuándo.
  - Una imagen puede llevar coordenadas GPS, modelo de dispositivo o una miniatura embebida.
  - El fichero de un reto parece limpio — las flags y pistas suelen esconderse en `Comment`, `Author` o `Description`.
  - La extensión es dudosa y quieres una segunda opinión sobre el tipo real de fichero.
look_for:
  - '`Author`, `Creator`, `Last Modified By`, `Company` — nombres de usuario y de organización.'
  - '`Producer`, `Creator Tool`, `Software` — qué generó el fichero.'
  - Fechas de creación / modificación que se contradicen entre sí o con lo que te han contado.
  - Etiquetas GPS y marca / modelo del dispositivo en imágenes.
  - 'Campos de texto libre (`Comment`, `Description`, `Subject`, `Keywords`) con Base64 o contenido raro.'
  - '`File Type` distinto de la extensión, o un aviso de datos al final del fichero.'
examples:
  - label: Todos los metadatos estándar
    command: 'exiftool suspicious.docx'
  - label: Todo, incluidas etiquetas duplicadas y desconocidas, agrupado
    command: 'exiftool -a -u -g1 suspicious.jpg'
  - label: Todas las fechas
    command: 'exiftool -time:all -a -G1 -s suspicious.pdf'
  - label: GPS en coordenadas decimales
    command: 'exiftool -n -GPSLatitude -GPSLongitude photo.jpg'
  - label: Extraer la miniatura embebida
    command: 'exiftool -b -ThumbnailImage photo.jpg > thumb.jpg'
  - label: Una carpeta entera a CSV
    command: 'exiftool -csv -r ./evidence > metadata.csv'
outputs:
  - Pares etiqueta / valor por fichero, opcionalmente agrupados por familia de metadatos.
  - CSV o JSON (`-csv`, `-json`) para muchos ficheros a la vez.
  - Contenido binario de una etiqueta (`-b`), como las miniaturas.
mistakes:
  - Los metadatos se editan o se borran con facilidad — son una pista, nunca una prueba por sí solos.
  - '`File Modification Date` y similares vienen del sistema de ficheros, no del documento. Cambian al copiar o descargar el fichero.'
  - ExifTool también puede escribir etiquetas. Trabaja sobre una copia, nunca sobre la evidencia original.
  - Comprueba en qué zona horaria está cada fecha antes de llevarla a un timeline.
complements: [strings, binwalk, oletools, CyberChef]
related_artifacts: [office-documents, pdf]
---
