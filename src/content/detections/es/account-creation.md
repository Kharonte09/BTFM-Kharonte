---
name: Cuenta nueva y cambio de privilegios
summary: Una cuenta creada, habilitada o añadida a un grupo privilegiado — la persistencia más barata que existe. Averigua quién la creó, cuándo y si ya se ha usado.
order: 2
platforms: [Windows, Linux]
mitre: [T1136, T1098]
coverage: basic
review: true
aliases: [creación de cuentas, usuario nuevo, añadido a administradores, cuenta backdoor]
tags: [persistencia, cuentas, 4720, 4732, escalada de privilegios]
start_here:
  - Lista las cuentas y los miembros de los grupos privilegiados tal como están ahora.
  - Busca eventos de creación y de cambio de grupo en la ventana del incidente.
  - En cada resultado, anota **quién** lo hizo (el Subject) y desde qué sesión de logon.
  - Comprueba si la cuenta nueva ha iniciado sesión desde entonces.
signs:
  - Una cuenta creada sin ninguna petición de cambio o de alta detrás.
  - Creada y añadida a `Administrators` (o a `sudo`) en cuestión de minutos.
  - Un nombre que imita a una cuenta de servicio o de soporte (`support`, `svc_backup`, `admin$`).
  - Creada por una cuenta que normalmente no gestiona usuarios — o por una cadena de procesos que sale de un servidor web o de un script.
sources:
  - source: Log Security de Windows
    look: '`4720` cuenta creada, `4722` habilitada, `4724` reseteo de contraseña, `4732` añadida a un grupo local, `4728` / `4756` añadida a un grupo global / universal.'
  - source: Creación de procesos
    look: '`4688` / Sysmon `1` con `net user … /add` o `net localgroup … /add` en la línea de comandos.'
  - source: Linux
    look: '`/var/log/auth.log` o `/var/log/secure` — `useradd`, `usermod`, `groupadd`; y el propio `/etc/passwd`.'
hunts:
  - source: Windows — en vivo (PowerShell como administrador)
    commands:
      - label: Cambios de cuentas y grupos (últimos 7 días)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4720,4722,4724,4728,4732,4756; StartTime=(Get-Date).AddDays(-7)} | Select-Object TimeCreated, Id, @{n='Summary';e={($_.Message -split '\r?\n')[0]}}
      - label: Cuentas locales tal como están ahora
        command: |-
          Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordLastSet
      - label: Quién es administrador local
        command: |-
          net localgroup administrators
      - label: Cuentas creadas desde la línea de comandos (Sysmon)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Where-Object { $_.Message -match 'net1?(\.exe)?"?\s+(user|localgroup)\s.*/add' } | Format-List TimeCreated, Message
  - source: Linux
    commands:
      - label: Cambios de cuentas y grupos en el auth log
        command: |-
          grep -E "useradd|usermod|groupadd" /var/log/auth.log
      - label: Cuentas con UID 0 (solo debería salir root)
        command: |-
          awk -F: '$3 == 0 {print $1}' /etc/passwd
      - label: Miembros de los grupos de administración
        command: |-
          getent group sudo wheel
confirm:
  - El Subject del `4720` / `4732` es una cuenta que ya estaba comprometida, o una que nunca gestiona usuarios.
  - La cuenta nueva inicia sesión (`4624`) poco después de crearse — sobre todo con Logon Type `10` o `3`.
  - Aparece justo después de otra actividad maliciosa en la misma sesión de logon.
false_positives:
  - Helpdesk o herramientas de identidad dando de alta usuarios — Subject esperado, horario esperado y una petición que lo respalda.
  - Instaladores que crean cuentas de servicio.
  - Cuentas integradas que se habilitan al desplegar una imagen o aprovisionar el equipo.
extract:
  - Nombre y SID de la cuenta
  - Quién la creó o modificó (Subject) y el logon ID
  - Grupos a los que se añadió
  - Marcas de tiempo (UTC) de la creación, del cambio de grupo y del primer logon
mistakes:
  - Mirar solo las cuentas actuales — el atacante puede crear la cuenta, usarla y borrarla; los eventos se quedan.
  - Olvidar los grupos de dominio — en un DC mira `4728` / `4756`, no solo el `4732` local.
  - Que no haya eventos de cuentas no significa nada si la auditoría de gestión de cuentas no está activada.
tools: [Event Viewer, EvtxECmd, Chainsaw, Hayabusa, DeepBlueCLI]
related_artifacts: [windows-event-logs, sysmon]
related_playbooks: [windows-endpoint-investigation]
---
