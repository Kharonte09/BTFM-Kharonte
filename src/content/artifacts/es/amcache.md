---
name: Amcache
summary: Hive del registro mantenido por los componentes de compatibilidad de Windows. Lista ejecutables y drivers con rutas y hashes SHA-1.
category: windows
aliases: [Amcache.hve]
tags: [ejecución, hashes, ejecución de programas, presencia]
evidence:
  - Ejecutables y drivers que existieron (o se ejecutaron) en el sistema.
  - Ruta completa, hash SHA-1 (primeros 30 MB), tamaño, información de versión y editor.
  - Programas instalados y sus ficheros asociados.
locations:
  - label: Hive
    path: C:\Windows\AppCompat\Programs\Amcache.hve
  - label: Logs de transacciones
    path: C:\Windows\AppCompat\Programs\Amcache.hve.LOG1 · .LOG2
questions:
  - ¿Cuál es el SHA-1 de un binario que se borró tras el incidente?
  - ¿En qué ruta del disco estaba este ejecutable?
  - ¿Qué binarios inusuales había en rutas escribibles por el usuario?
tools: [AmcacheParser, Registry Explorer, KAPE]
look_for:
  - Binarios sin firmar o de editor desconocido en `AppData`, `Temp`, `ProgramData`, `Users\Public`.
  - Binarios cuyo nombre imita ficheros del sistema pero con la ruta equivocada.
  - Valores SHA-1 para consultar en servicios de reputación.
limitations:
  - La presencia no prueba ejecución — corrobora con Prefetch, registros de eventos u otros artefactos de ejecución.
  - El SHA-1 solo cubre los primeros 31.457.280 bytes en ficheros grandes.
  - El contenido y el comportamiento del hive cambian entre versiones y actualizaciones de Windows.
related_artifacts: [prefetch, shimcache, registry]
---

`Amcache.hve` es un fichero con formato de registro (no forma parte del árbol del registro en vivo) que rellenan tareas de compatibilidad de aplicaciones de Windows. Su principal valor forense es el **hash SHA-1 y la ruta completa** de los ejecutables, que permiten identificar un binario aunque se haya borrado.
