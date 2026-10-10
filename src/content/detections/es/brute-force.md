---
name: Fuerza bruta y password spraying
summary: Muchos logons fallidos contra una cuenta (fuerza bruta) o una misma contraseña probada en muchas cuentas (spraying). Localiza el origen, los objetivos y, sobre todo, si algún intento funcionó.
order: 1
platforms: [Windows, Linux, Web, Splunk]
mitre: [T1110]
coverage: basic
review: true
aliases: [fuerza bruta, brute force, password spraying, password guessing, logons fallidos]
tags: [autenticación, logons, 4625, ssh, rdp, credenciales]
start_here:
  - Fija la ventana temporal (UTC) y qué equipo o servicio está recibiendo los intentos.
  - Cuenta los logons fallidos por origen y por cuenta — la forma te dice si es fuerza bruta (una cuenta) o spraying (muchas cuentas).
  - Comprueba si alguna cuenta atacada inició sesión **correctamente** desde el mismo origen después.
  - Si lo hizo, trata la cuenta como comprometida y pivota a lo que hizo esa sesión.
signs:
  - Una ráfaga de fallos desde un mismo origen en pocos minutos — no repartidos a lo largo de la jornada.
  - 'Fuerza bruta: una cuenta (a menudo `Administrator` / `root`), muchas contraseñas.'
  - 'Password spraying: muchas cuentas, uno o dos intentos en cada una, desde el mismo origen — se queda por debajo del umbral de bloqueo.'
  - Fallos contra cuentas que no existen (un diccionario de usuarios).
  - Un logon correcto justo después de los fallos.
sources:
  - source: Log Security de Windows
    look: '`4625` logon fallido (revisa el Logon Type y la IP de origen), `4624` logon correcto, `4740` cuenta bloqueada.'
  - source: Controlador de dominio
    look: '`4771` preautenticación Kerberos fallida, `4776` validación de credenciales NTLM.'
  - source: Linux
    look: '`/var/log/auth.log` (Debian/Ubuntu) o `/var/log/secure` (RHEL) — `Failed password`, `Invalid user`, `Accepted`.'
  - source: Servidor web
    look: 'Access log — `POST` repetidos a la ruta de login desde una IP, casi todos `401` / `403` (o `200` devolviendo otra vez el formulario).'
hunts:
  - source: Windows — en vivo (PowerShell como administrador)
    note: 'Para consultar un log exportado, cambia `LogName=''Security''` por `Path=''.\Security.evtx''`. Los índices de propiedades son los de los eventos `4625` y `4624`.'
    commands:
      - label: Logons fallidos por IP de origen y cuenta (últimas 24 h)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-1)} | ForEach-Object { [pscustomobject]@{ User=$_.Properties[5].Value; Ip=$_.Properties[19].Value } } | Group-Object Ip, User | Sort-Object Count -Descending | Select-Object Count, Name -First 20
      - label: Spraying — cuentas distintas probadas por IP de origen
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-1)} | ForEach-Object { [pscustomobject]@{ User=$_.Properties[5].Value; Ip=$_.Properties[19].Value } } | Group-Object Ip | Select-Object Name, Count, @{n='Users';e={($_.Group.User | Sort-Object -Unique).Count}} | Sort-Object Users -Descending
      - label: ¿Funcionó? Logons correctos desde la IP atacante
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddDays(-1)} | Where-Object { $_.Properties[18].Value -eq '203.0.113.10' } | Select-Object TimeCreated, @{n='User';e={$_.Properties[5].Value}}, @{n='LogonType';e={$_.Properties[8].Value}}
      - label: Bloqueos de cuenta
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4740} | Format-List TimeCreated, Message
  - source: Windows — logs exportados (EvtxECmd)
    note: Después filtra y agrupa el CSV por dirección de origen y cuenta en Timeline Explorer.
    commands:
      - label: Solo los eventos de autenticación, a CSV
        command: |-
          EvtxECmd.exe -f "C:\Cases\triage\Security.evtx" --csv "C:\Cases\out" --inc 4624,4625,4740,4771,4776
  - source: Linux — SSH
    note: 'En sistemas tipo RHEL el fichero es `/var/log/secure`.'
    commands:
      - label: Logons fallidos por IP de origen
        command: |-
          grep "Failed password" /var/log/auth.log | grep -oE "from [0-9.]+" | sort | uniq -c | sort -nr | head
      - label: Qué cuentas están probando
        command: |-
          grep "Failed password" /var/log/auth.log | sed -E 's/.*for (invalid user )?(.*) from .*/\2/' | sort | uniq -c | sort -nr | head
      - label: Spraying — cuentas distintas probadas por IP de origen
        command: |-
          grep "Failed password" /var/log/auth.log | sed -E 's/.*for (invalid user )?(.*) from ([0-9.]+) .*/\3 \2/' | sort -u | awk '{print $1}' | uniq -c | sort -nr | head
      - label: ¿Funcionó? Logons aceptados desde la IP atacante
        command: |-
          grep "Accepted" /var/log/auth.log | grep "203.0.113.10"
  - source: Web — formulario de login (access log)
    note: 'Cambia `/login` por la ruta real de login (p. ej. `/wp-login.php`). Los campos asumen el formato combined: `$1` IP del cliente, `$9` código de estado.'
    commands:
      - label: Intentos de login por IP y código de estado
        command: |-
          grep "POST /login" access.log | awk '{print $1, $9}' | sort | uniq -c | sort -nr | head
  - source: Splunk
    note: Los nombres de los campos dependen del sourcetype y del add-on que uses — compruébalos antes con tus propios datos.
    commands:
      - label: Logons fallidos por origen
        command: |-
          index=<index> EventCode=4625 | stats count by Source_Network_Address | sort -count
      - label: Umbral — 10 fallos en 10 minutos desde un mismo origen
        command: |-
          index=<index> EventCode=4625 | bin _time span=10m | stats count by _time, Source_Network_Address | where count >= 10
confirm:
  - Un `4624` (o `Accepted` en SSH) de una cuenta atacada, desde el origen atacante, después de los fallos → la cuenta está comprometida.
  - Logon Type `10` (RDP) o `3` (red) desde una dirección externa o inesperada.
  - Actividad nueva en esa cuenta justo después — logon privilegiado `4672`, creación de procesos, una cuenta o un servicio nuevos.
false_positives:
  - Un servicio, tarea programada o unidad mapeada que sigue usando la contraseña antigua tras un cambio — una cuenta, un origen interno, ritmo constante.
  - Un usuario que ha olvidado la contraseña — unos pocos fallos y luego un acierto, desde su equipo habitual.
  - Escáneres de vulnerabilidades y monitorización desde IPs internas conocidas — las exclusiones, documentadas y lo más estrechas posible.
  - Un SSH / RDP expuesto a Internet recibe ruido de fondo todo el día — lo que importa es un acierto, o una lista de usuarios dirigida.
extract:
  - IPs y equipos de origen
  - Cuentas atacadas — y cuáles existen de verdad
  - Ventana temporal (UTC) y ritmo de los intentos
  - Servicio y tipo de logon (RDP, SMB, SSH, web)
  - Si hubo un acierto, y con qué cuenta
mistakes:
  - Alertar por cada `4625` — usa un umbral (p. ej. 10 fallos en 10 minutos) o el ruido entierra el ataque.
  - Quedarte en los fallos — la pregunta es si algún intento funcionó.
  - El spraying se esconde bajo los umbrales por cuenta — cuenta las cuentas distintas **por origen**, no los fallos por cuenta.
  - La IP de origen del `4625` puede venir vacía (`-`) o ser la de un proxy o gateway — usa el nombre del equipo y los logs del propio gateway.
  - En cuentas de dominio el DC registra `4771` / `4776`; el `4625` se escribe en el equipo donde se intentó el logon.
tools: [Event Viewer, EvtxECmd, Chainsaw, Hayabusa, DeepBlueCLI]
related_artifacts: [windows-event-logs, ip-domain]
related_playbooks: [windows-endpoint-investigation]
---

### Sub status del 4625 — por qué falló el logon

| Sub status | Significado |
| --- | --- |
| `0xC0000064` | El usuario no existe |
| `0xC000006A` | Contraseña incorrecta (la cuenta existe) |
| `0xC0000234` | Cuenta bloqueada |
| `0xC0000072` | Cuenta deshabilitada |
| `0xC0000071` | Contraseña caducada |
