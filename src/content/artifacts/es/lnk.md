---
name: Ficheros LNK
summary: Accesos directos de Windows. Importan por dos motivos — prueban que un usuario abrió un fichero, y los atacantes los entregan como payloads que ejecutan comandos.
category: windows
coverage: intermediate
aliases: [LNK Shortcut Files, LNK Files, LNK, .lnk, Shortcut, Acceso directo, Accesos directos LNK]
tags: [actividad de usuario, phishing, acceso inicial, acceso a ficheros]
start_here:
  - 'Decide qué caso es: un LNK de **elementos recientes** (actividad del usuario) o un LNK **entregado** (payload).'
  - Analízalo con una herramienta — el diálogo de Propiedades trunca los argumentos largos.
  - Lee la ruta del objetivo, los argumentos y el directorio de trabajo.
  - Anota las marcas de tiempo del objetivo, el volumen (local / USB / red) y la información de la máquina.
start_commands:
  - label: Analizar un LNK
    command: 'LECmd.exe -f "C:\Cases\sample.lnk"'
  - label: Analizar una carpeta Recent a CSV
    command: 'LECmd.exe -d "C:\Cases\triage\C\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent" --csv "C:\Cases\out"'
why:
  - Un phishing entregó un LNK dentro de un ZIP / ISO / IMG.
  - Necesitas saber si un usuario abrió un fichero y desde dónde (USB, recurso compartido).
  - Posible persistencia en la carpeta Inicio.
locations:
  - label: Elementos recientes
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent\
  - label: Carpeta Inicio
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\
look_for:
  - Objetivos como `cmd.exe`, `powershell.exe`, `mshta.exe`, `rundll32.exe` con argumentos largos.
  - Argumentos rellenados con espacios para ocultar el comando real.
  - Icono de documento o carpeta para disimular el acceso directo.
  - Objetivos en volúmenes extraíbles o recursos compartidos.
tools_start: [LECmd]
tools_deeper: [CyberChef]
correlate:
  - Objetivo y argumentos del LNK
  - Creación de proceso — `4688` / Sysmon `1`
  - Prefetch del binario lanzado
  - Red / descarga de la siguiente etapa
extract:
  - Ruta del objetivo y línea de comandos completa
  - URLs, IPs o nombres de fichero en los argumentos
  - Número de serie del volumen, nombre / MAC de la máquina (donde estaba el objetivo)
mistakes:
  - Las marcas de tiempo embebidas son las del **objetivo**, no las del LNK.
  - Los LNK de recientes solo guardan el último acceso — las aperturas anteriores se sobrescriben.
  - No hagas doble clic en un LNK entregado «para ver qué hace».
related_artifacts: [eml, prefetch, powershell-logs]
---
