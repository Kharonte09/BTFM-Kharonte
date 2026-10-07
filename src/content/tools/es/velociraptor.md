---
name: Velociraptor
summary: Plataforma open source de visibilidad de endpoints y DFIR. Recolecta y consulta artefactos forenses a escala mediante VQL.
category: dfir
type: Recolección y hunting en endpoints
platforms: [Windows, Linux, macOS]
license: Código abierto (AGPL-3.0)
homepage: https://docs.velociraptor.app/
difficulty: intermediate
aliases: [VQL]
tags: [triage, hunting, recolección, respuesta en vivo, flota]
use_when:
  - Necesitas recolectar o consultar artefactos en muchos endpoints a la vez (hunts).
  - Necesitas respuesta en vivo en un equipo remoto sin acceso físico.
  - Quieres un **recolector offline** autónomo para enviarlo a una sede sin conectividad con el servidor.
look_for:
  - Resultados de hunts que se salen de la línea base de la flota (stacking — los valores raros son los interesantes).
  - Artefactos de procesos, red y persistencia recolectados en el mismo instante.
  - Errores o timeouts por cliente — indican cobertura incompleta.
workflow:
  - Desplegar servidor y clientes (o generar un recolector offline)
  - Seleccionar artefactos (p. ej. `Windows.KapeFiles.Targets`, `Windows.System.Pslist`)
  - Lanzar una recolección o un hunt
  - Agrupar y filtrar resultados en notebooks
  - Exportar para timeline o análisis posterior
examples:
  - label: Arrancar una instancia local de un solo binario para pruebas
    command: 'velociraptor gui'
  - label: Ejecutar un artefacto en local desde la línea de comandos
    command: 'velociraptor artifacts collect Windows.System.Pslist'
outputs:
  - Tablas de resultados por artefacto (JSON/CSV) y ficheros subidos por cliente.
  - Resultados agregados de hunts entre clientes.
  - Contenedores ZIP del recolector offline.
notes:
  - Los artefactos son ficheros YAML que envuelven consultas VQL; puedes escribir los tuyos y compartirlos.
  - Los hunts a escala generan carga y volumen de datos — acota primero por etiqueta o sistema operativo.
  - '`velociraptor gui` está pensado para pruebas y uso individual, no como despliegue de producción.'
  - El proyecto se desarrolla ahora bajo Rapid7; consulta la documentación oficial para la guía de despliegue vigente.
complements: [KAPE, EvtxECmd, YARA]
related_artifacts: [windows-event-logs, prefetch, registry, scheduled-tasks]
---

Velociraptor es un agente de endpoint y un servidor cuyo núcleo es **VQL** (Velociraptor Query Language), un lenguaje tipo SQL que consulta el estado del endpoint: ficheros, registro, event logs, procesos, conexiones de red, etc.

Las consultas reutilizables se empaquetan como **artefactos**. Una amplia biblioteca integrada cubre las recolecciones DFIR habituales y la comunidad mantiene un artifact exchange.
