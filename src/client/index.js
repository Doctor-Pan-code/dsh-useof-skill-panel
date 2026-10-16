// dsh-useof-skill-panel — browser half (client plugin).
//
// FORK OF dsh-echocat-skill-panel, with ONE deliberate difference: the composer strip is gone.
//
// The upstream plugin contributed three surfaces. This fork contributes two:
//
//   main                     the full report, in the centre column
//   sidebar.panellist        the resident glyph in the left sidebar that opens it
//
// The third — `conversation.input.dock`, the summary bar that sat above the composer and expanded
// in place — was removed at the user's request ("这个显示栏太丑了"). Both halves of it are gone: the
// rounded glass bar itself, and the `LiveRail` hairline that rode underneath it. Nothing else was
// touched: the report, the sidebar glyph, the install sheet, the background/theme system and the
// host half are all upstream code.
//
// Consequence worth stating plainly, because it is the one user-visible loss: `conversation.input.dock`
// was the ONLY seat with write access to the composer (`inputActions` + `useInput`), so it was the
// only place "click a skill to insert /name into the draft" worked. The report panel can still be
// opened and read from the sidebar, and the install sheet is still reachable from there, but the
// one-click draft insertion went away with the bar. The host half is unchanged, so nothing else
// regressed.
//
// `main` is keyed and `sidebar.panellist` is a list; the layout addresses the
// centre panel by the *same* id the sidebar entry carries, and
// `layout.selectPanel(id)` throws when no `main` entry has that key — so the two
// constants below must never diverge.

const React = require('react')
const { SkillReportPanel, SkillReportIcon } = require('./panel.js')
const {
  useSkillReport,
  refresh,
  stopPolling,
  getSnapshot,
  subscribe,
  DEFAULT_PATH,
  applySkills,
  checkForUpdates,
  getUpdates,
  clearUpdates,
  checkPluginRelease,
  useRelease,
  applyRelease,
  clearRelease,
  openExternal,
} = require('./source.js')

const h = React.createElement

/**
 * Shared address of the panel in both slots.
 *
 * Renamed from upstream's `skill-report` because BOTH plugins are installed at once and this id is
 * also the `main` slot KEY. Two `main` registrations under one key is a collision the layout cannot
 * resolve, and the sidebar would show two entries that both open the same panel. `skill-report-use`
 * keeps the two copies addressable and side by side.
 */
const PANEL_ID = 'skill-report-use'

const onRefresh = () => {
  void refresh()
}

/** Centre-column surface: the full report (it brings its own padding and shell). */
function PanelSurface() {
  const state = useSkillReport()
  return h(SkillReportPanel, { state, onRefresh })
}

/**
 * REMOVED: `StripSurface`, the composer-dock summary bar.
 *
 * Upstream this component wrapped `SkillReportStrip` for the `conversation.input.dock` seat, and
 * it was the only surface with composer write access (`inputActions` + `useInput`) — that is what
 * made "click a skill to drop /name into the draft" work. Both the component and its registration
 * are deleted here, so the bar and its `LiveRail` are never mounted at all. Leaving the component
 * in place and merely skipping the registration was rejected as an option: dead code that
 * references a removed seat is a trap for the next person to read this file.
 *
 * `SkillReportStrip` itself still exists in `./panel.js` and is still exported — it is the only
 * consumer of a large block of `sr-strip*` CSS, and the upstream test suite drives it directly.
 * Deleting the stylesheet with it is NOT safe for this fork: `panel.js` and the theme sheet are
 * shared with surfaces that are still live, and the strip rules are scoped to `.sr-strip*`
 * classes that nothing renders any more. Dead CSS, no visual effect, zero risk — left alone.
 */

const inject = ['slots']

/**
 * Register one surface, never letting a failure escape.
 *
 * `slots.inject` runs its callback on a later tick, so a throw inside it is NOT
 * covered by any try/catch around `apply` — it fails this plugin's fiber, and a
 * failed client fiber surfaces as "Failed to load plugins" for the whole page.
 * A missing panel is a much better outcome than a blank shell.
 */
function contribute(ctx, slot, options, component) {
  ctx.slots.inject(slot, () => {
    try {
      return ctx.slots.register(options, component)
    } catch (error) {
      console.error(`[dsh-useof-skill-panel] could not register into "${slot}":`, error)
      return undefined
    }
  })
}

/**
 * Client plugin body: contribute the two remaining surfaces.
 * @param ctx - client root context.
 */
function apply(ctx) {
  if (ctx?.slots === undefined) return
  contribute(ctx, 'main', { name: 'main', key: PANEL_ID }, PanelSurface)
  contribute(
    ctx,
    'sidebar.panellist',
    { name: 'sidebar.panellist', id: PANEL_ID, order: 60, label: () => '技能调用报告' },
    SkillReportIcon,
  )
  // NO `conversation.input.dock` registration — see the note above `inject`. This is the whole
  // difference between this fork and upstream.
}

// `__*` members are the seams the bundle test drives the internals through; they
// are not part of the plugin contract.
module.exports = {
  apply,
  inject,
  PANEL_ID,
  __source: {
    refresh,
    stopPolling,
    getSnapshot,
    subscribe,
    DEFAULT_PATH,
    // Exported for the test that pins the merge contract. A write response carries no provenance, and
    // adopting it wholesale is what wiped every skill's colour — a bug that shipped because nothing asserted
    // what this function does with a response that is missing fields.
    applySkills,
    checkForUpdates,
    getUpdates,
    clearUpdates,
    // The release store's own seams, so a test can drive the two version buttons without a
    // network round trip through the host.
    checkPluginRelease,
    useRelease,
    applyRelease,
    clearRelease,
    openExternal,
  },
  __api: require('./api.js'),
  __ui: require('./panel.js'),
  __install: require('./install.js'),
  __icons: require('./icons.js'),
  __theme: require('./theme.js'),
  __background: require('./background-store.js'),
}
