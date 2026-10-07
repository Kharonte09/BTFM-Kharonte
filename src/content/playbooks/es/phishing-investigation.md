---
name: Investigación de phishing
summary: De un correo reportado al alcance, los IOCs y una conclusión — headers, autenticación, enlaces, adjuntos, infraestructura e impacto en los usuarios.
coverage: intermediate
order: 1
scenario: Un correo sospechoso
icon: email
tags: [phishing, correo, acceso inicial, bec, robo de credenciales]
trigger: Un usuario reporta un correo sospechoso, salta una alerta del mail gateway o un incidente apunta al correo como vector de acceso inicial. Consigue el **mensaje original en .eml/.msg**, no un reenvío.
objective: Decidir si el correo es malicioso, a quién afectó y si se ejecutó algo o se expusieron credenciales.
initial_triage:
  - Consigue el `.eml` / `.msg` original y calcula su hash — sin clics y sin abrir adjuntos.
  - Revisa `Authentication-Results` y compara `From`, `Reply-To` y `Return-Path`.
  - Extrae y haz defang de URLs y hashes de adjuntos; consúltalos de forma pasiva.
  - Lanza una traza de mensajes — ¿quién más lo recibió?
  - Revisa proxy / DNS — ¿alguien hizo clic?
evidence:
  - Correo original (.eml / .msg)
  - Logs del mail gateway / traza de mensajes
  - Logs de proxy y DNS
  - Sign-in logs de los usuarios afectados
  - Telemetría del endpoint de quien abrió el adjunto
steps:
  - title: Correo
    goal: Asegurar el mensaje original y registrar los datos básicos.
    actions:
      - Exporta el `.eml` / `.msg` original (o recupéralo de la plataforma de correo / cuarentena).
      - Calcula el hash del fichero y guárdalo en la carpeta del caso. No abras enlaces ni adjuntos.
      - Anota destinatarios, hora de recepción (UTC), asunto, nombre visible y dirección del remitente.
    artifacts: [eml]
  - title: Headers
    goal: Reconstruir la ruta de entrega y detectar incoherencias de identidad.
    actions:
      - Lee los headers `Received` de abajo arriba; identifica el primer salto externo que registró tu infraestructura.
      - Compara `From`, `Reply-To`, `Return-Path` y `Sender`.
      - Comprueba que el dominio del `Message-ID` y los headers de cliente sean coherentes con el remitente declarado.
    artifacts: [eml]
  - title: Autenticación
    goal: Determinar si el dominio remitente autorizó al servidor que envió el correo.
    actions:
      - Lee el `Authentication-Results` añadido por **tu** mail gateway — veredictos SPF, DKIM y DMARC y los dominios a los que se aplican.
      - Un pass para un dominio parecido sigue siendo phishing; un fail para un dominio legítimo puede deberse a un reenvío — revisa ARC.
    escalate: SPF/DKIM pass para **tu propio** dominio o el de un socio de confianza en un mensaje malicioso → posible compromiso de cuenta o tenant.
  - title: URLs
    goal: Extraer todos los enlaces y entender adónde llevan realmente.
    actions:
      - Extrae las URLs del cuerpo HTML (el `href` real, no el texto visible), de los adjuntos y de los códigos QR.
      - Haz defang y regístralas. Consulta su reputación (pasiva) antes de interactuar.
      - Si hace falta, detónalas en un navegador aislado o una sandbox — nunca desde la estación del analista.
    tools: [CyberChef, VirusTotal]
    artifacts: [ip-domain]
  - title: Adjuntos
    goal: Identificar y triar cada adjunto de forma segura.
    actions:
      - Extrae los adjuntos, calcula sus hashes y consúltalos.
      - Identifica el tipo real de fichero (archivo comprimido, ISO/IMG, LNK, HTML, Office, PDF, OneNote).
      - Haz el triage según el tipo — consulta los artefactos de documentos, LNK y binarios.
    tools: [Detect It Easy, olevba, pdfid.py, YARA, VirusTotal]
    artifacts: [office-documents, pdf, lnk, pe-executables]
  - title: Infraestructura
    goal: Entender la infraestructura de envío y de alojamiento.
    actions:
      - Enriquece las IPs de envío, los dominios de los enlaces y las páginas de destino (antigüedad del registro, alojamiento, certificados).
      - Pivota sobre la infraestructura compartida para encontrar dominios relacionados.
    tools: [VirusTotal]
    artifacts: [ip-domain]
  - title: Interacción del usuario
    goal: Averiguar quién lo recibió, lo abrió, pulsó o introdujo credenciales.
    actions:
      - Lanza una traza de mensajes por remitente, asunto, URL o hash del adjunto en toda la organización.
      - Revisa los logs de proxy / DNS en busca de clics en las URLs extraídas.
      - Revisa los sign-in logs de los usuarios afectados tras el clic (IPs nuevas, peticiones MFA, viajes imposibles).
    escalate: Credenciales introducidas o sign-ins sospechosos → trátalo como compromiso de cuenta (reset, revocar sesiones, revisar reglas del buzón).
  - title: Investigación del endpoint
    goal: Confirmar o descartar ejecución en el endpoint de los usuarios que abrieron el adjunto.
    actions:
      - Busca procesos hijos del Office / cliente de correo / navegador y ficheros nuevos en Downloads o Temp.
      - Revisa persistencia y conexiones salientes en la ventana posterior a la apertura.
    tools: [Velociraptor, EvtxECmd]
    artifacts: [sysmon, windows-event-logs, prefetch]
    escalate: Evidencia de ejecución → pasa a los playbooks de Investigación de endpoint Windows y Malware Triage.
  - title: IOCs
    goal: Producir una lista de indicadores limpia y sin duplicados.
    actions:
      - Direcciones y dominios remitentes, IPs de envío, URLs, dominios de destino, hashes de adjuntos, asuntos.
      - Marca cada IOC con su confianza y contexto (dónde se vio, primera aparición).
  - title: Conclusión
    goal: Decidir, contener y documentar.
    actions:
      - Clasifica — spam, phishing de credenciales, entrega de malware, BEC o legítimo.
      - Purga el mensaje de los buzones, bloquea los indicadores, avisa a los usuarios afectados.
      - Registra timeline, alcance, acciones realizadas y preguntas abiertas.
correlation:
  - Correo (remitente, URLs, hash del adjunto)
  - Traza de mensajes — destinatarios
  - Proxy / DNS — clics
  - Sign-in logs — uso de credenciales
  - Endpoint — procesos lanzados por Office / navegador
iocs:
  - Dirección del remitente, remitente del sobre y dominio de envío.
  - IP(s) de envío del primer salto `Received` de confianza.
  - URLs (completas), dominios de destino y redirectores.
  - Nombres de los adjuntos y hashes SHA-256.
  - Asunto y strings distintivos del cuerpo para la traza de mensajes.
decision_points:
  - decision: close
    when: Spam o marketing legítimo; sin URL ni adjunto malicioso; nadie interactuó.
  - decision: escalate
    when: Se introdujeron credenciales, o el correo salió de un buzón interno / de un socio comprometido.
  - decision: isolate
    when: Un adjunto se ejecutó en un endpoint — aísla el equipo y empieza la Investigación de endpoint Windows.
  - decision: deeper
    when: Adjunto o payload desconocido — pásalo por el Malware Triage.
output:
  - Veredicto — spam, phishing de credenciales, entrega de malware, BEC o legítimo
  - IOCs — remitente, IP de envío, URLs, dominios, hashes
  - Usuarios afectados y quién interactuó
  - Timeline (UTC)
  - Acciones realizadas — purga, bloqueos, cambios de contraseña
  - Severidad y siguiente acción
related_playbooks: [malware-triage, windows-endpoint-investigation]
---

Trabaja con evidencia en la que puedas confiar: headers añadidos por tu propia infraestructura, logs de tus propias plataformas y análisis hechos en aislamiento. El correo en sí es una entrada controlada por el atacante.
