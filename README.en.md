# dsh-useof-skill-panel

> **A fork of [`dsh-echocat-skill-panel`](https://github.com/VDERR/dsh-echocat-skill-panel)**, with
> attribution and provenance kept. It installs **alongside** the original without interfering.
> The one functional change: the summary strip above the composer (`conversation.input.dock`) is
> **removed** — both the registration and the component — so that bar is never mounted.
> Everything else (panel, sidebar entry, install sheet, background/theme system, host side) is
> word-for-word the original.
>
> The one feature lost with it: the strip was the only surface with composer write access, so
> **"click a skill to insert `/name`" is gone**. Enable the original
> (`dsh-echocat-skill-panel@5.1.3`) if you want that bar — the two coexist.

**v5.1.4** · A cordis plugin for DSH Desktop Beta that audits which skills each turn actually
invoked, and lets you **install, update and remove skills without leaving the app**.

The audit does not rely on the model volunteering anything — the plugin derives the invoked set
from the session event stream (model-invoked, manual `/name`, or none at all), so a turn that used
nothing is reported as such.

![The panel](docs/panel.png)

Two surfaces share one data source:

| Surface | Seat | What it is |
| --- | --- | --- |
| **Sidebar icon** | `sidebar.panellist` (order 60) | The resident entry; click it to open the panel |
| **Centre panel** | `main` | The full report plus the skill catalogue |

> Visual difference from upstream: this fork registers only these two seats. Upstream's third
> seat — the summary strip above the composer — is removed entirely.

## Install

**From GitHub source:**

```powershell
git clone https://github.com/Doctor-Pan-code/dsh-useof-skill-panel.git
cd dsh-useof-skill-panel
npm install            # only fetches the two optional peers; nothing is needed at runtime
```

Then wire the directory into your profile (`<DSH_HOME>` defaults to `~/.dsh`):

```powershell
# 1) In <DSH_HOME>/profiles/<your profile>/package.json, add to `dependencies`:
#      "dsh-useof-skill-panel": "link:<absolute path to this repo>"
# 2) In the same file, add to `dsh.profile.bundles`:
#      "dsh-useof-skill-panel"
# 3) Run pnpm install once more
```

`cordis.patch.yml` ships with the package, so declaring the bundle mounts it — no hand-written
patch row needed.

> The two `peerDependencies` (`@deepseek-ai/dsh-llm`, `@deepseek-ai/schemastery`) are marked
> `optional`: the DSH runtime supplies them, and npm will not fetch a second copy to shadow the
> host's.

> **Restart DSH Desktop Beta after installing.** The host half is snapshotted into memory at boot,
> while the client bundle is re-fetched on every page load — so a client-only change needs a
> refresh, but **a host change needs a restart**.

The four manual steps, uninstall/rollback, and the **five hard constraints that will stop the app
from booting** are in [安装说明.md](安装说明.md) (Chinese).

## Documentation

The full architecture notes, the install engine's four safety rules, why the width is a percentage
rather than a pixel count, why disabling a skill *moves its directory*, why the 1006 named UI
adjustments are generated rather than hand-written, and the pitfalls hit while building this
(sharing a trailing combinator across a comma selector, `min-height:0` collapsing a sticky footer,
a backtick inside a CSS comment truncating a whole stylesheet, …) are in
[docs/设计要点.md](docs/设计要点.md) (Chinese).

## Development

```powershell
node tools/build-client.mjs        # writes lib/client.js (rerun after editing src/client/)
npm test                           # fourteen suites, 1520 assertions
node tools/preview.mjs             # render the real panel and screenshot it (light + dark)
node tools/preview.mjs --measure   # print computed styles for the key elements
node tools/check-width-live.mjs    # measure widths in real Chrome (after touching width rules)
```

> `lib/client.js` is a **committed build artifact** — the target machine has no toolchain, so `lib/`
> must be committed. **Rebuild it in the same commit that changes `src/client/`**, or
> `test/client-bundle.mjs` fails.

No runtime dependencies; `@deepseek-ai/dsh-llm` and `@deepseek-ai/schemastery` are host-provided peers.

## Differences from upstream

| | Upstream | This fork |
| --- | --- | --- |
| Seats | three (incl. the composer strip) | **two** (`main` + `sidebar.panellist`) |
| Directory / package / bundle id | `dsh-echocat-skill-panel` | `dsh-useof-skill-panel` |
| Loader entry id | `skill-report` | `skill-report-use` |
| Client panel key | `skill-report` | `skill-report-use` |
| HTTP routes | `/api/skill-report/*` | `/api/skill-report-use/*` |
| CSS marker | `data-plugin="dsh-echocat-skill-panel"` | `data-plugin="dsh-useof-skill-panel"` |
| State directory | `~/.dsh/skill-report/` | `~/.dsh/skill-report-use/` |

**Kept exactly as upstream:** the per-skill provenance filename `.echocat.json` (it is a data
format, not an identity marker — renaming it would orphan the history of anyone who already
installed a skill), and the version-check targets in `src/release.js` (they still point at the
upstream npm package and GitHub releases, since this fork publishes no npm package).

## License

MIT, see [LICENSE](LICENSE). Copyright (c) 2026 dsh-skill-report contributors.
