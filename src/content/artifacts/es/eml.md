---
name: Correo electrónico (EML / MSG)
summary: Un correo en bruto con headers completos, partes del cuerpo y adjuntos. El punto de partida de cualquier investigación de phishing.
category: phishing
aliases: [Email Message (EML / MSG), EML, MSG, Email, Email headers, Phishing email, Correo, Cabeceras de correo]
tags: [phishing, headers, spf, dkim, dmarc, adjuntos, urls, acceso inicial]
evidence:
  - Ruta de entrega — headers `Received` añadidos por cada servidor de correo.
  - Identidad declarada del remitente — `From`, `Reply-To`, `Return-Path`, `Sender`.
  - Resultados de autenticación — SPF, DKIM, DMARC (y ARC en correo reenviado).
  - Identificadores del mensaje — `Message-ID`, `Date`, headers de cliente/user-agent.
  - Cuerpo (texto/HTML) con enlaces, y adjuntos codificados en MIME.
locations:
  - label: Exportar desde el cliente
    path: Outlook «Guardar como» (.msg) · Thunderbird / webmail «Mostrar original» / «Descargar mensaje» (.eml)
  - label: Plataforma de correo
    path: Traza de mensajes / exportación de cuarentena en el mail gateway o el portal de administración cloud
questions:
  - ¿Quién lo envió realmente y desde qué infraestructura?
  - ¿Pasaron SPF / DKIM / DMARC, y para qué dominio?
  - ¿Es `Reply-To` distinto de `From` (indicador de BEC)?
  - ¿Qué URLs y adjuntos contiene, y adónde llevan?
  - ¿Quién más de la organización lo recibió?
tools: [CyberChef, VirusTotal, emldump.py, olevba, Wireshark]
look_for:
  - Nombre visible que suplanta a una persona interna mientras la dirección es externa.
  - Dominios parecidos (typosquatting, homoglifos, subdominios añadidos).
  - '`Authentication-Results` con `spf=fail`, `dkim=fail`, `dmarc=fail` — o con pass para un dominio inesperado.'
  - '`Reply-To` / `Return-Path` que no coinciden con `From`.'
  - Enlaces cuyo texto visible difiere del `href` real; acortadores y redirectores.
  - Adjuntos — archivos comprimidos (ZIP/ISO/IMG), HTML smuggling, LNK, OneNote, documentos con macros, PDF con enlaces.
  - El **primer** salto externo en `Received` (lee la cadena de abajo arriba).
limitations:
  - Los headers anteriores a tus propios servidores pueden falsificarse; confía solo en los añadidos por infraestructura que controlas.
  - Un mensaje reenviado pierde los headers originales — pide siempre el original como adjunto (.eml/.msg).
  - Un pass de SPF/DKIM prueba que el dominio autorizó al servidor, no que el remitente sea legítimo.
related_artifacts: [office-documents, pdf, lnk, ip-domain]
---

Un fichero `.eml` es el mensaje RFC 5322 en bruto: headers seguidos de las partes MIME del cuerpo. El `.msg` de Outlook es un fichero compuesto OLE con la misma información en otro contenedor; conviértelo o ábrelo con un parser antes de analizarlo.

**Nunca abras el adjunto ni pulses los enlaces** en una estación de analista. Extráelos, calcula su hash y analízalos en un entorno aislado.
