---
name: New account & privilege change
summary: An account created, enabled or added to a privileged group — the cheapest persistence there is. Find who created it, when, and whether it has been used.
order: 2
platforms: [Windows, Linux]
mitre: [T1136, T1098]
coverage: basic
review: true
aliases: [account creation, new user, added to administrators, backdoor account]
tags: [persistence, accounts, 4720, 4732, privilege escalation]
start_here:
  - List the accounts and the members of the privileged groups as they are now.
  - Look for creation and group-change events in the incident window.
  - For each hit, note **who** did it (the Subject) and from which logon session.
  - Check whether the new account has logged on since.
signs:
  - An account created outside any change or onboarding request.
  - Created and added to `Administrators` (or `sudo`) within minutes.
  - A name that mimics a service or support account (`support`, `svc_backup`, `admin$`).
  - Created by an account that does not normally manage users — or by a process chain from a web server or script.
sources:
  - source: Windows Security log
    look: '`4720` account created, `4722` enabled, `4724` password reset, `4732` added to a local group, `4728` / `4756` added to a global / universal group.'
  - source: Process creation
    look: '`4688` / Sysmon `1` with `net user … /add` or `net localgroup … /add` in the command line.'
  - source: Linux
    look: '`/var/log/auth.log` or `/var/log/secure` — `useradd`, `usermod`, `groupadd`; and `/etc/passwd` itself.'
hunts:
  - source: Windows — live (PowerShell as administrator)
    commands:
      - label: Account and group changes (last 7 days)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4720,4722,4724,4728,4732,4756; StartTime=(Get-Date).AddDays(-7)} | Select-Object TimeCreated, Id, @{n='Summary';e={($_.Message -split '\r?\n')[0]}}
      - label: Local accounts as they are now
        command: |-
          Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordLastSet
      - label: Who is a local administrator
        command: |-
          net localgroup administrators
      - label: Accounts created from the command line (Sysmon)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Where-Object { $_.Message -match 'net1?(\.exe)?"?\s+(user|localgroup)\s.*/add' } | Format-List TimeCreated, Message
  - source: Linux
    commands:
      - label: Account and group changes in the auth log
        command: |-
          grep -E "useradd|usermod|groupadd" /var/log/auth.log
      - label: Accounts with UID 0 (only root should appear)
        command: |-
          awk -F: '$3 == 0 {print $1}' /etc/passwd
      - label: Members of the admin groups
        command: |-
          getent group sudo wheel
confirm:
  - The Subject of the `4720` / `4732` is an account that was itself compromised, or one that never manages users.
  - The new account logs on (`4624`) soon after being created — especially Logon Type `10` or `3`.
  - It appears right after other malicious activity in the same logon session.
false_positives:
  - Helpdesk or identity tooling creating users — expected Subject, expected hours, a matching request.
  - Installers that create service accounts.
  - Built-in accounts being enabled by imaging or provisioning.
extract:
  - Account name and SID
  - Who created or changed it (Subject) and the logon ID
  - Groups it was added to
  - Timestamps (UTC) of creation, group change and first logon
mistakes:
  - Checking only current accounts — an attacker may create, use and delete the account; the events remain.
  - Forgetting domain groups — on a DC look at `4728` / `4756`, not just the local `4732`.
  - Missing account events mean nothing if account management auditing is not enabled.
tools: [Event Viewer, EvtxECmd, Chainsaw, Hayabusa, DeepBlueCLI]
related_artifacts: [windows-event-logs, sysmon]
related_playbooks: [windows-endpoint-investigation]
---
