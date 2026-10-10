---
name: Web shell
summary: A script dropped on a web server that runs operating-system commands from HTTP requests. It shows up as commands in URLs, an odd script getting requests from one IP, and the web server spawning a shell.
order: 4
platforms: [Linux, Windows, Web]
mitre: [T1505.003]
coverage: basic
review: true
aliases: [webshell, web shells, backdoor php]
tags: [web, persistence, access log, iis, apache, command execution]
start_here:
  - Search the access log for operating-system commands in URLs.
  - Find scripts that only one or two IPs ever request.
  - List script files created or modified recently in the web root.
  - Check whether the web server process has spawned a shell.
signs:
  - 'Operating-system commands in a URL: `shell.php?cmd=whoami` — no legitimate user does that.'
  - A script in an uploads, images or temp folder receiving requests.
  - A file requested by a single IP, mostly `POST`, with no referrer.
  - '`w3wp.exe`, `httpd` or `php` spawning `cmd.exe`, `powershell.exe` or `sh`.'
  - A script file in the web root newer than the last deployment.
sources:
  - source: Web access log
    look: 'Apache / Nginx `access.log`; IIS in `C:\inetpub\logs\LogFiles\W3SVC*\`.'
  - source: Web root
    look: 'Recently created or modified `.php` / `.aspx` / `.jsp` files, especially in upload folders.'
  - source: Process creation
    look: '`4688` / Sysmon `1` where the parent is the web server process.'
hunts:
  - source: Access log (Linux)
    note: 'Fields assume the combined log format: `$1` client IP, `$6` method, `$7` path.'
    commands:
      - label: Command-style parameters in URLs
        command: |-
          grep -Ei "[?&](cmd|exec|command|c)=" access.log
      - label: Operating-system commands in URLs
        command: |-
          grep -Ei "(whoami|uname|ipconfig|/etc/passwd|net(%20|\+)user)" access.log
      - label: Which paths receive POST requests
        command: |-
          awk '$6 == "\"POST" {print $7}' access.log | sort | uniq -c | sort -nr | head
      - label: Who talks to a suspicious file
        command: |-
          grep "/uploads/shell.php" access.log | awk '{print $1}' | sort | uniq -c | sort -nr
  - source: Web root (Linux)
    commands:
      - label: Script files changed in the last 7 days
        command: |-
          find /var/www -type f \( -name "*.php" -o -name "*.jsp" \) -mtime -7
      - label: PHP files calling execution functions
        command: |-
          grep -rlE "(eval|base64_decode|system|shell_exec|passthru)\(" /var/www --include="*.php"
  - source: Windows — IIS (PowerShell as administrator)
    commands:
      - label: Commands in the IIS logs
        command: |-
          Select-String -Path 'C:\inetpub\logs\LogFiles\W3SVC*\*.log' -Pattern '(cmd|exec|command)=|whoami|ipconfig'
      - label: Script files changed in the last 7 days
        command: |-
          Get-ChildItem C:\inetpub\wwwroot -Recurse -Include *.aspx,*.asp,*.ashx,*.php | Where-Object LastWriteTime -gt (Get-Date).AddDays(-7) | Select-Object LastWriteTime, FullName
      - label: Web server spawning processes (Sysmon)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Where-Object { $_.Message -match 'ParentImage: .*\\(w3wp|httpd|nginx|php-cgi|tomcat\d*)\.exe' } | Format-List TimeCreated, Message
confirm:
  - The requests return `200` and the response size changes with each command.
  - The file exists on disk and its content runs commands or decodes a payload.
  - Process creation shows the web server launching a shell at the same times as the requests.
  - An earlier request that uploaded the file — that is your initial access.
false_positives:
  - Legitimate applications use parameters such as `c=` or `exec=` — judge by the value, not the name.
  - Scanners probing for known web shell names — `404` responses mean the file is not there.
  - Many CMS and frameworks use `eval` / `base64_decode` — a match in the code is a lead, not a verdict.
  - Deployments change many files at once — compare with the release date.
extract:
  - Path, name and hash of the web shell
  - Client IPs and user agents that used it
  - Commands executed (from URLs; POST bodies are not logged)
  - First request to the file and the request that uploaded it
  - Account the web server runs as
mistakes:
  - Only searching `GET` parameters — most web shells take commands in the `POST` body, which the access log does not record.
  - Deleting the file and closing — find how it was uploaded, or it will be back.
  - Trusting file timestamps alone — they can be changed; correlate with the access log.
  - Forgetting log rotation — also search `access.log.1` and the compressed `.gz` files (`zgrep`).
tools: [YARA, strings, CyberChef]
related_artifacts: [ip-domain, sysmon, windows-event-logs]
related_playbooks: [windows-endpoint-investigation, malware-triage]
---
