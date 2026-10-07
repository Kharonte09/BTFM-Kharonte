---
name: FLOSS
summary: FLARE Obfuscated String Solver. Extrae cadenas estáticas y además stack strings, tight strings y cadenas decodificadas que `strings` no ve.
category: malware-analysis
type: Análisis estático
platforms: [Windows, Linux, macOS]
license: Código abierto (Apache-2.0)
homepage: https://github.com/mandiant/flare-floss
difficulty: basic
aliases: [flare-floss]
tags: [cadenas, análisis estático, desofuscación, iocs]
use_when:
  - 'La salida de `strings` es pobre y sospechas que las cadenas se construyen en ejecución o están codificadas.'
  - Quieres extraer IOCs de red, comandos y rutas de un PE de Windows sin ejecutarlo.
  - Triaje de binarios Go o Rust, donde la extracción simple de cadenas es muy ruidosa.
look_for:
  - URLs, dominios, direcciones IP y user agents.
  - Comandos, rutas de ficheros y claves del registro.
  - Nombres de API resueltos dinámicamente.
  - Nombres de mutex, fragmentos de notas de rescate, extensiones de fichero.
  - Cadenas decodificadas (de rutinas de decodificación emuladas) — suelen ser las más interesantes.
workflow:
  - Muestra
  - FLOSS
  - Revisar cadenas
  - Extraer IOCs
  - Correlacionar con la sandbox
examples:
  - label: Todos los tipos de cadenas
    command: 'floss sample.exe'
  - label: Solo cadenas estáticas (rápido)
    command: 'floss --only static -- sample.exe'
  - label: Salida JSON para scripting
    command: 'floss -j sample.exe > sample.floss.json'
outputs:
  - Cadenas estáticas (ASCII y UTF-16LE).
  - Stack strings y tight strings construidas en la pila.
  - Cadenas decodificadas recuperadas emulando funciones candidatas de decodificación.
  - JSON opcional con offsets y la función que produjo cada cadena decodificada.
notes:
  - La decodificación funciona por emulación y está orientada a PE x86/x64 de Windows; puede ser lenta en muestras grandes.
  - No obtener cadenas decodificadas no significa que no haya ofuscación.
  - Trata cada indicador extraído como una pista — valídalo antes de bloquear.
complements: [PEStudio, Detect It Easy, capa, YARA, CyberChef]
related_artifacts: [pe-executables]
---

FLOSS lo mantiene el equipo FLARE de Mandiant. Además de extraer cadenas estáticas, usa el análisis de **vivisect** y emulación para recuperar cadenas que el malware construye o decodifica en tiempo de ejecución:

- **Stack strings** — escritas carácter a carácter en la pila.
- **Tight strings** — variante de stack strings decodificadas en un bucle cerrado.
- **Cadenas decodificadas** — producidas por rutinas de decodificación que FLOSS identifica y emula.
