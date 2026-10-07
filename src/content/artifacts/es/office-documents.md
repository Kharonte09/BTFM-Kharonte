---
name: Documentos Office
summary: Ficheros Word / Excel / PowerPoint que pueden llevar macros, objetos embebidos o plantillas remotas. Averigua si ejecutan algo y qué descargan después — sin abrirlos.
category: documents
coverage: intermediate
aliases: [Office Documents & Macros, Office Documents, DOCX, DOCM, XLSX, XLSM, DOC, XLS, OLE, VBA, macros, XLM]
tags: [phishing, macros, vba, xlm, ole, maldoc]
start_here:
  - Calcula el hash y comprueba el tipo real — la extensión puede mentir.
  - Ejecuta `oleid` para un resumen rápido del riesgo (macros, enlaces externos, objetos embebidos).
  - Extrae las macros con `olevba` y localiza el punto de autoejecución.
  - Saca las URLs, IPs y comandos que usa la macro.
  - Si no hay macros, revisa plantillas remotas, DDE y objetos embebidos.
start_commands:
  - label: Indicadores de riesgo
    command: 'oleid suspicious.doc'
  - label: Extraer y analizar macros
    command: 'olevba suspicious.docm'
  - label: Veredicto rápido sobre las macros
    command: 'mraptor suspicious.doc'
why:
  - Adjunto de phishing.
  - Una aplicación Office lanzó `cmd.exe` / `powershell.exe` en un endpoint.
  - Documento descargado justo antes de una ejecución sospechosa.
look_for:
  - Autoejecución — `AutoOpen`, `Document_Open`, `Workbook_Open`, `Auto_Open`.
  - '`Shell`, `WScript.Shell`, `CreateObject`, `URLDownloadToFile`, `powershell`.'
  - Ofuscación — cadenas de `Chr()`, `StrReverse`, bloques Base64, código basura.
  - Hojas de macros Excel 4.0 (XLM) ocultas.
  - Destinos externos `attachedTemplate` en `word/_rels/settings.xml.rels` (plantilla remota).
tools_start: [oletools]
tools_deeper: [oledump.py, XLMMacroDeobfuscator, CyberChef, ANY.RUN]
tool_questions:
  - tool: oletools
    question: ¿Tiene macros y qué hacen?
  - tool: CyberChef
    question: ¿Qué hay detrás de los strings ofuscados?
  - tool: ANY.RUN
    question: ¿Qué pasa cuando se abre el documento con el contenido habilitado?
correlate:
  - Documento (hash, macro, URL)
  - Office lanzando un proceso hijo — Sysmon `1` / `4688`
  - PowerShell / descarga de la siguiente etapa
  - Red — la URL de la macro
  - Fichero soltado → análisis del PE
extract:
  - SHA-256 del documento
  - URLs, dominios e IPs usados para descargar la siguiente etapa
  - Comandos lanzados por la macro
  - Nombres y rutas de los ficheros soltados
mistakes:
  - Nunca habilites el contenido en la estación del analista.
  - El VBA muy ofuscado o con stomping puede engañar a la extracción estática — confírmalo en una sandbox.
  - Que no tenga macros no significa que sea seguro — revisa plantillas remotas, DDE y objetos embebidos.
related_artifacts: [eml, pdf, powershell-logs, pe-executables]
---
