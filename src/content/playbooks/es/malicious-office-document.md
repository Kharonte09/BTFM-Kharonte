---
name: Documento Office malicioso
summary: Triage estático de un Word/Excel/PowerPoint sospechoso — macros, XLM, objetos embebidos, plantillas remotas y DDE — y extracción de la siguiente etapa y los IOCs.
order: 3
scenario: Un documento Office sospechoso
icon: documents
trigger: Tienes un `.doc`, `.docm`, `.docx`, `.xls`, `.xlsm`, `.xlsb`, `.ppt` o `.rtf` sospechoso — de un correo, una descarga o un reto de laboratorio. Trabaja en una VM aislada y nunca habilites el contenido.
tags: [maldoc, office, macros, vba, xlm, ole, phishing, btlo]
questions:
  - ¿Cuál es el formato real del fichero (OLE, OOXML, RTF) y contiene macros?
  - ¿En qué stream está el código VBA y qué función de autoejecución lo arranca?
  - ¿Qué hace la macro — qué comando, URL o proceso lanza?
  - ¿Qué URL o IP se contacta para descargar la siguiente etapa?
  - ¿Qué fichero se suelta o descarga, y dónde se escribe?
  - ¿Usa el documento una plantilla remota, DDE o un objeto embebido en lugar de macros?
  - ¿Qué metadatos tiene (autor, último guardado por, fecha de creación)?
steps:
  - title: Identificar
    goal: Conocer el formato del contenedor antes de elegir herramienta.
    actions:
      - Calcula el hash y comprueba el tipo real (`file`, Detect It Easy) — la extensión puede mentir.
      - 'OLE (`.doc`, `.xls`) → fichero compuesto; OOXML (`.docx`, `.xlsm`) → ZIP; RTF → texto con `\object` / `\objdata`.'
    tools: [Detect It Easy, oletools]
    artifacts: [office-documents]
  - title: Triage
    goal: Obtener los indicadores de riesgo en una pasada.
    actions:
      - '`oleid file.doc` — macros, XLM, cifrado, relaciones externas, objetos embebidos, flash.'
      - '`mraptor file.doc` — veredicto rápido sobre si las macros se autoejecutan y escriben/ejecutan.'
      - Lee los metadatos (autor, último modificador, fechas de creación/modificación) — útiles para agrupar muestras.
    tools: [oletools]
  - title: Extraer macros
    goal: Obtener el código VBA y localizar el punto de entrada.
    actions:
      - '`olevba file.doc` — código fuente más una tabla de palabras clave sospechosas e IOCs.'
      - '`oledump.py file.doc` — los streams marcados con `M` contienen macros; vuelca uno con `oledump.py -s <n> -v file.doc`.'
      - 'Busca la función de autoejecución: `AutoOpen`, `Document_Open`, `Workbook_Open`, `Auto_Open`.'
    tools: [oletools, oledump.py]
  - title: Desofuscar
    goal: Recuperar lo que la macro ejecuta realmente.
    actions:
      - '`olevba --deobf --decode file.doc` resuelve ofuscación simple de strings y decodifica strings Base64/hex/Dridex.'
      - Sigue a mano la construcción de strings (`Chr()`, `StrReverse`, `Replace`, concatenación) y decodifica los payloads en CyberChef.
      - 'Macros Excel 4.0 (XLM): `XLMMacroDeobfuscator --file file.xlsm` emula la hoja de fórmulas.'
    tools: [oletools, CyberChef, XLMMacroDeobfuscator]
    escalate: Si la macro suelta o descarga una etapa de PowerShell, continúa con el playbook PowerShell sospechoso.
  - title: Otros vectores
    goal: Descartar técnicas que no usan macros.
    actions:
      - 'Plantilla remota — descomprime el OOXML y revisa `word/_rels/settings.xml.rels` en busca de un `attachedTemplate` externo.'
      - '`msodde file.docx` — campos DDE / DDEAUTO.'
      - '`oleobj file.doc` / `rtfobj file.rtf` — objetos embebidos, packages y exploits OLE.'
      - Busca rutas de exploits conocidos (por ejemplo objetos de Equation Editor en RTF) y trata cualquier enlace externo como IOC.
    tools: [oletools]
  - title: Dinámico
    goal: Confirmar el comportamiento cuando el estático no basta.
    actions:
      - Ábrelo en una sandbox con macros habilitadas y captura de red; registra procesos hijos, ficheros y conexiones.
    tools: [ANY.RUN, Hybrid Analysis, Wireshark]
  - title: IOCs
    goal: Entregar indicadores y siguientes pasos.
    actions:
      - Hash del documento, URLs/IPs, nombres y rutas de ficheros soltados, comandos lanzados, metadatos.
      - Busca el mismo hash, remitente o URL en los logs de correo y proxy; comprueba qué usuarios lo abrieron.
    tools: [YARA, VirusTotal]
iocs:
  - SHA-256 del documento y de cualquier fichero soltado / descargado.
  - URLs, dominios e IPs usados para la siguiente etapa.
  - Líneas de comandos lanzadas por la macro.
  - Rutas y nombres de los ficheros soltados.
  - Metadatos de autor / último modificador para agrupar muestras.
escalate_when:
  - Algún usuario abrió el documento con el contenido habilitado.
  - La siguiente etapa es desconocida o llega a un C2 activo.
  - El documento explota una vulnerabilidad en lugar de usar macros.
related_playbooks: [phishing-investigation, suspicious-powershell, malware-triage]
---

Herramientas estáticas como **oletools** y **oledump.py** responden a la mayoría de preguntas sin abrir el documento. Las versiones actuales de Office bloquean por defecto las macros de ficheros con Mark-of-the-Web, así que revisa también si la entrega usó archivos comprimidos, ISO/IMG o LNK para quitarlo.
