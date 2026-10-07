---
name: Volcado de memoria
summary: Imagen de la RAM física de un sistema. Muestra procesos en ejecución, conexiones de red, código inyectado y artefactos que nunca tocan el disco.
category: memory
aliases: [Memory Dump, RAM dump, memory image, Processes, Handles, DLLs, Network connections, Volcado de RAM]
tags: [memoria, procesos, inyección, fileless, volatility]
evidence:
  - Procesos en ejecución y terminados recientemente, relaciones padre-hijo, líneas de comandos.
  - Conexiones de red y sockets a la escucha con su proceso propietario.
  - DLL y módulos cargados, handles (ficheros, claves del registro, mutex).
  - Regiones de memoria ejecutable inyectadas o sin respaldo en disco.
  - Strings descifrados, claves y configuraciones presentes solo en tiempo de ejecución.
locations:
  - label: Salida de la adquisición
    path: Raw (.raw/.mem) · volcado de bloqueo (.dmp) · ficheros de memoria de VM (p. ej. .vmem)
  - label: Restos de memoria en disco
    path: C:\hiberfil.sys · C:\pagefile.sys · C:\swapfile.sys
questions:
  - ¿Qué procesos se estaban ejecutando y cuáles son sospechosos?
  - ¿Qué proceso era el dueño de esta conexión de red?
  - ¿Hay código inyectado en un proceso legítimo?
  - ¿Qué líneas de comandos se usaron?
  - ¿Hay malware fileless o un payload descifrado en memoria?
tools: [Volatility 3, MemProcFS, YARA, Velociraptor]
look_for:
  - Procesos con padres incorrectos (p. ej. `svchost.exe` no lanzado por `services.exe`) o rutas incorrectas.
  - Nombres de procesos del sistema mal escritos (`scvhost.exe`, `lsas.exe`).
  - 'Coincidencias de `windows.malfind` — memoria privada ejecutable, sobre todo con cabecera `MZ`.'
  - Conexiones de procesos que no deberían usar la red.
  - Procesos visibles para los plugins de escaneo pero ausentes en los basados en listas (ocultación).
limitations:
  - La adquisición debe hacerse antes de apagar; la imagen es un único instante.
  - Las herramientas de adquisición modifican la memoria y algunos productos de seguridad pueden bloquearlas.
  - El análisis depende de símbolos/perfiles que coincidan con la build del sistema operativo.
  - Smear — los cambios de memoria durante la adquisición pueden producir estructuras inconsistentes.
related_artifacts: [pe-executables, pcap, sysmon]
---

La forense de memoria recupera el **estado en ejecución** de un sistema. Herramientas habituales de adquisición son WinPmem, DumpIt y Magnet RAM Capture; el análisis suele hacerse con **Volatility 3** (Volatility 2 ya no se mantiene) o **MemProcFS**, que expone la memoria como un sistema de ficheros virtual.

### Plugins habituales de Volatility 3 (Windows)

| Plugin | Uso |
| --- | --- |
| `windows.info` | Build del sistema e información de la imagen |
| `windows.pslist` / `windows.psscan` | Lista de procesos (lista enlazada frente a escaneo de pool) |
| `windows.pstree` | Árbol padre-hijo |
| `windows.cmdline` | Líneas de comandos de los procesos |
| `windows.netscan` | Conexiones y sockets de red |
| `windows.dlllist` | Módulos cargados por proceso |
| `windows.handles` | Handles abiertos por proceso |
| `windows.malfind` | Regiones de memoria ejecutable sospechosas |
| `windows.svcscan` | Servicios |

Ejemplo: `vol -f memory.raw windows.pstree`
