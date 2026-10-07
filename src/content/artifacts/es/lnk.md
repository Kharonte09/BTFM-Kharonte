---
name: Accesos directos LNK
summary: Ficheros de acceso directo de Windows. Se crean automáticamente al abrir ficheros y se abusan como payloads de phishing que lanzan comandos.
category: windows
aliases: [LNK Shortcut Files, LNK, .lnk, Shortcut, Acceso directo]
tags: [actividad de usuario, phishing, acceso inicial, acceso a ficheros]
evidence:
  - La ruta del objetivo y, a menudo, sus marcas MAC y tamaño en el momento del acceso.
  - Información del volumen (tipo de unidad, número de serie, etiqueta) — local, extraíble o de red.
  - Identificadores de máquina (nombre NetBIOS, dirección MAC en el tracker block) del sistema donde estaba el objetivo.
  - En LNK maliciosos, la línea de comandos y argumentos ejecutados, y la ruta del icono usada para disimular.
locations:
  - label: Ficheros recientes (automático)
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent\
  - label: Ficheros recientes de Office
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Office\Recent\
  - label: Escritorio / carpeta Inicio
    path: C:\Users\<user>\Desktop\ · ...\Start Menu\Programs\Startup\
  - label: Entrega por phishing
    path: Dentro de adjuntos ZIP / ISO / VHD o descargas
questions:
  - ¿Abrió este usuario un fichero concreto, y cuándo?
  - ¿Estaba el fichero en un USB o en un recurso compartido de red?
  - ¿Qué ejecuta realmente este acceso directo sospechoso?
  - ¿En qué máquina se creó el LNK?
tools: [LECmd, KAPE, CyberChef, Timeline Explorer]
look_for:
  - Objetivos como `cmd.exe`, `powershell.exe`, `mshta.exe`, `rundll32.exe`, `conhost.exe` con argumentos largos.
  - Argumentos rellenados con espacios para ocultar el comando real en el diálogo de Propiedades.
  - Ubicaciones de icono que apuntan a iconos de documento o carpeta para disimular el acceso directo.
  - LNK en la carpeta Inicio (persistencia).
  - LNK recientes que referencian ficheros en volúmenes extraíbles en torno a una exfiltración.
limitations:
  - Los LNK de elementos recientes guardan el último acceso; los anteriores se sobrescriben.
  - Los usuarios y las herramientas de limpieza pueden borrarlos; una configuración puede desactivar el registro de recientes.
  - Las marcas de tiempo embebidas son las del fichero **objetivo**, no las del LNK.
related_artifacts: [eml, powershell-logs, prefetch]
review: true
---

Un fichero `.lnk` es una estructura binaria (formato Shell Link) que apunta a un objetivo. Windows los crea automáticamente para los ficheros abiertos recientemente, lo que los convierte en buena evidencia de **acceso a ficheros**. Los atacantes también entregan LNK directamente — a menudo dentro de archivos comprimidos o imágenes de disco — porque un doble clic ejecuta la línea de comandos embebida.

Analízalos con **LECmd** (Eric Zimmerman) en lugar de fiarte del diálogo de Propiedades, que puede truncar argumentos largos.
