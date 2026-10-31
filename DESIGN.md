# Design decisions

**Concept:** a roadside sign. The name is a road-sign phrase, so the app borrows signage instead of food clichés such as cream paper, terracotta and emoji.

**Colour carries state.** There's one full-screen colour at a time:

| Colour        | Hex       | Meaning                           |
| ------------- | --------- | --------------------------------- |
| Signal yellow | `#ffc72c` | Deciding                          |
| Asphalt       | `#22252a` | Text, and the "why not?" sheet    |
| Go green      | `#0b6b4f` | The yes button and the yes screen |
| Line white    | `#fffdf4` | Text on dark colours              |

Text pairs are chosen to pass WCAG AA, and axe checks them on each screen.

**Type:** Fraunces for dish names and questions, because its soft, slightly odd serifs feel like a hand-painted menu board. Source Sans 3 for everything else, because it stays quiet at small sizes. Both are bundled.

**The memorable thing:** the dish name, as large as the screen allows. Everything else stays small and plain.

**Progress:** dashes of a road centre line, one per question or dish. They replace a progress bar and suit a journey that has a definite end.

**Layout:** one column, left-aligned, 32rem at most. Actions sit at the bottom for thumbs. The dish is centred in the space above them.

**Motion:** one short slide when a new screen arrives, plus the sheet rising. Both are off under `prefers-reduced-motion`.

**Sheet:** a native `<dialog>`, which provides the focus trap, Escape and inert page behind it.
