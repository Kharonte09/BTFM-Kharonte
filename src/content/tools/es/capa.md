---
name: capa
summary: Identifica capacidades en ejecutables (p. ej. «inyectar código», «comunicarse por HTTP») mediante reglas, mapeadas a ATT&CK y MBC.
category: malware-analysis
type: Detección de capacidades
platforms: [Windows, Linux, macOS]
license: Código abierto (Apache-2.0)
homepage: https://github.com/mandiant/capa
coverage: basic
aliases: [flare-capa]
tags: [análisis estático, capacidades, att&ck, mbc, triage]
use_when:
  - Quieres saber **qué puede hacer un binario** antes de abrir un desensamblador.
  - Necesitas técnicas ATT&CK candidatas para un informe.
  - Quieres saber por dónde empezar a hacer reversing (direcciones de función por capacidad).
look_for:
  - Capacidades de persistencia, inyección, anti-análisis y acceso a credenciales.
  - Capacidades de comunicación de red (HTTP, sockets, DNS).
  - Capacidades de cifrado/codificación — candidatas para decodificar configuración o payload.
  - Avisos de muestra empaquetada (capa te dirá que los resultados no son fiables).
examples:
  - label: Resumen por defecto
    command: 'capa sample.exe'
  - label: Detallado — reglas y direcciones coincidentes
    command: 'capa -vv sample.exe'
  - label: Salida JSON
    command: 'capa -j sample.exe > sample.capa.json'
outputs:
  - Tabla de tácticas/técnicas ATT&CK y objetivos/comportamientos MBC.
  - Lista de capacidades con namespaces (p. ej. `host-interaction/process/inject`).
  - Con `-v` / `-vv`, las coincidencias de reglas y las direcciones que las activaron.
mistakes:
  - Las muestras empaquetadas o muy ofuscadas dan pocos resultados o resultados engañosos — desempaqueta primero.
  - Soporta PE, ELF, módulos .NET y shellcode; las versiones recientes también pueden analizar algunos informes de sandbox (modo dinámico). Consulta la documentación para los formatos soportados.
  - Las capacidades son posibilidades en el código, no comportamiento observado.
complements: [FLOSS, Detect It Easy, Ghidra, YARA]
related_artifacts: [pe-executables]
---
