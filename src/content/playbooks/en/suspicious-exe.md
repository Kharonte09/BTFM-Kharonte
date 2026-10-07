---
name: Suspicious EXE
summary: Triage a Windows executable from hash to IOCs — identify, analyse statically, check reputation, observe behaviour and decide whether to reverse.
coverage: basic
order: 4
scenario: A suspicious .exe / .dll
icon: binaries
tags: [malware, pe, static analysis, sandbox, triage]
trigger: You have a suspicious `.exe` / `.dll` — from an alert, an endpoint, an email attachment or a download. Copy it to an isolated analysis environment (ideally inside a password-protected archive, conventionally `infected`).
objective: Determine whether the executable is malicious, what it does, and which IOCs let you scope it.
initial_triage:
  - Copy the sample to an isolated VM; calculate SHA-256.
  - Identify the real type — packed, .NET, installer, native.
  - Check signature and version info.
  - Look up the hash (do not upload by default).
  - Find where it came from and whether it ran (Sysmon `1`, Prefetch).
evidence:
  - The sample
  - Where it was found (host, path, time)
  - Process creation and network telemetry from that host
  - Sandbox report, if policy allows
steps:
  - title: Hash
    goal: Fingerprint the file before anything else.
    actions:
      - Compute SHA-256 (plus MD5/SHA-1 for legacy lookups).
      - Record source path, host, collection time and who collected it.
    tools: [PowerShell]
  - title: File identification
    goal: Know what you are dealing with.
    actions:
      - Check the real type, architecture, compiler, packer or installer.
      - Decide the path — packed (unpack/sandbox), .NET (decompile), installer/SFX (extract), native (static).
    tools: [Detect It Easy]
    artifacts: [pe-executables]
  - title: Metadata
    goal: Collect properties that support or contradict the story.
    actions:
      - Compile timestamp, version info, original filename, PDB path.
      - Authenticode signature — valid, signer, timestamp.
      - Imphash and Rich header for clustering.
    tools: [PEStudio]
  - title: Static analysis
    goal: Learn capabilities and IOCs without executing.
    actions:
      - Review imports, sections, entropy, resources and overlay.
      - Extract strings including obfuscated ones.
      - Identify capabilities and ATT&CK candidates.
      - Scan with YARA rule sets.
    tools: [PEStudio, FLOSS, capa, YARA]
  - title: Reputation
    goal: Check whether the sample or its IOCs are already known.
    actions:
      - Look up the **hash** (passive). Do not upload unless policy allows.
      - Review first-seen date, detection names, behaviour and relations.
      - Look up extracted domains/IPs.
    tools: [VirusTotal]
    artifacts: [ip-domain]
  - title: Sandbox
    goal: Observe behaviour safely.
    actions:
      - Run in an isolated sandbox (internal, or a public one if policy allows — public submissions may be visible to others).
      - Record process tree, files written, registry changes, network activity.
    tools: [ANY.RUN, Hybrid Analysis]
  - title: Network behaviour
    goal: Extract network indicators and understand C2.
    actions:
      - Review DNS, HTTP and TLS activity from the sandbox capture.
      - Note beacon intervals, URIs, user agents and certificates.
    tools: [Wireshark]
    artifacts: [pcap, ip-domain]
  - title: Persistence
    goal: Identify how the sample survives reboots.
    actions:
      - Run keys, services, scheduled tasks, startup folder, WMI subscriptions.
      - Use these as hunting queries across the fleet.
    artifacts: [registry, scheduled-tasks]
  - title: Deep analysis
    goal: Answer specific questions that triage could not.
    actions:
      - Decide what you need — config extraction, protocol, decryption routine.
      - Unpack if needed, then reverse targeted functions (start from capa addresses).
    tools: [Ghidra, x64dbg, ILSpy]
    escalate: Only reverse when the answer changes the response — time-box it.
  - title: IOCs
    goal: Deliver indicators and detections.
    actions:
      - Hashes, file names/paths, mutexes, registry keys, task/service names, domains, IPs, URLs, user agents.
      - Write or refine a YARA rule and hunting queries.
    tools: [YARA]
correlation:
  - Sample (hash, path)
  - Process creation — Sysmon `1` / `4688`
  - Parent process and user
  - Network — Sysmon `3` / `22`, proxy
  - Persistence — Run keys, services, tasks
iocs:
  - SHA-256 / SHA-1 / MD5 and imphash.
  - Dropped file names and paths.
  - Mutexes, named pipes, service and task names, registry keys.
  - C2 domains, IPs, URLs, user agents, JA3/JA4 fingerprints if available.
decision_points:
  - decision: close
    when: Known-good, validly signed software and the behaviour is expected.
  - decision: deeper
    when: Packed, unknown or evasive sample — sandbox it, then reverse targeted functions only if the answer changes the response.
  - decision: isolate
    when: It executed on a production host and shows C2 or persistence.
  - decision: escalate
    when: Credential theft, lateral movement or ransomware capabilities, or several hosts affected.
output:
  - Verdict and confidence
  - IOCs — hashes, paths, domains, IPs, mutexes, persistence names
  - Affected hosts
  - Behaviour summary
  - YARA rule or hunting queries
  - Next action
related_playbooks: [malware-triage, windows-endpoint-investigation]
---

Do every step on an isolated analysis system. Static steps are safe to repeat; dynamic steps change the environment and should be done in a disposable VM or sandbox.
