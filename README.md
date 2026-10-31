# Fork In the Road

A decision helper for people who want to eat something new. Say what you're tired of, how hungry you are, your budget and how adventurous you feel. It proposes one dish at a time, learns from each "no", and stops after five.

Live site: https://ssk0011.github.io/fork-in-the-road/

It runs entirely in the browser, with no backend, accounts or analytics. Settings and accepted dishes stay in `localStorage`, and "Clear my data" removes them.

## Run it

```bash
npm install
npm run dev
```

`CLAUDE.md` lists the other commands.

## Decisions the brief left open

- **Soft and hard constraints:** hard filters are rejected dishes, tired cuisines, budget and dishes accepted in the last 14 days. The hunger range and everything from a "no" reason are soft, so the final pick can relax them. Dishes that break fewer soft constraints rank higher there.
- **Reasons beat hunger:** "Not filling enough" raises the floor of the size range, even above the hunger answer. Otherwise a Peckish user could end up with nothing to show.
- **Back undoes:** Back on a dish returns to the previous dish and removes that rejection and its constraint.
- **Reason list:** six slots, two reserved, so at most four dish-specific reasons show, in the brief's table order.
- **Reload:** settings survive a reload, but a session in progress does not. Reloading returns to setup with answers filled in. Settings are saved when a session starts.
- **Setup copy:** "curry rut" only appears when Indian is selected.
- **Fonts:** bundled with the app so it makes no network calls.
- **Hosting:** GitHub Pages under `/fork-in-the-road/`, with an install manifest and no service worker.
- **Tooling:** pinned to versions that run on Node 18.17. CI uses Node 20. It runs lint, unit tests and the build, but not the browser tests.

## Next

Not built in v1:

- Live restaurant data, Places API, menu verification and delivery-app links
- Accounts, sync, sharing and group mode
- A "How was it?" follow-up and taste map (accepted dishes are already stored with a timestamp)
- AI-generated suggestions at runtime
