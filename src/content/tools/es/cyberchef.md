---
name: CyberChef
summary: «Navaja suiza» en el navegador para codificar, decodificar, descomprimir, analizar y extraer datos mediante recetas encadenadas.
category: general
type: Transformación de datos
platforms: [Web, Offline (HTML autónomo)]
license: Código abierto (Apache-2.0)
homepage: https://github.com/gchq/CyberChef
coverage: intermediate
tags: [decodificación, base64, desofuscación, powershell, iocs, defang, cifrados, codificaciones, rot13, xor, ctf]
use_when:
  - Necesitas decodificar capas Base64, hex, URL-encoding, UTF-16LE, gzip/deflate o XOR.
  - Estás desofuscando un script o una línea de comandos encontrada en los logs.
  - Necesitas extraer o hacer defang de IOCs (URLs, dominios, IPs) de un texto para un informe.
  - Tienes un blob y no sabes qué codificación o cifrado clásico es (retos de CTF / BTLO) — empieza por **Magic**.
look_for:
  - Cada capa decodificada — anótala en las notas del caso; la cadena de pasos también es evidencia.
  - Texto legible tras **From Base64 → Decode text (UTF-16LE)** en un `-EncodedCommand` de PowerShell.
  - Bytes mágicos de compresión (`1f 8b` gzip) tras un paso de decodificación — añade Gunzip / Raw Inflate.
  - Claves en claro junto a rutinas XOR o AES en scripts.
  - '**Base64** — `A-Z a-z 0-9 + /`, suele acabar en `=` o `==`. La variante URL-safe usa `-` y `_`.'
  - '**Base32** — solo mayúsculas `A-Z` y `2-7`, normalmente con varios `=` de relleno.'
  - '**Hex** — solo `0-9 a-f`, longitud par. Si son 32 / 40 / 64 caracteres probablemente es un hash MD5 / SHA-1 / SHA-256: búscalo, no hay nada que decodificar.'
  - '**Binario / decimal / octal** — grupos de `0` y `1`, o números entre 32 y 126 separados por espacios (From Binary / From Decimal / From Octal).'
  - '**Base58** — alfanumérico sin `0`, `O`, `I`, `l`. **Base85** — mucha puntuación; Ascii85 puede ir envuelto en `<~ ~>`.'
  - '**URL encoding** — secuencias `%xx`. **Entidades HTML** — `&#x41;` / `&#65;`.'
  - '**ROT13 / César** — solo cambian las letras; espacios, puntuación y longitud de las palabras se mantienen. **ROT47** también desplaza dígitos y símbolos.'
  - '**Morse** — puntos, rayas y `/`. **Vigenère** — parece un ROT pero ningún desplazamiento único funciona; necesitas la clave.'
examples:
  - label: Receta para -EncodedCommand de PowerShell
    command: 'From_Base64(''A-Za-z0-9+/='',true,false) → Decode_text(''UTF-16LE (1200)'')'
  - label: Receta habitual para payloads comprimidos
    command: 'From_Base64 → Raw_Inflate   (o Gunzip, según los bytes mágicos)'
  - label: Receta de extracción de IOCs
    command: 'Extract_URLs → Defang_URL'
  - label: Blob desconocido — que CyberChef lo adivine (marca Intensive mode y pon un crib si conoces parte del resultado)
    command: 'Magic(3,true,false,''flag{'')'
  - label: César / ROT con desplazamiento desconocido
    command: 'ROT13_Brute_Force   (ROT47_Brute_Force si también se desplazan los símbolos)'
  - label: XOR de un byte con clave desconocida
    command: 'XOR_Brute_Force(1,100,0,''Standard'',false,true,false,''http'')'
  - label: Codificaciones apiladas — quita una capa cada vez
    command: 'From_Hex → From_Base64 → ROT13'
  - label: Cifrados clásicos con clave conocida
    command: 'Vigenère_Decode(''key'')  ·  Atbash_Cipher  ·  Affine_Cipher_Decode(a,b)  ·  Rail_Fence_Cipher_Decode(key,offset)'
  - label: AES con la clave y el IV encontrados en el script
    command: 'From_Base64 → AES_Decrypt(key, iv, ''CBC'', ''Raw'', ''Raw'')'
outputs:
  - Datos transformados, descargables como fichero.
  - Una receta guardable / compartible (JSON o fragmento de URL) que documenta cada paso.
mistakes:
  - Usa una **copia local/offline** para datos sensibles. Aunque el procesado es en el cliente, una URL con la entrada incrustada puede filtrar datos si se comparte.
  - Las entradas grandes pueden congelar la pestaña; recórtalas antes.
  - Decodificar un payload es seguro; ejecutarlo no. Nunca pegues la salida en una shell.
  - '**Codificar no es cifrar** — Base64, hex o ROT13 no necesitan clave y no ocultan nada. Si hace falta una clave es un cifrado, y sin ella toca fuerza bruta o buscarla en el resto de la evidencia.'
  - Los hashes no son reversibles. No pierdas tiempo intentando «decodificar» un MD5 — búscalo en VirusTotal o en una wordlist.
  - '**Magic** solo prueba lo que conoce y se le escapan los cifrados con clave. Que no sugiera nada no significa que los datos sean aleatorios.'
complements: [FLOSS, strings, xxd, PowerShell, jq]
related_artifacts: [powershell-logs, eml]
---
