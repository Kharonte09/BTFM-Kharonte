---
name: Registro de Windows
summary: Base de datos jerárquica de configuración. Contiene ubicaciones de persistencia, actividad del usuario, dispositivos, servicios y rastros de ejecución.
category: windows
aliases: [Windows Registry, Registry, hives, NTUSER.DAT, Registro]
tags: [persistencia, actividad de usuario, configuración, usb, ejecución]
evidence:
  - Configuración de autoarranque / persistencia (claves Run, servicios, Winlogon, IFEO…).
  - Actividad del usuario — ficheros abiertos recientemente, rutas escritas, carpetas visitadas (ShellBags), UserAssist.
  - Dispositivos USB conectados y volúmenes montados.
  - Configuración del sistema — nombre del equipo, zona horaria, interfaces de red, último apagado.
locations:
  - label: Hives del sistema
    path: C:\Windows\System32\config\SYSTEM · SOFTWARE · SAM · SECURITY
  - label: Hive del usuario
    path: C:\Users\<user>\NTUSER.DAT
  - label: Hive de clases del usuario
    path: C:\Users\<user>\AppData\Local\Microsoft\Windows\UsrClass.dat
  - label: Logs de transacciones
    path: <hive>.LOG1 · <hive>.LOG2
questions:
  - ¿Qué arranca automáticamente en este equipo o al iniciar sesión el usuario?
  - ¿Qué programas ejecutó este usuario desde el Explorador (UserAssist)?
  - ¿Qué carpetas y ficheros abrió el usuario?
  - ¿Qué dispositivos USB se conectaron y cuándo?
  - ¿Cuál era la zona horaria del sistema (para interpretar marcas locales)?
tools: [RECmd, Registry Explorer, RegRipper, KAPE, Velociraptor]
look_for:
  - '`HKLM\Software\Microsoft\Windows\CurrentVersion\Run` / `RunOnce` y lo mismo bajo `HKCU`.'
  - '`HKLM\SYSTEM\CurrentControlSet\Services\<name>\ImagePath` apuntando a rutas inusuales.'
  - '`HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon` (`Shell`, `Userinit`).'
  - 'Entradas `...\Image File Execution Options\<exe>\Debugger`.'
  - 'Entradas `HKCU\Software\Classes\CLSID` que suplantan objetos COM del sistema (COM hijacking).'
  - Últimas escrituras de claves dentro de la ventana del incidente.
limitations:
  - La marca de última escritura existe por clave, no por valor.
  - Sin los logs de transacciones, un hive sucio puede no contener los cambios recientes.
  - Los hives del sistema en vivo están bloqueados — recolecta con una herramienta forense (KAPE, Velociraptor, FTK Imager).
  - Muchos artefactos dependen de la versión; verifica la build de Windows antes de interpretarlos.
related_artifacts: [scheduled-tasks, windows-event-logs]
---

El registro se almacena en ficheros **hive**. Los hives del sistema están en `C:\Windows\System32\config\`, y cada usuario tiene `NTUSER.DAT` y `UsrClass.dat` en su perfil. `CurrentControlSet` es un enlace en tiempo de ejecución — en un hive `SYSTEM` offline, mira `Select\Current` para saber qué `ControlSet00X` estaba activo.
