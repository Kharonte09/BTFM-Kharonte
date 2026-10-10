---
name: xxd
summary: Volcado hexadecimal desde la línea de comandos, y de vuelta a binario. Para comprobar magic bytes, mirar un offset concreto o reparar una cabecera rota.
category: general
type: Volcado hexadecimal
platforms: [Linux, macOS, Windows (viene con Vim)]
homepage: https://github.com/vim/vim
coverage: basic
tags: [hex, magic bytes, identificación de ficheros, carving, ctf]
use_when:
  - La extensión y el contenido no parecen coincidir y quieres ver los magic bytes reales.
  - binwalk u otra herramienta te ha dado un offset y necesitas ver qué hay ahí de verdad.
  - Un fichero no abre porque la cabecera está corrupta o manipulada (reto clásico de CTF).
  - Tienes una cadena en hex y necesitas recuperar el binario.
look_for:
  - 'Magic bytes en el offset 0 — `4d 5a` PE, `7f 45 4c 46` ELF, `50 4b 03 04` ZIP / Office, `25 50 44 46` PDF, `89 50 4e 47` PNG, `ff d8 ff` JPEG, `1f 8b` gzip.'
  - Una cabecera casi correcta — uno o dos bytes mal significa que se editó a propósito.
  - Texto legible en la columna ASCII de la derecha.
  - Datos después del marcador de fin del formato.
examples:
  - label: Primeros bytes (magic bytes)
    command: 'xxd -l 32 suspicious.bin'
  - label: Volcado desde un offset
    command: 'xxd -s 0x1a40 -l 128 suspicious.bin'
  - label: Últimos bytes del fichero
    command: 'xxd -s -64 suspicious.bin'
  - label: Hex plano, sin offsets ni ASCII
    command: 'xxd -p suspicious.bin'
  - label: De cadena hex a binario
    command: 'xxd -r -p payload.hex payload.bin'
  - label: Reparar una cabecera (volcar, editar el hex, reconstruir)
    command: 'xxd broken.png > broken.hex && xxd -r broken.hex fixed.png'
outputs:
  - Offset, bytes en hex y columna ASCII del rango elegido.
  - Un fichero binario reconstruido desde hex con `-r`.
mistakes:
  - 'Al reconstruir con `-r` solo cuentan las columnas hex — editar la columna ASCII no cambia nada.'
  - '`-r -p` espera hex plano; `-r` a secas espera el formato de volcado completo con offsets. Si los mezclas sale basura.'
  - Los magic bytes identifican el contenedor, no la intención — una cabecera PNG válida no dice nada de lo que haya añadido detrás.
complements: [binwalk, strings, Detect It Easy, CyberChef]
related_artifacts: [pe-executables]
---
