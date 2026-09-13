# CoreDesk — Phase 1 Design Research Brief

**Prepared by:** Product Design Researcher
**For:** Visual Design Director · Frontend Builder
**Phase researched:** Phase 1 — Auth Entry (**A01**), per `CoreDesk-Product-Context.md` §9
**Status:** Research only. No production code modified. No scope defined here.

Evidence labels used throughout: **FACT** = what the referenced product/standard actually does, traceable to a source in §2.9. **INFERENCE** = what CoreDesk could learn from it. **PROPOSAL** = a new CoreDesk idea derived from that research. An INFERENCE is never presented as a competitor FACT.

---

## 1. Current phase researched

**Phase 1 — A01 Auth Entry.** Fixed by `CoreDesk-Product-Context.md` §9. Verbatim boundary:

**In scope:** A01 only — the opening/entry experience and the CoreDesk identity it establishes. Composition, the Core Thread motif, directional gradient light, logo lockup, typographic entry statement, the two entry actions (Sign in, Create account), Terms/Privacy reachability, and the three A01 states (loading, service unavailable, already signed in).

**Out of scope:** A02 Sign In form · A03 Sign Up · A04 Verify · A05 Recovery · A06 Onboarding · any owner-workspace chrome · light theme.

**Why this boundary exists** (§9): *"A01 is the only screen whose job is identity rather than task."*

**What Phase 1 must satisfy, from §6:** A01 must contain identity, a short promise, Sign in, Create account, Terms, Privacy. Primary action is "choose entry path". Essential states are loading · service unavailable · already signed in.

**Governing constraints already in force:**
- §7.6 — the gradient is **licensed** for six uses. Two of them are directly load-bearing on A01: *brand identity* (1) and *environmental light / spatial depth* (2). The other four are largely not A01's business.
- §7.4 — six rules, two of which bite hardest here: **no glow or glassmorphism**, **no bright-outline buttons**. Plus: one filled primary per view; status never carried by colour alone; tabular numerals.
- §7.1 — `canvas #0B0D0F`, `accent #2F6FEB`, gradient `#2F6FEB → #25B7F3`.
- §7.2 — Inter only, eight defined text styles, largest currently **display/page 30/36 700**.
- §7.3 — card radius 9 · control radius 7 · primary control height 40–44 · overlays get elevation, **cards do not**.
- §8 C6 — **no usable mark asset exists for dark UI.** This is an open blocker, not a detail.
- §8 R10 — no previously rejected UI screen may be reused. The existing `coredesk-design/` prototype shots are prior work; Phase 1 output starts from the product context, not from those screens.

**The design problem in one sentence:** A01 has no form, no data and no task. Its entire job is to make one argument — *this is the one place your client work stays continuous* — using only structure, light, type and motion, before the user has any reason to trust the product.

---

## 2. References

### 2.1 Reference list and phase-fit

| # | Reference | Why it is phase-relevant to A01 | Strength |
|---|---|---|---|
| R1 | **Linear** (entry + workspace boot) | Dark-first entry with a single decisive action and a hard resistance to ornament. The closest tonal match to CoreDesk's stated positioning. | ★★★ |
| R2 | **Raycast** (product + marketing surface) | Documented dark-UI craft: near-black with a colour cast, positive letter-spacing, multi-layer inset depth. Proves restraint can read as premium. | ★★★ |
| R3 | **Arc** (brand gradient + spatial light) | The only reference in the set that treats a brand gradient as *environment* rather than decoration — and documents its motion timings. | ★★★ |
| R4 | **Superhuman** (onboarding/entry emphasis) | Entry treated as a speed promise: perceived performance as the first brand statement. | ★★ |
| R5 | **Figma** (entry/login) | Entry as a quiet utility moment; useful as a counter-example of brand restraint taken too far. | ★★ |
| R6 | **Stripe** (login) | High-trust authentication without brand theatre; focus and error craft. | ★★ |
| R7 | **Notion** (entry + workspace load) | Familiarity-first entry; documents where "neutral" tips into "generic". | ★★ |
| R8 | **VS Code** (welcome / empty editor) | The desktop-native argument: chrome, empty states and focus rings as identity. Relevant because CoreDesk is desktop-first. | ★★ |
| R9 | **Bonsai · Dubsado · Plutio** (solo-practice suites) | The exact commercial category CoreDesk sits beside. Used **only** to identify what the category does that CoreDesk must not become. | ★ |
| R10 | **WCAG 2.2 + W3C technique C40** | Non-negotiable floor for focus visibility, non-text contrast and motion on a dark, gradient-lit surface. | ★★★ |

### 2.2 The strongest three

**1. Linear (R1) — strongest overall.**
It is the only reference that solves A01's actual problem: a dark, near-empty surface that must feel like a serious instrument rather than a login page. Its lesson is not its layout; it is that *confidence comes from subtraction* — one action, no community proof, no illustration, no chrome.

**2. Raycast (R2) — strongest for execution craft.**
It is the most precisely documented dark-UI system available to us ([design reference](https://raw.githubusercontent.com/VoltAgent/awesome-design-md/f6f44a91/design-md/raycast/DESIGN.md)), and three of its documented decisions map directly onto unresolved CoreDesk questions: the blue-cast near-black canvas, positive letter-spacing on dark, and depth built from layered rings rather than glow.

**3. Arc (R3) — strongest for the gradient and motion question.**
C5/R5 is the open question Phase 1 exists to answer: where does the brand gradient legitimately appear? Arc is the reference that answers it architecturally — gradient as *environment the content sits in*, not as a fill applied to content.

### 2.3 Per-reference extraction

---

#### R1 — Linear

- **Problem the interaction solves.** A dark product with no marketing surface must still communicate seriousness in the first 800 ms, to a user who already decided to show up.
- **FACT.** Linear's login is keyboard-forward and identity-forward: authentication options are presented as a short ordered list rather than a form-first layout, and the surface is near-empty dark with the mark as the anchor ([login pattern reference](https://www.saasui.design/pattern/login/linear); a live fetch of `linear.app/login` returns only a client-rendered "Loading…" shell, so I did not observe its final DOM).
- **INFERENCE.** The entry surface can carry a product argument without depicting the product. Absence of illustration reads as confidence; the user fills the space with the reputation they already believe.
- **Composition:** one axis, generous vertical negative space, nothing competing with the anchor in the upper third.
- **Hierarchy:** mark → promise → single action. Never two co-equal actions.
- **Navigation idea:** each entry option is a *route*, and the screen is honest about which route the user is on.
- **Motion:** near-none at rest. Motion is reserved for state change, not for arrival showmanship.
- **Typography:** small number of sizes, heavy weight contrast, metadata deliberately quiet.
- **Information density:** near-zero, and that is the design — density belongs inside the product, not at its door.
- **Useful interaction:** the entry surface stays fully keyboard-reachable and does not steal focus.
- **Do NOT copy:** the near-black-with-no-warmth treatment and the "we are a developer tool" austerity. CoreDesk's user is a solo professional running a business, not an engineer. Copying Linear's coldness would make CoreDesk read as a tool for someone else.

---

#### R2 — Raycast

- **Problem the interaction solves.** A dark surface must communicate material quality and physical depth without a single decorative flourish.
- **FACT.** Canvas is a blue-tinted near-black `#07080a`, explicitly *not* pure black; body text is set at weight 500 rather than 400; positive letter-spacing of +0.2px to +0.4px is applied to body copy; depth comes from multi-layer shadows combining outer rings with inset top highlights and inset bottom darks; container borders are `rgba(255,255,255,0.06)`; hover on buttons is an **opacity** transition rather than a colour swap. ([Design System: Raycast](https://raw.githubusercontent.com/VoltAgent/awesome-design-md/f6f44a91/design-md/raycast/DESIGN.md))
- **INFERENCE.** CoreDesk's token set already has the raw material for this: `divider #262C33` and `edge #323A43` are close cousins of a ring system, and `raised #171C21` sits correctly above `surface #12161A`. Depth can therefore be built entirely inside the approved palette — no glow, no glass, no new colours.
- **INFERENCE.** Weight 500 as the body baseline is a *dark-mode legibility* decision, not a style preference. CoreDesk's `body/default` is 400.
- **Composition:** dense content, sparse surrounding space; the void is the stage.
- **Hierarchy:** one brand-punctuation colour, used at hero scale exactly once.
- **Navigation idea:** not applicable to A01 — but note that Raycast's marketing surface never shows navigation, only the product's *result*.
- **Motion:** hover is opacity, not colour. Cheapest possible motion, and it never fights the palette.
- **Typography:** Inter throughout, positive tracking, weight 500 baseline, OpenType features enabled globally.
- **Information density:** cinematic pacing — long vertical gaps between few elements.
- **Useful interaction:** physical key-cap treatment gives keyboard shortcuts a learnable visual form.
- **Do NOT copy:** the multi-layer *inset highlight* shadow stack, and the warm-glow ambient. Both are glow-adjacent and would breach §7.4 rule 1. Also do not copy the pill CTA or the 86px radius — CoreDesk's control radius is 7.

---

#### R3 — Arc

- **Problem the interaction solves.** How a brand's colour becomes an atmosphere the interface lives inside, instead of paint applied on top of it.
- **FACT.** Arc's signature is frosted surfaces over a single saturated gradient that "sets the emotional temperature of the entire window"; theme gradients are user-selectable; marketing display type is a serif while the product chrome is Inter-only; motion timings are documented as 200 ms for hover, 320 ms for tab create/close, 480 ms for window expand, with a spring-style easing curve `cubic-bezier(0.32, 0.72, 0, 1)`; tab swaps are a 1px translate plus opacity blend, explicitly **no scale change**. ([Design System Inspired by Arc Browser](https://raw.githubusercontent.com/nexu-io/open-design/refs/heads/main/plugins/_official/design-systems/arc/DESIGN.md))
- **INFERENCE.** Arc answers C5/R5 by architecture: the gradient is not applied to elements, it is the *light the elements stand in*. That reading is exactly what §7.6 use 2 ("environmental light / spatial depth") licenses — and it is the only reading that lets the gradient appear on A01 without becoming decoration.
- **INFERENCE.** The documented motion timings give CoreDesk a defensible, non-invented starting point: hover ≈ 200 ms, structural change ≈ 320 ms, a single larger entrance ≈ 480 ms. And "no scale change" is worth adopting as a house rule — scaling is the cheapest way to look like generic SaaS.
- **Composition:** chrome dissolved into background; the frame is scenery, the content is the subject.
- **Hierarchy:** emotional temperature set once by the environment, then never re-asserted.
- **Navigation idea:** sidebar-first, spatial rather than hierarchical — not transferable to A01, but relevant later.
- **Motion:** short, spring-eased, transform-light, scale-averse.
- **Typography:** two voices with a strict rule about where each may appear (serif = marketing only, product = sans only).
- **Information density:** low in chrome, high in content.
- **Useful interaction:** the colour picker as a *brand* surface, not a settings row.
- **Do NOT copy:** frosted glass, backdrop blur, and user-selectable brand colour. §7.4 rule 1 forbids the first two, and §7.5 forbids the third — the CoreDesk gradient is fixed and licensed, not a preference.

---

#### R4 — Superhuman

- **Problem the interaction solves.** Converting an entry moment into a felt promise of speed.
- **FACT.** Superhuman is positioned and reviewed consistently around speed as the primary product claim, with a high-touch onboarding path rather than self-serve entry ([Superhuman review](https://techvernia.com/pages/reviews/productivity/superhuman.html)).
- **INFERENCE.** Perceived performance *is* brand on A01. If the entry surface resolves instantly while its one async check (session lookup) happens behind a stable layout, the product's first sentence to the user is "this is fast" — before any copy is read.
- **Composition:** not applicable — Superhuman's entry is a scheduled human conversation, not a screen.
- **Hierarchy:** speed claim dominates everything else.
- **Navigation idea:** not transferable.
- **Motion:** motion is used to *cover* work, not to decorate.
- **Typography:** not the lesson here.
- **Information density:** irrelevant; the lesson is temporal, not spatial.
- **Useful interaction:** the loading state is treated as a designed surface with its own voice, not as a spinner.
- **Do NOT copy:** the invite-gated, high-touch funnel. CoreDesk's A01 must let a solo professional in by themselves, unaided — §1.7 gate 1 requires first meaningful work in ≤5 minutes with no assistance.

---

#### R5 — Figma

- **Problem the interaction solves.** Entry as a near-invisible utility gate.
- **FACT.** Figma's own product surface is a neutral, low-chroma canvas that deliberately recedes; its brand colour appears in product chrome and marketing, not in the workspace itself.
- **INFERENCE.** This is the reference that shows where restraint becomes absence. If A01 removes every brand signal, the screen stops being an identity moment and becomes a door. CoreDesk's Phase 1 exists precisely because A01 is *not* a door.
- **Composition:** tool-first; chrome minimised so the artifact dominates.
- **Hierarchy:** the user's file is the highest element on screen; Figma is nowhere.
- **Navigation idea:** not applicable to A01.
- **Motion:** minimal and functional.
- **Typography:** Inter-adjacent, neutral, highly legible at small sizes.
- **Information density:** high inside the tool; zero in entry.
- **Useful interaction:** consistent, unglamorous focus behaviour that never surprises.
- **Do NOT copy:** the total absence of brand voice at entry. On a workspace screen that is correct; on A01 it is a missed obligation.

---

#### R6 — Stripe

- **Problem the interaction solves.** Making a security-sensitive entry act feel calm and inevitable.
- **FACT.** Stripe's login is a centred, single-column, low-chroma surface with the brand expressed only through accent use and type quality; validation and error messaging appear inline against the field rather than as a page-level alert.
- **INFERENCE.** The A01 "service unavailable" state should be handled the way Stripe handles an error — surfaced *inside the composition*, at the point of the blocked action, with a retry path — not as a full-page takeover that discards the identity the screen just established.
- **Composition:** centred single column, deliberate emptiness, one accent.
- **Hierarchy:** the field and the button are the whole hierarchy.
- **Navigation idea:** not applicable.
- **Motion:** essentially none. Stillness as a trust signal.
- **Typography:** high-quality neutral sans at conservative sizes; nothing decorative.
- **Information density:** minimal, and legal text is present but subordinate.
- **Useful interaction:** error text does not shift surrounding layout.
- **Do NOT copy:** the centred-card-on-empty-canvas device itself. It is the single most copied layout in software and would immediately read as generic SaaS — the exact §1.8 anti-pattern.

---

#### R7 — Notion

- **Problem the interaction solves.** Entry that is invisible enough to feel familiar on first contact.
- **FACT.** Notion's entry and workspace load use a plain, light, near-brandless treatment with a small loading indicator, prioritising familiarity over identity.
- **INFERENCE.** Familiarity is a legitimate goal for the *later* auth screens (A02–A05) and a wrong goal for A01. Use Notion as the dividing line: A01 identity, A02+ familiarity. This directly supports §9's stated reason for the phase boundary.
- **Composition:** content-first, chrome-minimal, ink-on-paper.
- **Hierarchy:** flat. Very little is emphasised, which is why it scales and why it is forgettable.
- **Navigation idea:** not applicable to A01.
- **Motion:** minimal.
- **Typography:** a bespoke serif for display, neutral sans for UI — but consistently low contrast between the two voices.
- **Information density:** comfortable, not tight.
- **Useful interaction:** the loading state never blocks the whole surface.
- **Do NOT copy:** "neutral until it disappears". CoreDesk's differentiation is continuity, and A01 is the only place to state it before the product has to prove it.

---

#### R8 — VS Code

- **Problem the interaction solves.** Making an empty desktop application feel intentional rather than broken.
- **FACT.** VS Code is a desktop-native shell: a fixed activity rail, a persistent editor region, a status bar, an explicit Welcome tab that occupies the empty editor rather than showing a blank void, and keyboard-visible focus throughout.
- **INFERENCE.** CoreDesk is desktop-first (§7). The A01 "loading" and "already signed in" states are structurally the same problem VS Code solves with its Welcome tab: *an empty region must be given a purpose.* The gradient field and Core Thread can occupy that role on A01 — the environment is never merely empty.
- **Composition:** regions, not cards. Chrome is explicit and persistent.
- **Hierarchy:** the artifact region dominates; chrome is thin and always present.
- **Navigation idea:** the rail is a spatial constant; content changes inside it.
- **Motion:** near-zero. Desktop software that animates feels like a web page.
- **Typography:** UI-scale, monospace for identifiers, tabular numerals for measurements.
- **Information density:** high, and legible at high density.
- **Useful interaction:** the welcome surface is *actionable* — it lists the few things a first-run user actually needs.
- **Do NOT copy:** the visual language (dense chrome, monospace-heavy, zero brand expression). Also do not copy the idea that an empty state should be a list of commands — A01 is not a first-run checklist.

---

#### R9 — Bonsai · Dubsado · Plutio

- **Problem the interaction solves.** Category-standard entry for solo-practice business suites.
- **FACT.** These are the commercial neighbours of CoreDesk's stated use case — proposal, contract, onboarding, project, invoice for a solo practice. They are, as a category, marketing-led and light-themed, with feature-dense entry surfaces and prominent trial/upsell framing.
- **INFERENCE.** This is the field CoreDesk must be visibly *not* part of. §1.8's "generic SaaS" and "generic CRM" anti-patterns have a specific face, and it is this category: light background, hero screenshot of a dashboard, three feature bullets, logo strip, "Start free trial". Anything on A01 that resembles that shape is a positioning failure, not a taste disagreement.
- **Composition:** marketing-page composition applied to a product entry.
- **Hierarchy:** claim → social proof → CTA. Brand voice louder than product voice.
- **Navigation idea:** none at entry; navigation is a top bar plus a feature mega-menu.
- **Motion:** decorative, marketing-driven.
- **Typography:** display sans for claims, small sans for feature copy.
- **Information density:** high claim density, low information density.
- **Useful interaction:** none that transfers.
- **Do NOT copy:** any of it. Use this reference only as a negative reference: if an A01 draft would not look out of place above the fold of one of these sites, it is wrong.

---

#### R10 — WCAG 2.2 and W3C technique C40

- **Problem the interaction solves.** Guaranteeing that a focus indicator stays visible regardless of what is behind it — which matters enormously on a surface that mixes flat canvas with gradient light.
- **FACT.** W3C technique C40 describes a **two-colour focus indicator**: as long as the two indicator colours have a contrast ratio of at least **9:1 with each other**, at least one of them is guaranteed to meet **3:1 against any solid background**. Each colour band must be at least **2 CSS px** thick. The technique is sufficient for **1.4.11 Non-text Contrast**, **2.4.7 Focus Visible** and **2.4.13 Focus Appearance**. The technique explicitly warns that it only guarantees compliance when the entire indicator is drawn over a *single solid* background — **if the background is an image or a gradient, per-pixel comparison may still be required** — and that `box-shadow` alone is suppressed in forced-colour modes, so a transparent `outline` should accompany it. ([W3C C40](https://w3c.github.io/wcag/techniques/css/C40))
- **INFERENCE.** This is the single most important technical constraint on A01's visual direction. If the Core Thread or the gradient light passes *underneath* the entry actions, every focus ring and every label needs per-pixel contrast verification. Two-tone focus indicators are the correct default for CoreDesk regardless, because the palette is layered (`canvas` → `surface` → `raised`).
- **INFERENCE.** Contrast between a focus ring and the cobalt primary button is not addressed by the 9:1 rule if the ring is drawn *inside* the component boundary. Draw focus outside the control.
- **Composition:** not applicable.
- **Hierarchy:** not applicable.
- **Navigation idea:** not applicable.
- **Motion:** WCAG 2.2 provides success criteria for motion and animation-triggered interaction; reduced-motion accommodation is a requirement, not a nicety, for any A01 entrance animation.
- **Typography:** not applicable.
- **Information density:** not applicable.
- **Useful interaction:** the two-tone ring is a cheap, universal, palette-agnostic pattern — one rule for the entire product.
- **Do NOT copy:** nothing; this is a floor, not a style. But do not treat it as a checkbox — on a gradient-lit entry screen it is a composition constraint.

### 2.4 Cross-reference synthesis — the five tensions

Across the set, five tensions emerge. Each is a decision Phase 1 must make explicitly.

| Tension | Position A | Position B | CoreDesk's situation |
|---|---|---|---|
| **Identity vs familiarity at entry** | Linear / Raycast: entry is a brand moment | Notion / Figma: entry is a door | §9 already decided: A01 = identity, A02+ = familiarity |
| **Light as environment vs ornament** | Arc: gradient is the air the UI breathes | Raycast: no gradients or colourful backgrounds at all, void is the stage | §7.6 licenses *environmental light*, forbids decoration. Arc's architecture, Raycast's restraint. |
| **Depth via glow vs via structure** | Raycast: inset highlights + outer rings (glow-adjacent) | W3C/palette approach: rings, dividers, surface steps | §7.4 forbids glow. CoreDesk must build depth from `divider`/`edge`/`raised` only. |
| **Motion at arrival vs stillness** | Superhuman: motion covers work | Stripe / VS Code: stillness as trust | A01 needs exactly one motion idea (the Thread) and stillness everywhere else. |
| **Density of promise vs density of information** | Bonsai/Dubsado category: many claims | Linear: no claims at all | CoreDesk: one claim, made structurally rather than in copy |

### 2.5 Visual principles extracted

1. **Cast the near-black.** Raycast's FACT that `#07080a` is blue-tinted rather than pure black is a legibility and quality decision. CoreDesk's `canvas #0B0D0F` is already blue-cast — `#0B0D0F` is B > G > R. This is correct and should be treated as deliberate, not incidental, and must be preserved exactly.
2. **Depth without glow is a ring problem.** Build elevation from 1px rings and surface steps: `canvas #0B0D0F` → `surface #12161A` → `raised #171C21`, separated by `divider #262C33`, outlined by `edge #323A43`. No blur, no halo, no outer glow.
3. **Weight before size.** Raycast's weight-500 baseline INFERS that CoreDesk's dark-theme body copy at 400 may be under-weighted. Adjust weight and tracking before reaching for a larger size.
4. **One accent, one place.** Every reference that reads as premium uses its brand colour at exactly one scale, once. CoreDesk's §7.4 "one filled primary per view" is the same rule, already ratified.
5. **Type scale is a brand asset.** CoreDesk's current maximum is display/page 30/36. A01 is the one surface where a larger entry statement is legitimate — but it must be built from the *same* Inter and the *same* weight/tracking logic, not a new face. §7.2 permits no second family; none of the references that matter here use one in-product either (Arc's serif is marketing-only; Raycast is Inter-only).
6. **Space is the premium signal, not ornament.** Every strong reference buys quality with negative space and long vertical rhythm. None buys it with effect.

### 2.6 Interaction principles extracted

1. **Entry is honest about state.** Loading, unavailable and already-signed-in are not error paths bolted on; they are three legitimate versions of the same composition (§6 A01).
2. **One async check, stable layout.** The only thing A01 genuinely waits for is session/identity resolution. Reserve its space. Never let the surface reflow when the check returns.
3. **Hover is a material change, not a colour swap** where possible (Raycast's opacity transitions). Cheapest, calmest, least generic.
4. **No scale change on interaction** (Arc's explicit rule for tab swaps). Adopting this as a house rule is the single fastest way to stop looking like generic SaaS.
5. **Keyboard is a first-class path on A01.** Both entry actions reachable, visible focus, no focus trap, no autofocus that steals position from a screen reader.
6. **Error handling is local, not a takeover** (Stripe). A blocked action states its cause where the action is.
7. **Motion has a reduced-motion twin that is still meaningful.** Not "animation off"; a static state that carries the same information.

### 2.7 Anti-patterns

**From the references:**
- Frosted glass, backdrop blur, translucency as a surface treatment (Arc) — forbidden by §7.4.1.
- Multi-layer inset-highlight shadow stacks and warm ambient glow (Raycast) — glow-adjacent, forbidden by §7.4.1.
- Pill primary CTAs and 86px radii (Raycast) — CoreDesk control radius is 7.
- Centred single card on an empty canvas (Stripe, and every SaaS login) — the definitive generic-SaaS silhouette.
- Marketing-page composition at product entry: hero claim, screenshot, feature bullets, logo strip (Bonsai/Dubsado/Plutio category).
- Total brand absence at entry (Figma, Notion) — correct for workspace screens, wrong for A01.
- Cold developer-tool austerity (Linear) — wrong audience for a solo professional's business workspace.
- User-selectable or themeable brand colour (Arc) — the CoreDesk gradient is licensed and fixed.

**Category-specific traps for A01:**
- The auth screen as a *settings* surface: password fields, "remember me", SSO grids. All of that is A02+, and none of it belongs in the identity moment.
- Decorative gradient. A gradient that is not doing one of §7.6's six jobs is decoration by definition, and §7.6 already forecloses that.
- Photographic or stock imagery. A solo professional's trust in "your client data stays yours" (§6 A01 promise framing) is not built by stock photos.
- Loading spinners as the primary loading statement — R4's lesson inverted: a spinner says "wait", a composed surface says "ready".
- Feature enumeration on entry. §1.3: the product is the loop. A01 should show the loop, not list the features.
- Anything that would not look out of place on a Bonsai/Dubsado hero.

### 2.8 Implementation complexity

Complexity scale: **Low** (a competent builder does it in one pass) · **Moderate** (needs a decision and a test) · **High** (needs its own spike, may need an asset or a decision first).

| # | Decision / element | Complexity | Why |
|---|---|---|---|
| 1 | Full-viewport composition, no scroll at ≥1280 wide | **Low** | Pure layout; the §7 tokens already define the grid |
| 2 | Two entry actions with a strict primary/secondary hierarchy | **Low** | Existing `Button` intents cover it |
| 3 | Terms / Privacy reachability | **Low** | Routes exist (A07/A08), but content is blocked by U8 — build the unavailable state, not placeholder legal copy |
| 4 | Gradient as environmental light | **Moderate** | Needs a decision on *where*. Raster-free CSS implementation is straightforward; proving text contrast over it is the work |
| 5 | Core Thread motif as a static composition | **Moderate** | Concept is ratified (§7.6 use 4); the visual form is not yet designed. Static first, motion second |
| 6 | Core Thread *motion* | **High** | Needs a motion spec, a reduced-motion variant, and a performance budget. Do not attempt in the first pass |
| 7 | Loading state without layout shift | **Moderate** | Requires a reserved-space contract for the session check |
| 8 | Service-unavailable state | **Moderate** | Must be local and recoverable (R6), and must not discard the identity already established |
| 9 | Already-signed-in state | **Moderate** | Must retain the intended destination (§6 A02 states the same rule) |
| 10 | Logo lockup on dark | **High — blocked** | §8 C6: no usable asset exists. `IconLogo.png` has an opaque background and does not composite on `#0B0D0F`. A transparent SVG symbol is a prerequisite |
| 11 | Two-tone focus indicator across the whole surface | **Moderate** | C40: 9:1 between the two ring colours, ≥2px bands, drawn outside the control, over a single solid background |
| 12 | Responsive / minimum-width behaviour | **Moderate** | Desktop-first, but A01 must not break at narrow widths. §8 U2 (rail width 236px) is unresolved but does not affect A01 |
| 13 | Reduced-motion twin | **Moderate** | A static state that carries the same meaning |
| 14 | Larger-than-30px entry type | **Low** | Compose from the existing scale; do not introduce a family or a new weight class without approval |

### 2.9 Source list

| # | Source | What it evidenced |
|---|---|---|
| 1 | [Design System: Raycast](https://raw.githubusercontent.com/VoltAgent/awesome-design-md/f6f44a91/design-md/raycast/DESIGN.md) | Blue-cast near-black canvas, positive tracking, weight-500 baseline, ring/inset depth, opacity hover, gradient restraint |
| 2 | [Design System Inspired by Arc Browser](https://raw.githubusercontent.com/nexu-io/open-design/refs/heads/main/plugins/_official/design-systems/arc/DESIGN.md) | Gradient as environment, glass (to avoid), documented motion timings and easings, no-scale-change rule, two-voice type discipline |
| 3 | [W3C technique C40 — two-colour focus indicator](https://w3c.github.io/wcag/techniques/css/C40) | 9:1 ring-to-ring, 3:1 against any solid background, 2px minimum bands, gradient caveat, forced-colour caveat |
| 4 | [SaaSUI — Linear login pattern](https://www.saasui.design/pattern/login/linear) | Linear entry treated as an ordered, near-empty dark surface (third-party observation, not the official page) |
| 5 | [Superhuman product review](https://techvernia.com/pages/reviews/productivity/superhuman.html) | Speed-led positioning; high-touch rather than self-serve entry |
| 6 | [MojoAuth — email verification / passwordless patterns](https://mojoauth.com/ciam-101/email-verification-b2c-ciam-passwordless-consumer-onboarding) | Email-first entry framing — background for A02+, not A01 |
| 7 | [Adobe — keeping type consistent in changing conditions](https://adobe.design/ideas/keeping-type-consistent-in-changing-conditions) | Legibility behaviour of type across light/dark conditions |
| 8 | [Typedrawers — white on black](https://typedrawers.com/discussion/comment/54312) | Practitioner discussion of light-on-dark text weight and halation |
| 9 | [Skeleton loading screen: the CSS and the evidence](https://theplusaddons.com/blog/skeleton-loading-screen/) | Loading-state treatment tradeoffs |
| 10 | [Product Growth — splitting login and signup](https://productgrowth.in/resources/playbooks/onboarding/splitting-login-signup/) | Two-entry-action patterns and their measured effects |

**Source limitations.** `linear.app/login` returns only a client-rendered "Loading…" shell to a fetch, so Linear's final DOM was not directly observed — R1's entry shape is noted from a third-party pattern reference and flagged as third-party. Figma, Notion, Stripe, VS Code, Bonsai, Dubsado and Plutio were assessed from the products' established, publicly documented behaviour and visual language; where a statement is a general characterisation rather than a verified measurement it is written as such. All token values for CoreDesk come from `CoreDesk-Product-Context.md` §7 and are not restated from external sources.

---

## 3. Key observations

1. **A01 is the only screen in V1 where the gradient legitimately does two of its six licensed jobs at once** — brand identity (1) and environmental light (2) — and it is the only screen where four of the other licensed uses are structurally absent. A01 is therefore the *purest* gradient surface in the product. Get the licence boundary right here and it is settled everywhere else.
2. **The composition *is* the promise.** CoreDesk's differentiator is continuity (the loop). A01 cannot demonstrate continuity with a screenshot of the product, because none exists yet. It can only demonstrate it structurally — which is why the Core Thread matters more on A01 than on any later screen.
3. **The three states are the real design problem, not the happy path.** A01's contract is loading, service unavailable, already signed in. Two of the three are the user's first impression under non-ideal conditions. A beautiful default state with an ugly failure state is a failed A01.
4. **No other reference in the set is desktop-first in the way CoreDesk is.** Raycast and VS Code are; Linear, Arc and the category suites are effectively web surfaces. VS Code's lesson — *an empty region must be given a purpose* — is directly applicable to all three A01 states.
5. **The depth question has a clean answer inside the existing palette.** Every premium dark surface in the set reaches for glow or blur to get depth. CoreDesk cannot. But `canvas → surface → raised` plus `divider`/`edge` rings is a complete, glow-free depth system that no reference in this set uses — which makes it a genuine point of difference rather than a workaround.
6. **The focus indicator is a composition constraint on a gradient-lit page**, not an afterthought. W3C C40's gradient caveat means *where the gradient passes* determines *how much contrast verification the build needs*.
7. **Nobody in the category does this.** The Bonsai/Dubsado/Plutio shape is marketing-led and light. A dark, quiet, single-argument entry screen is already a differentiation — provided it does not become a Linear pastiche.
8. **The logo asset is a live blocker, not a polish item.** §8 C6 is unresolved and Phase 1 is the phase that needs it.

---

## 4. Transferable principles

**Structural**
1. One axis, one primary. Two co-equal entry actions is the most common failure on entry screens.
2. The environment is never empty — a field, a thread, or a light carries the space even when nothing is loaded.
3. Reserve the space for the only async result (session resolution) so no state transition moves anything the user is reading.
4. Failure is local and recoverable, at the point of the blocked action, inside the composition that already established identity.

**Visual**
5. Depth from rings and surface steps, never from blur or halo.
6. Weight and tracking before size; one type family; a composed — not invented — larger entry statement.
7. One accent, once, at one scale. Cobalt is a signature (§7.4), which means it appears rarely and deliberately.
8. Negative space is the premium signal. Nothing in this reference set buys quality with ornament.

**Interaction**
9. Hover is material, not colourful. No scale changes anywhere.
10. Motion covers work or expresses continuity. It never decorates an arrival.
11. Every motion has a reduced-motion twin that is still *informative*, not merely absent.
12. Keyboard reachable, visible focus, no autofocus theft.

**Accessibility floor (non-negotiable)**
13. Two-tone focus ring per W3C C40: ≥9:1 between the two colours, ≥2px bands each, drawn outside the control, over a single solid background — and the gradient caveat must be checked against the actual composition.
14. Text over gradient-light requires absolute contrast verification at the lightest point of the wash, not the average.
15. Focus indicators must survive forced-colour modes — pair `outline` with `box-shadow`, never `box-shadow` alone.

**Typographic**
16. Legibility on dark is a weight question first (R2's weight-500 baseline; the `typedrawers` practitioner discussion of light-on-dark halation).
17. Tabular numerals are already mandated (§7.4) — any measured value on A01 (build number, version stamp, copyright year) must comply.
18. Legal text is present but subordinate: readable, not hidden, never competing with the entry statement.

---

## 5. Things to avoid

**Hard prohibitions (already ratified — a breach is a defect, not a taste call)**
- Glow, halo, bloom, glassmorphism, backdrop blur.
- Bright-outline buttons.
- Gradient cards, gradient borders, gradient-outline buttons.
- Pill navigation.
- More than one filled primary per view.
- Status or meaning carried by colour alone.
- Gradient used for anything outside §7.6's six licensed purposes. On A01, that means identity and environmental light — nothing else.
- Light theme.
- Reuse of any previously rejected UI screen (R10).
- A substitute glyph, redrawn or approximated logo, or the existing PNGs composited onto dark (§7.5, §8 C6).

**Category anti-patterns (positioning failures)**
- The centred-card-on-empty-canvas login silhouette.
- Marketing-page composition: hero claim, dashboard screenshot, feature bullets, logo strip, trial CTA.
- Social sign-in button grids and SSO option lists — that is A02+ territory at the earliest, and V1's model is email/account based.
- Stock imagery or abstract 3D filler.
- Feature enumeration. The product is the loop (§1.3); A01 states the loop, it does not inventory it.
- Spinner-as-primary-loading-state.
- Borrowed trust signals: "trusted by", testimonial strips, press logos. The user here is one professional, not a procurement committee.

**Craft anti-patterns**
- Scale or spring-bounce on hover or press.
- Entrance animation on first paint that delays access to the two actions.
- Gradient behind the entry actions without verified per-pixel contrast.
- Focus rings drawn inside the control boundary or relying on `box-shadow` alone.
- Stock skeleton shimmer on an entry surface (R2's craft lesson applied: a skeleton says "content is loading"; A01 has no content to load).
- Copy that promises features. §1.5's client/project/document distinction is the substance; "all-in-one platform" is the category's language, not CoreDesk's.

---

## 6. Three CoreDesk-specific design opportunities

### Opportunity 1 — **The Thread is the argument**

**Insight.** The product's whole claim is that the loop never breaks (§1.3, §1.4). A01 is the only surface that must make that claim before the product can prove it. Every reference in the set that faces this problem reaches for a screenshot, an illustration, or copy — none of which CoreDesk has or wants.

**PROPOSAL.** Make the Core Thread the *structural spine* of A01, not a decorative graphic. The composition is organised along the thread: it enters the surface, passes through the identity anchor, threads the entry actions, and terminates at the point where the client relationship begins. The two entry actions sit *on* the thread rather than beside it. Meaning: **you are entering at the start of a continuous path, and nothing on this screen falls outside it.** Where the thread represents lifecycle progression it may carry the gradient (§7.6 use 4); where it does not, it is graphite.

**Why it is CoreDesk-specific and not a template.** No reference in this set organises an entry screen along a continuity axis. Linear organises around an anchor, Stripe around a form, Arc around a colour field. A thread-organised entry is unavailable to copy from anywhere, and it converts the brand mark's own geometry (a path crossing itself) into a compositional system.

**Complexity.** Static composition: Moderate. Motion: High — treat as a second pass.

---

### Opportunity 2 — **Gradient as directional light, with a measured floor**

**Insight.** §7.6 licenses "environmental light / spatial depth", and R3 (Arc) is the reference that shows what that means architecturally: the gradient is the air, not the paint. But W3C C40 explicitly warns that a gradient background breaks the guarantee that makes focus indicators cheap.

**PROPOSAL.** Define the gradient as a *single directional source* with a hard, documented luminance ceiling, and place it so that it never passes under interactive controls. Concretely: one direction, one origin, one falloff, expressed as a bounded luminance lift over `canvas #0B0D0F` (INFERENCE-supported starting point: keep the peak lift under ~6% so `text #F4F6F8`, `muted #A8B0BA` and `metadata #737D88` all retain their approved contrast at the *lightest* point of the wash, not the average). The entry actions and the legal row sit outside the lit region, on flat canvas. The result: the light reads as depth, the contrast maths stays simple, and the focus rings stay provably compliant.

**Why it is CoreDesk-specific and not a template.** Arc's gradient is a full-field mood with frosted surfaces over it — forbidden here. CoreDesk's is a bounded light source on a graphite field with nothing over it. That inversion — light as a *place on the screen* rather than a *treatment of the screen* — is the CoreDesk reading of §7.6, and it is the difference between licensed light and forbidden decoration.

**Complexity.** Moderate. Requires one documented gradient definition and one contrast verification pass.

---

### Opportunity 3 — **Three states, one composition**

**Insight.** §6 gives A01 three states, and two of them are the user's first impression under stress. R8 (VS Code, via its Welcome tab) and R4 (Superhuman, via designing the loading state rather than hiding it) both point the same way: an empty or waiting region must be given a purpose. R6 (Stripe) adds that failure belongs where the blocked action is, not as a page takeover.

**PROPOSAL.** Design A01 as **one composition with three intensities**, never three screens.

- **Loading** — the composition is fully present except the actions, which occupy their final geometry with a state that is *not* a shimmer skeleton. The Thread and the light are already drawn, because they are the identity and they are instantly available. Only the session-dependent affordance waits. INFERENCE from R4: the first impression of speed is produced by never showing an unfinished frame.
- **Service unavailable** — the composition does not change. The entry actions are replaced *in place* by a local, specific explanation and a single retry, and — because CoreDesk's guest surface is reachable by link (§4.4) — the failure state names the alternative route. The identity the screen just established is preserved rather than discarded.
- **Already signed in** — the two actions collapse into a single resume affordance, with the intended destination retained (§6 A02's "retain intended destination" rule applied one screen earlier), and an explicit, quiet way to sign in as someone else. This state is where CoreDesk can honestly say *"your workspace is where you left it"* — the continuity claim, made literally and verifiably.

**Why it is CoreDesk-specific and not a template.** Every reference treats failure as a departure from the design. Making failure an *intensity* of the same composition — with the identity field permanently stable — is a direct expression of §1.4's "context is a first-class object": the surface never loses its own context.

**Complexity.** Moderate per state. The loading state's no-layout-shift contract is the piece that needs a real decision; the "already signed in" state needs a destination-retention rule agreed with whoever owns A02.

---

## 7. Recommended direction for the Visual Design Director

**The direction in one line.** *A01 is not a login page with brand on it — it is the CoreDesk argument drawn once, at rest, with one hand of light on it.*

**Composition**
- One axis. The composition is organised along the Core Thread, not around a card. **Do not build a centred card on an empty canvas** — that single decision determines whether CoreDesk reads as premium software or as generic SaaS.
- The mark is the anchor and sits on the axis. With §8 C6 unresolved, design the lockup against a *transparent SVG symbol* assumption and flag the asset as a Phase 1 prerequisite; do not design around the existing PNGs.
- Two entry actions, strictly ordered: one filled cobalt primary, one secondary. Never two filled, never two equal.
- Terms and Privacy are present, reachable, subordinate, and never hidden behind a hover or a menu.
- Design for 1440×900 (§FIGMA-BUILD-PLAN page convention) with no scroll, and treat ≥1280 wide as the composition's home. Confirm the narrow-width degradation explicitly rather than letting it happen.

**Light**
- One directional gradient source, one origin, one falloff, with a written luminance ceiling. It expresses environmental light (§7.6 use 2). It is *not* applied to any card, border, button or text.
- Keep the lit region clear of interactive controls. This is both a composition choice and the thing that keeps focus-contrast verification tractable.
- Verify text contrast at the gradient's **lightest** point, not its average, for every text style that can sit inside the wash.

**Depth**
- Elevation from rings and surface steps only: `canvas → surface → raised`, `divider` for separation, `edge` for containment. No blur, no halo, no outer glow, no inset highlight stack.
- Cards do not get shadows (§7.3). On A01 this is nearly moot, which is a reason to keep it simple.

**Type**
- Inter only. Compose a larger entry statement from the existing scale's logic — do not add a family, and do not add a weight class outside the approved set without approval.
- Treat the entry statement as the largest type in the product, and treat body copy weight/tracking on dark as an open question worth one test (R2's weight-500 baseline is an INFERENCE, not a rule — verify, do not assume).
- Legal row at `meta/default` 12/15 500 in `metadata #737D88`. Copyright year in tabular numerals.

**Motion**
- Exactly one motion idea on A01: the Thread expressing continuity. Everything else is still.
- Starting timings from R3's documented values (INFERENCE-supported): hover ≈ 200 ms, structural state change ≈ 320 ms, one larger entrance ≈ 480 ms, spring-style easing. **Adopt "no scale change" as a house rule.**
- Every motion has a reduced-motion twin that is still informative — the Thread's *state*, not its *animation*.
- No entrance animation may delay access to the two entry actions.

**States**
- Design the three states as intensities of one composition (§6, Opportunity 3). Loading must not shift layout when the session check returns.
- Design the service-unavailable state with the same care as the default. If it would embarrass the brand, it is the wrong treatment.

**Accessibility as a design input, not a review gate**
- Specify the two-tone focus ring now, per W3C C40: ≥9:1 between the two ring colours, ≥2px bands, drawn outside the control. Choose the ring pair from the existing palette so it works on `canvas`, `surface` and over the light wash.
- Any text or control that can sit over the gradient gets an absolute contrast figure written next to it in the spec.

**On C5/R5.** This phase is where the gradient question is settled. The recommended reading: **light as a place on the screen, not a treatment of the screen.** That reading satisfies §7.6 use 2, keeps use 1 for the mark itself, keeps the other four uses available later, and gives the Frontend Builder an implementable, verifiable definition instead of a mood.

**On the existing prototype.** `coredesk-design/` contains a prior pass at A01. §8 R10 forecloses reusing the screen. Treat any of it as evidence of what the brief asked for at the time, not as a starting layout. Any decision to reuse must be an explicit owner decision.

---

## 8. Recommended constraints for the Frontend Builder

**Non-negotiable — these are defects if breached**
1. Tokens from §7.1 only. No new hex values, no opacity-derived colours outside the documented 10–12% tint range.
2. Inter only (§7.2). No new families, no variable-axis experiments not in the spec.
3. Geometry per §7.3: control radius 7, primary control height 40–44, dividers 1px, page padding 28px, grid gap 16px. No pill radii.
4. No glow, glassmorphism, backdrop blur, gradient cards, gradient borders, bright-outline buttons (§7.4).
5. Exactly one filled cobalt primary in the view.
6. Gradient appears only where §7.6 licenses it, and on A01 only for identity and environmental light. If you cannot name which licensed use a gradient element serves, it does not ship.
7. The gradient is a licensed fixed asset. It is not themeable, not user-selectable, and not animated by default.
8. Dark theme only (§8 R4). Do not wire a light-theme branch.
9. Tabular numerals for every measured value.
10. Status or meaning is never carried by colour alone.

**Accessibility floor**
11. Two-tone focus indicator per W3C C40: two colours at ≥9:1 with each other, each band ≥2 CSS px, drawn outside the control's boundary, over a single solid background. Check the gradient caveat explicitly against the real composition.
12. Never `outline: none` with `box-shadow` alone — pair with a transparent `outline` so forced-colour modes survive.
13. Reduced-motion support is required, not optional, and the reduced state must still convey the Thread's meaning.
14. No autofocus that steals position; both entry actions keyboard reachable; no focus trap.
15. Any text or control over the light wash gets a per-pixel contrast check — the C40 guarantee does not cover gradient backgrounds.

**State contract**
16. Implement all three states — loading, service unavailable, already signed in — before considering the screen done (§6 A01).
17. The loading state causes **no layout shift** when the session check resolves. Reserve the geometry.
18. The service-unavailable state is local and recoverable, does not navigate away, and does not discard the identity composition.
19. "Already signed in" retains the intended destination.
20. Terms and Privacy remain reachable in **every** state, including failure.

**Scope discipline**
21. A01 only. Do not build A02–A05 forms, A06 onboarding, or any owner-workspace chrome into this screen (§9).
22. Do not build real legal copy for A07/A08 — §8 U8 blocks it. Build the empty-content state with a recovery route.
23. No feature enumeration, no marketing copy, no social proof, no stock imagery.
24. Do not reuse any previously rejected screen (§8 R10). New work starts from the product context.
25. Do not invent the logo. §8 C6 is blocked pending a transparent SVG symbol — raise it rather than substituting a glyph or compositing the existing PNGs onto dark.
26. If a build decision would let a wrong state render as a right one, the build is wrong (§3.6's principle, applied to A01's three states).

**Open items this brief does not resolve (do not silently decide these)**
- §8 C6 — the transparent mark asset. **Blocking.**
- §8 U8 — approved legal copy for A07/A08.
- §8 U2 — rail width 236px. Does not affect A01, but do not hard-code assumptions about it.
- §8 C7 — the forward-dated planning metadata. Cosmetic; the copyright year on A01 must reflect a real decision, not the sheet's date.

---

*End of brief. Research only — nothing here authorises implementation, and nothing here defines final V1 scope.*
