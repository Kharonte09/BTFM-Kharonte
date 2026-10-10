---
name: Web shell
summary: Un script colocado en un servidor web que ejecuta comandos del sistema a partir de peticiones HTTP. Se ve como comandos en las URLs, un script raro al que solo llama una IP y el servidor web lanzando una shell.
order: 4
platforms: [Linux, Windows, Web]
mitre: [T1505.003]
coverage: basic
review: true
aliases: [webshell, web shells, backdoor php]
tags: [web, persistencia, access log, iis, apache, ejecución de comandos]
start_here:
  - Busca comandos del sistema operativo en las URLs del access log.
  - Localiza scripts a los que solo llaman una o dos IPs.
  - Lista los scripts creados o modificados recientemente en la raíz web.
  - Comprueba si el proceso del servidor web ha lanzado una shell.
signs:
  - 'Comandos del sistema en una URL: `shell.php?cmd=whoami` — ningún usuario legítimo hace eso.'
  - Un script en una carpeta de subidas, imágenes o temporales que recibe peticiones.
  - Un fichero al que llama una única IP, casi todo `POST` y sin referrer.
  - '`w3wp.exe`, `httpd` o `php` lanzando `cmd.exe`, `powershell.exe` o `sh`.'
  - Un script en la raíz web más reciente que el último despliegue.
sources:
  - source: Access log del servidor web
    look: '`access.log` de Apache / Nginx; IIS en `C:\inetpub\logs\LogFiles\W3SVC*\`.'
  - source: Raíz web
    look: 'Ficheros `.php` / `.aspx` / `.jsp` creados o modificados hace poco, sobre todo en carpetas de subidas.'
  - source: Creación de procesos
    look: '`4688` / Sysmon `1` donde el proceso padre es el del servidor web.'
hunts:
  - source: Access log (Linux)
    note: 'Los campos asumen el formato combined: `$1` IP del cliente, `$6` método, `$7` ruta.'
    commands:
      - label: Parámetros con pinta de comando en las URLs
        command: |-
          grep -Ei "[?&](cmd|exec|command|c)=" access.log
      - label: Comandos del sistema operativo en las URLs
        command: |-
          grep -Ei "(whoami|uname|ipconfig|/etc/passwd|net(%20|\+)user)" access.log
      - label: Qué rutas reciben peticiones POST
        command: |-
          awk '$6 == "\"POST" {print $7}' access.log | sort | uniq -c | sort -nr | head
      - label: Quién habla con un fichero sospechoso
        command: |-
          grep "/uploads/shell.php" access.log | awk '{print $1}' | sort | uniq -c | sort -nr
  - source: Raíz web (Linux)
    commands:
      - label: Scripts modificados en los últimos 7 días
        command: |-
          find /var/www -type f \( -name "*.php" -o -name "*.jsp" \) -mtime -7
      - label: Ficheros PHP que llaman a funciones de ejecución
        command: |-
          grep -rlE "(eval|base64_decode|system|shell_exec|passthru)\(" /var/www --include="*.php"
  - source: Windows — IIS (PowerShell como administrador)
    commands:
      - label: Comandos en los logs de IIS
        command: |-
          Select-String -Path 'C:\inetpub\logs\LogFiles\W3SVC*\*.log' -Pattern '(cmd|exec|command)=|whoami|ipconfig'
      - label: Scripts modificados en los últimos 7 días
        command: |-
          Get-ChildItem C:\inetpub\wwwroot -Recurse -Include *.aspx,*.asp,*.ashx,*.php | Where-Object LastWriteTime -gt (Get-Date).AddDays(-7) | Select-Object LastWriteTime, FullName
      - label: El servidor web lanzando procesos (Sysmon)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Where-Object { $_.Message -match 'ParentImage: .*\\(w3wp|httpd|nginx|php-cgi|tomcat\d*)\.exe' } | Format-List TimeCreated, Message
confirm:
  - Las peticiones devuelven `200` y el tamaño de la respuesta cambia con cada comando.
  - El fichero existe en disco y su contenido ejecuta comandos o decodifica un payload.
  - La creación de procesos muestra al servidor web lanzando una shell a las mismas horas que las peticiones.
  - Una petición anterior que subió el fichero — ese es tu acceso inicial.
false_positives:
  - Hay aplicaciones legítimas con parámetros como `c=` o `exec=` — juzga por el valor, no por el nombre.
  - Escáneres probando nombres conocidos de web shells — un `404` significa que el fichero no está.
  - Muchos CMS y frameworks usan `eval` / `base64_decode` — una coincidencia en el código es una pista, no un veredicto.
  - Un despliegue modifica muchos ficheros a la vez — compáralo con la fecha de la release.
extract:
  - Ruta, nombre y hash de la web shell
  - IPs de cliente y user agents que la usaron
  - Comandos ejecutados (los de las URLs; el cuerpo de los POST no se registra)
  - Primera petición al fichero y la petición que lo subió
  - Cuenta con la que se ejecuta el servidor web
mistakes:
  - Buscar solo en parámetros `GET` — la mayoría de web shells reciben los comandos en el cuerpo del `POST`, que el access log no guarda.
  - Borrar el fichero y cerrar — averigua cómo lo subieron o volverá a aparecer.
  - Fiarte solo de las fechas del fichero — se pueden cambiar; correlaciónalas con el access log.
  - Olvidar la rotación de logs — busca también en `access.log.1` y en los `.gz` comprimidos (`zgrep`).
tools: [YARA, strings, CyberChef]
related_artifacts: [ip-domain, sysmon, windows-event-logs]
related_playbooks: [windows-endpoint-investigation, malware-triage]
---
