---
name: Velociraptor
summary: Open-source endpoint visibility and DFIR platform. Collects and queries forensic artifacts at scale using VQL.
category: dfir
type: Endpoint collection & hunting
platforms: [Windows, Linux, macOS]
license: Open source (AGPL-3.0)
homepage: https://docs.velociraptor.app/
coverage: basic
aliases: [VQL]
tags: [triage, hunting, collection, live response, fleet]
use_when:
  - You need to collect or query artifacts on many endpoints at once (hunts).
  - You need live response on a remote host without physical access.
  - You want a standalone **offline collector** to send to a site with no server connectivity.
look_for:
  - Hunt results that stand out from the fleet baseline (stacking — rare values are interesting).
  - Process, network and persistence artifacts collected at the same point in time.
  - Errors or timeouts per client — they indicate incomplete coverage.
examples:
  - label: Start a local single-binary instance for testing
    command: 'velociraptor gui'
  - label: Run an artifact locally from the command line
    command: 'velociraptor artifacts collect Windows.System.Pslist'
outputs:
  - Per-artifact result tables (JSON/CSV) and uploaded files per client.
  - Hunt-level aggregated results across clients.
  - Offline collector ZIP containers.
mistakes:
  - Artifacts are YAML files wrapping VQL queries; you can write your own and share them.
  - Hunts at scale can generate load and data volume — scope by label or OS first.
  - '`velociraptor gui` is intended for testing and single-user use, not as a production deployment.'
  - The project is now developed under Rapid7; check the official docs for current deployment guidance.
complements: [KAPE, EvtxECmd, YARA]
related_artifacts: [windows-event-logs, prefetch, registry, scheduled-tasks]
---
