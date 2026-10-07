---
name: PECmd
summary: Parser de línea de comandos para ficheros Prefetch de Windows. Convierte los .pf en contadores de ejecución, últimas ejecuciones y ficheros referenciados.
category: windows
type: Parser de artefactos
platforms: [Windows]
license: Gratuita (MIT)
homepage: https://ericzimmerman.github.io/
difficulty: basic
aliases: [Prefetch Explorer Command Line]
tags: [prefetch, ejecución, ejecución de programas, timeline, eric zimmerman]
use_when:
  - Necesitas evidencia de que un programa **se ejecutó** en un equipo Windows y cuándo.
  - Estás construyendo un timeline de ejecución a partir de una recolección de triage (KAPE, Velociraptor).
  - Ha aparecido el nombre de un binario sospechoso y quieres su número de ejecuciones y los ficheros que tocó al arrancar.
look_for:
  - Ejecutables lanzados desde rutas escribibles por el usuario (`%TEMP%`, `%APPDATA%`, `Downloads`, `C:\ProgramData`, `C:\Users\Public`).
  - LOLBins en horarios inusuales (`rundll32.exe`, `regsvr32.exe`, `mshta.exe`, `certutil.exe`, `wmic.exe`).
  - Herramientas de administración y reconocimiento (`psexec*.exe`, `net.exe`, `nltest.exe`, `whoami.exe`, `adfind.exe`) agrupadas en el tiempo.
  - Contador de ejecuciones a 1 en binarios con nombres aleatorios.
  - Ficheros referenciados que apuntan a directorios de staging, DLL cargadas desde rutas extrañas o volúmenes extraíbles.
workflow:
  - Recolectar `C:\Windows\Prefetch\*.pf`
  - PECmd → CSV
  - Ordenar por última ejecución
  - Pivotar sobre ejecutables sospechosos
  - Correlacionar con event logs y ficheros LNK
examples:
  - label: Parsear un directorio Prefetch completo a CSV
    command: 'PECmd.exe -d "C:\Cases\triage\C\Windows\Prefetch" --csv "C:\Cases\out" --csvf prefetch.csv'
  - label: Parsear un único fichero y mostrar el detalle
    command: 'PECmd.exe -f "C:\Cases\triage\C\Windows\Prefetch\CMD.EXE-0BD30981.pf"'
  - label: Resaltar palabras clave en los ficheros referenciados
    command: 'PECmd.exe -d "C:\Cases\triage\C\Windows\Prefetch" -k "temp,tmp,appdata" --csv "C:\Cases\out"'
outputs:
  - Nombre del ejecutable, hash del Prefetch y nombre del fichero de origen.
  - Contador de ejecuciones y última ejecución (hasta 8 ejecuciones anteriores en Windows 8 y posteriores).
  - Información del volumen (número de serie, fecha de creación) y directorios referenciados.
  - Ficheros referenciados durante los primeros segundos de ejecución.
  - Un CSV de timeline (una fila por ejecución) además del CSV principal.
notes:
  - Ejecútalo en una estación forense sobre ficheros recolectados; evita hacerlo en el equipo sospechoso en vivo.
  - El Prefetch de Windows 10/11 está comprimido; analízalo en Windows 8+ o con un parser que implemente la descompresión.
  - Las marcas de tiempo están en UTC. Mantén todo el timeline en UTC.
  - La ausencia de un .pf no prueba que un programa no se ejecutara (ver limitaciones de Prefetch).
complements: [KAPE, Timeline Explorer, EvtxECmd]
related_artifacts: [prefetch]
---

PECmd forma parte de las **herramientas de Eric Zimmerman** (EZ Tools). Analiza los ficheros Prefetch de Windows (`.pf`), que el sistema operativo crea para acelerar el arranque de aplicaciones y que, como efecto secundario, registran evidencia de ejecución de programas.

La salida suele cargarse en **Timeline Explorer** (también de las EZ Tools) para filtrarla y ordenarla.
