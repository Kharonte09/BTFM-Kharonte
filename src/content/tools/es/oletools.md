---
name: oletools
summary: Toolkit de Python para analizar ficheros OLE y documentos de Office — macros, XLM, objetos embebidos, DDE, RTF y relaciones externas.
category: malware-analysis
type: Análisis de maldocs
platforms: [Windows, Linux, macOS]
license: Código abierto (BSD-2-Clause)
homepage: https://github.com/decalage2/oletools
difficulty: intermediate
aliases: [olevba, oleid, mraptor, oleobj, rtfobj, msodde, olemeta]
tags: [maldoc, office, macros, vba, ole, rtf, dde, phishing]
use_when:
  - Necesitas saber si un documento de Office contiene macros, y qué hacen, sin abrirlo.
  - Sospechas una plantilla remota, un campo DDE o un objeto embebido en lugar de macros.
  - Estás haciendo triage de un adjunto de phishing en formato `.doc`, `.docm`, `.xls`, `.xlsm` o `.rtf`.
look_for:
  - 'Puntos de autoejecución que marca `olevba` (`AutoOpen`, `Document_Open`, `Workbook_Open`).'
  - 'Palabras clave «Suspicious» — `Shell`, `CreateObject`, `WScript.Shell`, `URLDownloadToFile`, `Environ`.'
  - IOCs extraídos por `olevba` (URLs, IPs, nombres de ejecutables).
  - 'Indicadores de `oleid` sobre relaciones externas, cifrado, macros XLM y objetos embebidos.'
workflow:
  - '`oleid` — indicadores de riesgo'
  - '`olevba` — macros + palabras clave + IOCs'
  - '`olevba --deobf --decode` — desofuscación simple'
  - '`oleobj` / `rtfobj` / `msodde` — otros vectores'
  - CyberChef / sandbox para la siguiente etapa
examples:
  - label: Instalar / actualizar
    command: 'pip install -U oletools'
  - label: Indicadores de riesgo
    command: 'oleid suspicious.doc'
  - label: Extraer y analizar macros VBA
    command: 'olevba suspicious.docm'
  - label: Desofuscar y decodificar strings
    command: 'olevba --deobf --decode suspicious.docm'
  - label: Veredicto rápido sobre las macros
    command: 'mraptor suspicious.doc'
  - label: Objetos embebidos (OLE / RTF)
    command: 'oleobj suspicious.doc && rtfobj suspicious.rtf'
  - label: Campos DDE
    command: 'msodde suspicious.docx'
outputs:
  - Código fuente VBA por módulo, con una tabla de palabras clave de autoejecución, sospechosas e IOCs.
  - Un resumen de riesgo del contenedor (`oleid`) y un veredicto sobre las macros (`mraptor`).
  - Objetos embebidos extraídos a disco (`oleobj`, `rtfobj`).
  - Enlaces DDE encontrados en los campos del documento (`msodde`).
notes:
  - Las herramientas nunca ejecutan las macros, pero úsalas en una VM aislada — los objetos extraídos pueden ser malware activo.
  - El VBA muy ofuscado o con VBA stomping puede burlar la extracción estática; compáralo con herramientas de p-code o una sandbox.
  - Para macros Excel 4.0 (XLM), XLMMacroDeobfuscator da mejores resultados porque emula las fórmulas.
  - '`oledump.py` (Didier Stevens) es un complemento para inspeccionar ficheros OLE a nivel de stream.'
complements: [oledump.py, XLMMacroDeobfuscator, CyberChef, Detect It Easy, YARA]
related_artifacts: [office-documents, eml]
---

**oletools** es una colección de herramientas en Python de Philippe Lagadec para analizar ficheros compuestos OLE (`.doc`, `.xls`, `.ppt`, `.msg` antiguos) y documentos OOXML de Office. Las más usadas son `olevba` (extracción y análisis de macros), `oleid` (indicadores de riesgo), `mraptor` (veredicto sobre macros), `oleobj` y `rtfobj` (objetos embebidos) y `msodde` (DDE).

Es el primer paso estándar en el triage de maldocs: la mayoría de preguntas sobre un documento malicioso se responden sin abrirlo.
