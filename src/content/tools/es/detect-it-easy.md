---
name: Detect It Easy
summary: Identificador de ficheros basado en firmas. Indica compilador, linker, packer, protector e instalador de ejecutables y muchos otros formatos.
category: malware-analysis
type: Identificación de ficheros
platforms: [Windows, Linux, macOS]
license: Código abierto (MIT)
homepage: https://github.com/horsicq/Detect-It-Easy
difficulty: basic
aliases: [DIE, diec]
tags: [identificación de ficheros, packer, compilador, entropía, triage]
use_when:
  - Primer vistazo a un fichero desconocido, antes de decidir qué vía de análisis seguir.
  - Sospechas que una muestra está empaquetada o protegida (UPX, Themida, packers propios).
  - Necesitas saber si un PE es nativo, .NET, Go, Delphi, un instalador o un archivo autoextraíble.
look_for:
  - Detecciones de packer/protector — cambian tu siguiente paso (desempaquetar o analizar directamente).
  - 'Detección de .NET → descompila con ILSpy / dnSpyEx en lugar de desensamblar.'
  - Instaladores y SFX → extrae el contenido y analiza el payload.
  - Secciones con entropía alta o datos de overlay.
workflow:
  - Muestra
  - DIE (tipo, compilador, packer)
  - Decidir vía (desempaquetar · descompilar · extraer · estático)
  - PEStudio / capa / FLOSS
examples:
  - label: Análisis por línea de comandos
    command: 'diec sample.bin'
  - label: Análisis recursivo con salida JSON
    command: 'diec -r -j sample.bin'
outputs:
  - Tipo de fichero y arquitectura.
  - Compilador, linker, librería, packer, protector o instalador detectados (con el nombre de la firma).
  - Vista de entropía e información de secciones en la interfaz gráfica.
notes:
  - Las detecciones se basan en firmas; «nada detectado» no significa «no empaquetado».
  - Las firmas son scripts y se pueden ampliar; mantén la herramienta actualizada.
  - Las opciones de línea de comandos cambian entre versiones — revisa `diec --help`.
complements: [PEStudio, capa, FLOSS, YARA]
related_artifacts: [pe-executables, office-documents]
review: true
---

Detect It Easy (DIE) identifica tipos de fichero y la cadena de herramientas que los generó mediante una biblioteca de firmas programables. Soporta PE, ELF, Mach-O, APK y muchos formatos de archivo comprimido y documentos, e incluye interfaz gráfica (`die`), versión de consola (`diec`) y una variante ligera.

En el triage responde a la primera pregunta sobre una muestra: **¿qué es y cómo se construyó?**
