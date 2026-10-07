---
name: Ghidra
summary: Suite open source de ingeniería inversa de la NSA, con desensamblador y descompilador para muchas arquitecturas.
category: reversing
type: Desensamblador / descompilador
platforms: [Windows, Linux, macOS]
license: Código abierto (Apache-2.0)
homepage: https://github.com/NationalSecurityAgency/ghidra
difficulty: advanced
tags: [reversing, descompilador, desensamblador, análisis estático]
use_when:
  - El triaje estático (cadenas, imports, capa) no basta para responder tu pregunta.
  - Necesitas entender una rutina concreta — descifrado de configuración, protocolo C2, lógica de persistencia.
  - Quieres confirmar a nivel de código un hallazgo de capa.
look_for:
  - Referencias cruzadas a imports interesantes (`VirtualAlloc`, `CreateRemoteThread`, `InternetOpenUrl`, `CryptDecrypt`).
  - Funciones señaladas por las direcciones de `capa -vv`.
  - Bucles de decodificación alrededor de bloques de datos cifrados.
  - Configuración en claro (C2, claves, mutex, IDs de campaña).
workflow:
  - Importar y autoanalizar
  - Empezar por imports / cadenas / direcciones de capa
  - Renombrar y anotar funciones
  - Extraer configuración / IOCs
  - Escribir regla YARA
outputs:
  - Proyecto anotado con desensamblado, pseudo-C descompilado, grafos de llamadas y referencias cruzadas.
  - Análisis programable (scripts Java/Python) y datos del programa exportables.
notes:
  - Desempaqueta antes; analizar el stub de un packer es perder el tiempo.
  - Requiere un JDK compatible; revisa las notas de la versión actual.
  - Para ensamblados .NET, ILSpy o dnSpyEx dan una salida mucho más legible que un descompilador nativo.
  - El reversing es caro en tiempo — define la pregunta que necesitas responder antes de empezar.
complements: [capa, FLOSS, x64dbg, ILSpy]
related_artifacts: [pe-executables]
---

Ghidra es un framework de ingeniería inversa publicado como código abierto por la National Security Agency de EE. UU. Incluye desensamblador multiarquitectura, descompilador, scripting y soporte de proyectos colaborativos.

En un contexto Blue Team es el **paso de escalado** tras el triaje: lo abres cuando necesitas una respuesta que solo el código puede dar.
