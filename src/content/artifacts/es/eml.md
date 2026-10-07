---
name: Email (EML / MSG)
summary: Un correo en bruto con headers completos, cuerpo y adjuntos. Averigua quién lo envió de verdad, si pasó la autenticación y qué hacen los enlaces y adjuntos.
category: email
coverage: intermediate
aliases: [Email Message (EML / MSG), EML, MSG, Email, Email headers, Phishing email, Correo, Cabeceras de correo]
tags: [phishing, headers, spf, dkim, dmarc, adjuntos, urls]
start_here:
  - Consigue el mensaje **original** en `.eml` / `.msg` — no un reenvío.
  - Calcula su hash y guárdalo en la carpeta del caso. No abras enlaces ni adjuntos.
  - Lee los headers `Received` de abajo arriba y encuentra el primer salto que registró tu infraestructura.
  - Revisa `Authentication-Results` (SPF / DKIM / DMARC) y compara `From`, `Reply-To`, `Return-Path`.
  - Extrae URLs y adjuntos, haz defang y consulta su reputación.
why:
  - Un usuario reportó un correo sospechoso.
  - Alerta del mail gateway o una campaña que llega a varios buzones.
  - Un incidente apunta al correo como acceso inicial.
questions:
  - ¿Quién lo envió de verdad y desde qué infraestructura?
  - ¿Pasaron SPF / DKIM / DMARC — y para qué dominio?
  - ¿Adónde llevan realmente los enlaces y qué son los adjuntos?
  - ¿Quién más lo recibió y quién hizo clic?
look_for:
  - Nombre visible de una persona interna con una dirección externa.
  - Dominios parecidos (typosquatting, homoglifos, subdominios añadidos).
  - '`spf=fail`, `dkim=fail`, `dmarc=fail` — o un pass para un dominio inesperado.'
  - '`Reply-To` / `Return-Path` distintos de `From`.'
  - Texto del enlace distinto del `href` real; acortadores y redirectores.
  - Adjuntos — archivos comprimidos (ZIP / ISO / IMG), HTML, LNK, Office con macros, PDF con enlaces.
tools_start: [CyberChef, VirusTotal]
tools_deeper: [oletools, pdfid.py, ANY.RUN]
tool_questions:
  - tool: CyberChef
    question: Decodificar headers / cuerpos y extraer + hacer defang de URLs.
  - tool: VirusTotal
    question: ¿Las URLs, dominios o hashes de adjuntos ya son conocidos?
  - tool: ANY.RUN
    question: ¿Qué pasa cuando se abre el enlace o el adjunto?
correlate:
  - Correo (remitente, URLs, hash del adjunto)
  - Traza de mensajes — quién más lo recibió
  - Proxy / DNS — quién hizo clic
  - Sign-in logs — ¿se usaron credenciales tras el clic?
  - Endpoint — ¿se ejecutó el adjunto?
extract:
  - Dirección del remitente, remitente del sobre y dominio
  - IP de envío del primer salto `Received` de confianza
  - URLs, dominios de destino y redirectores
  - Nombres de los adjuntos y SHA-256
  - Asunto para la traza de mensajes
mistakes:
  - Los headers anteriores a tus propios servidores se pueden falsificar — confía solo en los que añadió tu infraestructura.
  - Un pass de SPF/DKIM prueba que el dominio autorizó al servidor, no que el remitente sea legítimo.
  - Un mensaje reenviado pierde los headers originales.
  - Nunca hagas clic en enlaces ni abras adjuntos en la estación del analista.
related_artifacts: [office-documents, pdf, lnk, ip-domain]
---
