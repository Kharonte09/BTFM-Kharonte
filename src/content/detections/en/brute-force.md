---
name: Brute force & password spraying
summary: Many failed logons against one account (brute force) or one password tried across many accounts (spraying). Find the source, the targets and — above all — whether one attempt worked.
order: 1
platforms: [Windows, Linux, Web, Splunk]
mitre: [T1110]
coverage: basic
review: true
aliases: [brute force, password spraying, password guessing, failed logons]
tags: [authentication, logons, 4625, ssh, rdp, credentials]
start_here:
  - Fix the time window (UTC) and which host or service is being hit.
  - Count failed logons by source and by account — the shape tells you brute force (one account) or spraying (many accounts).
  - Check whether a targeted account logged on **successfully** from the same source afterwards.
  - If it did, treat the account as compromised and pivot to what that session did.
signs:
  - A burst of failures from one source within minutes — not spread over a working day.
  - 'Brute force: one account (often `Administrator` / `root`), many passwords.'
  - 'Password spraying: many accounts, one or two attempts each, from the same source — it stays under the lockout threshold.'
  - Failures for accounts that do not exist (a username dictionary).
  - A successful logon right after the failures.
sources:
  - source: Windows Security log
    look: '`4625` failed logon (check Logon Type and source IP), `4624` successful logon, `4740` account locked out.'
  - source: Domain controller
    look: '`4771` Kerberos pre-authentication failed, `4776` NTLM credential validation.'
  - source: Linux
    look: '`/var/log/auth.log` (Debian/Ubuntu) or `/var/log/secure` (RHEL) — `Failed password`, `Invalid user`, `Accepted`.'
  - source: Web server
    look: 'Access log — repeated `POST` to the login path from one IP, mostly `401` / `403` (or `200` serving the login page again).'
hunts:
  - source: Windows — live (PowerShell as administrator)
    note: 'To query an exported log, swap `LogName=''Security''` for `Path=''.\Security.evtx''`. The property indexes are those of events `4625` and `4624`.'
    commands:
      - label: Failed logons by source IP and account (last 24 h)
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-1)} | ForEach-Object { [pscustomobject]@{ User=$_.Properties[5].Value; Ip=$_.Properties[19].Value } } | Group-Object Ip, User | Sort-Object Count -Descending | Select-Object Count, Name -First 20
      - label: Spraying — distinct accounts tried per source IP
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-1)} | ForEach-Object { [pscustomobject]@{ User=$_.Properties[5].Value; Ip=$_.Properties[19].Value } } | Group-Object Ip | Select-Object Name, Count, @{n='Users';e={($_.Group.User | Sort-Object -Unique).Count}} | Sort-Object Users -Descending
      - label: Did it work? Successful logons from the attacking IP
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddDays(-1)} | Where-Object { $_.Properties[18].Value -eq '203.0.113.10' } | Select-Object TimeCreated, @{n='User';e={$_.Properties[5].Value}}, @{n='LogonType';e={$_.Properties[8].Value}}
      - label: Account lockouts
        command: |-
          Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4740} | Format-List TimeCreated, Message
  - source: Windows — exported logs (EvtxECmd)
    note: Then filter and group the CSV by source address and account in Timeline Explorer.
    commands:
      - label: Only the authentication events, to CSV
        command: |-
          EvtxECmd.exe -f "C:\Cases\triage\Security.evtx" --csv "C:\Cases\out" --inc 4624,4625,4740,4771,4776
  - source: Linux — SSH
    note: 'On RHEL-like systems the file is `/var/log/secure`.'
    commands:
      - label: Failed logons by source IP
        command: |-
          grep "Failed password" /var/log/auth.log | grep -oE "from [0-9.]+" | sort | uniq -c | sort -nr | head
      - label: Which accounts are being tried
        command: |-
          grep "Failed password" /var/log/auth.log | sed -E 's/.*for (invalid user )?(.*) from .*/\2/' | sort | uniq -c | sort -nr | head
      - label: Spraying — distinct accounts tried per source IP
        command: |-
          grep "Failed password" /var/log/auth.log | sed -E 's/.*for (invalid user )?(.*) from ([0-9.]+) .*/\3 \2/' | sort -u | awk '{print $1}' | uniq -c | sort -nr | head
      - label: Did it work? Accepted logons from the attacking IP
        command: |-
          grep "Accepted" /var/log/auth.log | grep "203.0.113.10"
  - source: Web — login form (access log)
    note: 'Replace `/login` with the real login path (e.g. `/wp-login.php`). Fields assume the combined log format: `$1` client IP, `$9` status code.'
    commands:
      - label: Login attempts by IP and status code
        command: |-
          grep "POST /login" access.log | awk '{print $1, $9}' | sort | uniq -c | sort -nr | head
  - source: Splunk
    note: Field names depend on the sourcetype and add-on in use — check them against your own data first.
    commands:
      - label: Failed logons by source
        command: |-
          index=<index> EventCode=4625 | stats count by Source_Network_Address | sort -count
      - label: Threshold — 10 failures in 10 minutes from one source
        command: |-
          index=<index> EventCode=4625 | bin _time span=10m | stats count by _time, Source_Network_Address | where count >= 10
confirm:
  - A `4624` (or `Accepted` in SSH) for a targeted account, from the attacking source, after the failures → the account is compromised.
  - Logon Type `10` (RDP) or `3` (network) from an external or unexpected address.
  - New activity on that account right afterwards — `4672` privileged logon, process creation, a new account or service.
false_positives:
  - A service, scheduled task or mapped drive still using the old password after a change — one account, one internal source, steady rhythm.
  - A user who forgot the password — a handful of failures, then a success, from their usual host.
  - Vulnerability scanners and monitoring from known internal IPs — keep exclusions documented and narrow.
  - Internet-exposed SSH / RDP gets background noise all day — what matters is a success, or a targeted username list.
extract:
  - Source IPs and hostnames
  - Targeted accounts — and which of them exist
  - Time window (UTC) and rate of attempts
  - Service and logon type (RDP, SMB, SSH, web)
  - Whether there was a success, and with which account
mistakes:
  - Alerting on every `4625` — use a threshold (e.g. 10 failures in 10 minutes) or the noise buries the attack.
  - Stopping at the failures — the question is whether one attempt worked.
  - Spraying hides under per-account thresholds — count distinct accounts **per source**, not failures per account.
  - The source IP in `4625` can be empty (`-`) or belong to a proxy or gateway — use the workstation name and the gateway's own logs.
  - For domain accounts the DC records `4771` / `4776`; the `4625` is written on the host where the logon was attempted.
tools: [Event Viewer, EvtxECmd, Chainsaw, Hayabusa, DeepBlueCLI]
related_artifacts: [windows-event-logs, ip-domain]
related_playbooks: [windows-endpoint-investigation]
---

### 4625 sub status — why the logon failed

| Sub status | Meaning |
| --- | --- |
| `0xC0000064` | User name does not exist |
| `0xC000006A` | Wrong password (the account exists) |
| `0xC0000234` | Account locked out |
| `0xC0000072` | Account disabled |
| `0xC0000071` | Password expired |
