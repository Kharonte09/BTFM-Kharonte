---
name: CyberChef
summary: «Navaja suiza» en el navegador para codificar, decodificar, descomprimir, analizar y extraer datos mediante recetas encadenadas.
category: general
type: Transformación de datos
platforms: [Web, Offline (HTML autónomo)]
license: Código abierto (Apache-2.0)
homepage: https://github.com/gchq/CyberChef
difficulty: basic
tags: [decodificación, base64, desofuscación, powershell, iocs, defang]
use_when:
  - Necesitas decodificar capas Base64, hex, URL-encoding, UTF-16LE, gzip/deflate o XOR.
  - Estás desofuscando un script o una línea de comandos encontrada en los logs.
  - Necesitas extraer o hacer defang de IOCs (URLs, dominios, IPs) de un texto para un informe.
look_for:
  - Cada capa decodificada — anótala en las notas del caso; la cadena de pasos también es evidencia.
  - Texto legible tras **From Base64 → Decode text (UTF-16LE)** en un `-EncodedCommand` de PowerShell.
  - Bytes mágicos de compresión (`1f 8b` gzip) tras un paso de decodificación — añade Gunzip / Raw Inflate.
  - Claves en claro junto a rutinas XOR o AES en scripts.
workflow:
  - Pegar la entrada
  - Probar **Magic** para obtener pistas
  - Construir la receta capa a capa
  - Extraer IOCs
  - Defang para el informe
examples:
  - label: Receta para -EncodedCommand de PowerShell
    command: 'From_Base64(''A-Za-z0-9+/='',true,false) → Decode_text(''UTF-16LE (1200)'')'
  - label: Receta habitual para payloads comprimidos
    command: 'From_Base64 → Raw_Inflate   (o Gunzip, según los bytes mágicos)'
  - label: Receta de extracción de IOCs
    command: 'Extract_URLs → Defang_URL'
outputs:
  - Datos transformados, descargables como fichero.
  - Una receta guardable / compartible (JSON o fragmento de URL) que documenta cada paso.
notes:
  - Usa una **copia local/offline** para datos sensibles. Aunque el procesado es en el cliente, una URL con la entrada incrustada puede filtrar datos si se comparte.
  - Las entradas grandes pueden congelar la pestaña; recórtalas antes.
  - Decodificar un payload es seguro; ejecutarlo no. Nunca pegues la salida en una shell.
complements: [FLOSS, PowerShell, jq]
related_artifacts: [powershell-logs, eml]
---

CyberChef es una aplicación web de código abierto publicada por el GCHQ. Las operaciones (más de 300) se encadenan en **recetas**, de modo que una decodificación de varias capas es reproducible y se puede compartir con un compañero.

Se ejecuta íntegramente en el navegador y puede descargarse como un HTML autónomo para usarla sin conexión.
