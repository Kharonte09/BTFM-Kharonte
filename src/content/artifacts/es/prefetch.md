---
name: Windows Prefetch
summary: Evidencia de que un programa se ejecutó en un Windows cliente — con número de ejecuciones y últimas ejecuciones. Úsalo para confirmar ejecución y construir el timeline.
category: windows
coverage: intermediate
aliases: [Prefetch, .pf]
tags: [ejecución, ejecución de programas, timeline]
start_here:
  - Recolecta `C:\Windows\Prefetch\*.pf` (en Windows Server no existe por defecto).
  - Analiza la carpeta a CSV y ordena por última ejecución.
  - Busca el nombre del ejecutable sospechoso — anota el número de ejecuciones y las horas.
  - Revisa los ficheros que cargó al arrancar en busca de rutas de staging o payloads.
start_commands:
  - label: Analizar la carpeta Prefetch a CSV
    command: 'PECmd.exe -d "C:\Cases\triage\C\Windows\Prefetch" --csv "C:\Cases\out"'
why:
  - Necesitas probar si un binario sospechoso llegó a ejecutarse.
  - Construcción del timeline de ejecución de un endpoint.
  - Las herramientas del atacante pueden haberse borrado — el Prefetch puede sobrevivir.
questions:
  - ¿Se ejecutó aquí este programa? ¿Cuándo y cuántas veces?
  - ¿Qué más se ejecutó en ese momento?
  - ¿Se ejecutó desde una ruta inusual o un medio extraíble?
locations:
  - label: Ficheros Prefetch
    path: C:\Windows\Prefetch\<EXENAME>-<HASH>.pf
look_for:
  - Ejecutables en rutas escribibles por el usuario o con nombres aleatorios.
  - LOLBins y herramientas de administración / reconocimiento (`psexec`, `certutil`, `rundll32`, `whoami`, `net`) a horas inesperadas.
  - El mismo nombre con **hashes distintos** — mismo nombre de binario, ruta distinta.
  - Ficheros referenciados bajo `\Users\<user>\AppData\` o `\Temp\`.
tools_start: [PECmd]
tools_deeper: [Timeline Explorer]
correlate:
  - Hora de ejecución en Prefetch
  - Creación de proceso en ese momento — `4688` / Sysmon `1`
  - LNK / actividad del usuario justo antes
  - El binario en disco → análisis del PE
extract:
  - Nombre y ruta del ejecutable, número de ejecuciones, horas
  - Ficheros y rutas referenciados sospechosos
mistakes:
  - Que no exista el `.pf` no prueba que el programa no se ejecutara.
  - El hash del nombre del fichero es un hash de la ruta, no del fichero.
  - Prefetch registra ejecución, no éxito.
related_artifacts: [lnk, windows-event-logs, pe-executables]
---
