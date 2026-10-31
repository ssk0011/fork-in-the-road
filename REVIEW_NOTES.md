# Review notes

## Tools used

- **Skills audit:** reported before the build.
- **`frontend-design`:** set the design direction.
- **`impeccable`:** design critique in a separate subagent, in its reduced single-context mode. It didn't see the budget or adventure screens, or two desktop shots.
- **Code and security review:** one independent subagent. It covered the `code-review` and `security-review` focus areas by hand, but those commands themselves were not run.
- **`simplify`:** four cleanup subagents (reuse, simplification, efficiency, altitude).
- **Playwright and axe:** browser flow, keyboard path and accessibility checks at 390×844, plus a 320×568 check.

The reviews ran before the fixes below. Nobody re-reviewed the fixes independently, but all tests were rerun after them.

## Fixed

- Focus was lost after choosing a reason.
- Back from the yes screen left the dish hidden for 14 days.
- A double tap could skip a question or hit whatever appeared next. Clicks are now ignored for 250ms after any view change.
- Contrast lines said "than most" when only the average differed.
- The storage failure notice now shows on the yes screen too.
- Deploy workflow: Pages permissions moved to the deploy job, and actions pinned to commit hashes.
- Actions could fall below the fold at 320×568, so they're now sticky.
- Question options moved to thumb reach, and no option is preselected for new users.
- "Medium" could be misread as a heat level, so it now says "Medium richness".
- "Clear my data" shows only when there's data to clear.
- Smaller items: origin line, contrast wording, blurb on the yes screen, sheet height, green overscroll background.
- Cleanup: shared `MAX_TIRED`, region distance, progress labels and test helper. Removed unused exports and CSS.

## Skipped

- **`consecutiveNos` is derivable from `rejected.size`:** the brief names it in the session state, so it stays.
- **Discriminated union for app state:** removes a few unreachable guards, but it's a large rewrite of working code.
- **Scores recomputed during sorting:** imperceptible at 64 dishes.
- **`loadStore()` during setup render:** one cheap read, and it keeps storage as the single source of truth.
- **Infinity defaults for constraints, mapped links on the yes screen, merged `.option`/`.pick` styles:** the savings are too small to justify the extra indirection.
- **"Final pick" announcement on the empty state:** cosmetic.
- **Dish-aware line on the yes screen:** nice to have, left for later.
- **`slowMo` in Playwright:** kept, because test clicks are otherwise faster than the repeat-tap guard allows.

## Not verified

- The repeat-tap guard and sticky actions were tested in desktop Chromium only, not on a real phone or in Safari.
