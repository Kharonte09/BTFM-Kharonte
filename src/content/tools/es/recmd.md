---
name: RECmd
summary: Parser del registro por línea de comandos. Ejecuta ficheros batch con definiciones de claves y valores sobre varios hives y genera un único CSV.
category: windows
type: Parser de artefactos
platforms: [Windows]
license: Gratuita (MIT)
homepage: https://ericzimmerman.github.io/
coverage: basic
aliases: [Registry Explorer]
tags: [registro, persistencia, actividad de usuario, eric zimmerman]
use_when:
  - Necesitas extraer muchos artefactos conocidos del registro (claves Run, UserAssist, ShellBags, USB…) de varios hives a la vez.
  - Quieres una salida repetible en lugar de recorrer hives a mano.
  - Los hives están sucios y hay que aplicar los logs de transacciones.
look_for:
  - Entradas de autoarranque que apuntan a rutas escribibles por el usuario.
  - UserAssist / RecentDocs / TypedPaths que muestran actividad del usuario en la ventana del incidente.
  - Servicios con rutas de imagen inusuales.
  - Marcas de tiempo de última escritura de claves que coinciden con el timeline del incidente.
examples:
  - label: Ejecutar el batch de Kroll sobre una recolección
    command: 'RECmd.exe -d "C:\Cases\triage\C" --bn BatchExamples\Kroll_Batch.reb --csv "C:\Cases\out"'
outputs:
  - CSV con ruta del hive, ruta de la clave, nombre/dato del valor, última escritura, categoría y descripción por cada entrada del batch.
  - Valores decodificados por plugins para artefactos complejos (p. ej. UserAssist, ShellBags) cuando están disponibles.
mistakes:
  - '**Registry Explorer** es la versión gráfica: úsala para inspeccionar claves concretas y entradas borradas.'
  - Recolecta siempre los logs de transacciones junto a los hives; si no, pueden faltar cambios recientes.
  - La última escritura se aplica a la clave, no a cada valor.
complements: [Registry Explorer, KAPE, Timeline Explorer, RegRipper]
related_artifacts: [registry, services]
review: true
---
