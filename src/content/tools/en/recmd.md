---
name: RECmd
summary: Command-line registry parser. Runs batch files of key/value definitions across hives and outputs a single CSV.
category: windows
type: Artifact parser
platforms: [Windows]
license: Free (MIT)
homepage: https://ericzimmerman.github.io/
difficulty: intermediate
aliases: [Registry Explorer]
tags: [registry, persistence, user activity, eric zimmerman]
use_when:
  - You need to extract many known registry artifacts (Run keys, UserAssist, ShellBags, USB…) from several hives at once.
  - You want repeatable output instead of browsing hives manually.
  - Hives are dirty and transaction logs must be applied.
look_for:
  - Autostart entries pointing to user-writable paths.
  - UserAssist / RecentDocs / TypedPaths showing user activity in the incident window.
  - Services with unusual image paths.
  - Recently written key timestamps that match the incident timeline.
workflow:
  - Collect hives (+ `.LOG1`/`.LOG2`)
  - RECmd with a batch file
  - Review CSV in Timeline Explorer
  - Open specific keys in Registry Explorer
examples:
  - label: Run the Kroll batch file over a collection
    command: 'RECmd.exe -d "C:\Cases\triage\C" --bn BatchExamples\Kroll_Batch.reb --csv "C:\Cases\out"'
outputs:
  - CSV with hive path, key path, value name/data, last write timestamp, category and description per batch entry.
  - Plugin-decoded values for complex artifacts (e.g. UserAssist, ShellBags) where available.
notes:
  - '**Registry Explorer** is the GUI counterpart — use it to inspect individual keys and deleted entries.'
  - Always collect transaction logs alongside hives; otherwise recent changes can be missing.
  - Key last-write times apply to the key, not to individual values.
complements: [Registry Explorer, KAPE, Timeline Explorer, RegRipper]
related_artifacts: [registry, services]
review: true
---

RECmd is the command-line version of **Registry Explorer** (Eric Zimmerman). Instead of navigating hives by hand, you run a **batch file** (`.reb`, YAML) that lists the keys and values to extract, with a category and description for each one.

The community batch files cover most common DFIR registry artifacts and are updated with the tool.
