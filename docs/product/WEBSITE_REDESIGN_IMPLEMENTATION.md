# Syntaflow website redesign — implementation record

## Marketing website publication scope

The `master` update includes the public marketing pages, the browser sample, source assets, and browser checks. The Terms and Privacy updates cover presentation and metadata. The policy text is preserved. The workspace lockfile includes the website dependencies.

## People, projects and motion, 5 November 2026

### Audit and reference

The current stack is React 19, TypeScript 6 and Vite 8 with ordinary CSS. GSAP 3.15, `@gsap/react` and Motion for React 13 were already installed. Native CSS smooth scrolling fits the existing anchor navigation. The previous homepage contained a hero and attention capture, feature disclosures, product gallery, client-brief example, workflow, audience, roadmap, FAQ and early-access form.

The browser inspection of [Leadoff](https://www.leadoff.fr/) recorded the following computed styles at a 1280 px desktop viewport. Its introductory screen gives way to a blue display hero, then a large light editorial block. Later section headings have `line-wrapper` elements. These observations informed the type hierarchy, section rhythm and masked entrances.

| Element | Font and weight | Size | Line height | Letter spacing |
| --- | --- | --- | --- | --- |
| Hero H1 | NewTitle-Variable, 650 | 115.2 px | 118.08 px | 1.152 px |
| First H2 | NewTitle-Variable, 650 | 89.6 px | 89.6 px | 0.896 px |
| Body paragraph | GeneralSans-Variable, 500 | 18 px | 27 px | 0.54 px |
| Menu | GeneralSans-Variable, 400 | 16 px | normal | normal |
| Case-study tag | GeneralSans-Variable, 600 | 12 px | 12 px | 0.36 px |

H1, H2, menu and tags are uppercase on the reference. Syntaflow uses sentence case and tighter tracking. The closest free face chosen for the tall display shape is **Barlow Condensed SemiBold**, with the existing **Inter** for body text and controls. The [Fontsource font](https://fontsource.org/fonts/barlow-condensed) is served from `public/brand/barlow-condensed-latin-600.woff2` with its OFL license. Vite has no framework font loader. A preload, local `@font-face`, optional font display and reserved image frames avoid a late font swap or image layout change. The display scale reaches 178 px for the hero and 108 px for section titles. Body text spans 17 to 20 px, with a 1.65 line height.

Three hero directions were considered before selecting the first.

1. **Your people. Your work, together.** Names both the relationships and the work, and fits the two-line entrance.
2. Where good work brings people together.
3. A clear home for every client relationship.

The brand line remains **FROM CONTEXT TO ACTION.** Community copy refers to the client records, project history and review decisions supported by the current owner workspace. The role avatars and relationship diagram are labeled conceptual. Public community membership, a member directory and live shared workspaces require product confirmation. Their availability is not claimed. The current source and `PRODUCT_SYSTEM_REVIEW.md` support the narrower desktop description.

### Layout and colors

The order is hero (`product`), problem (`problem`), four outcome blocks (`features`), community (`community`), product gallery (`guided-preview`), three-step walkthrough and existing sample brief (`how-it-works`), FAQ (`questions`), early access (`early-access`), then the shared footer. The old `roadmap` anchor remains at the community section and the full `/roadmap` page remains available from the footer. The problem, product gallery and FAQ use light chapters among dark sections.

`home-story.css` defines `--bg` as `#07090F`, `--surface` as `#111522`, `--text` as `#F5F6FC`, `--accent-1` as brand blue `#2968F2`, `--accent-2` as cyan `#21B8D5`, `--accent-3` as indigo `#3D4DFF`, `--violet` as `#7A5CFF`, and `--glow` as `#778CFF`. A warm `#FFB187` dot is confined to the active section indicator. Light chapters redefine text, line, link and muted tokens against `#F1F3FA`.

### Motion and accessibility

- The intro lasts 900 ms, with a 1050 ms safety deadline. Its Skip control stays fixed while the panel lifts. Session storage prevents repetition in the same tab session. Reduced-motion and crawler sessions omit it, and content stays accessible throughout. It has no routing or pending-request state.
- CSS animates the hero masks over 850 ms with a 120 ms stagger, allowing the opening content to paint before the scroll library loads. GSAP is loaded on the first scroll. Scoped GSAP batches section entrances over 750 ms, advances the three-step line and adds 53 px of scroll-linked gallery travel. Motion for React handles gallery image entrances and the pausable sentence phrase. Each system owns separate elements.
- The fixed ambient layer has three radial color fields, with transform-only drift at 25, 32 and 38 seconds. One filtered parent changes hue with section progress. Grain is a static 128 px PNG texture in `public/brand/grain.png`. Mobile uses two naturally soft radial fields and omits the extra blur pass. Visibility changes pause the drift and rotating sentence.
- CSS scroll-driven animation scales the 3 px progress bar, with a rAF fallback. The eight desktop section dots use IntersectionObserver, labeled links, focus rings and `aria-current`. They are hidden below 1000 px. Native anchor scrolling supplies smooth navigation.
- Outcome-card highlights follow the pointer through a translated pseudo-element. Hover lift, text entrance and reveal effects use transforms and opacity. Reduced motion removes the intro, drift, parallax, rotation and reveals, leaving the content and controls readable.

### Swapping product visuals

Edit the four source entries in `apps/web/src/components/marketing/product-images.ts`. Each entry owns its source, alt text and aspect ratio. `ProductImage.tsx` reserves the frame before loading, uses contained image pixels, and supplies optional Motion entrances. Home uses a 47:30 slot with a 190 px desktop height ceiling, while Project, Review and Delivery share a 1.68 frame. Replacing a file or its source and alt text preserves the frame. The original image files are retained and no product pixels were generated or redrawn in this pass.

### Changed files

- `apps/web/src/pages/HomePage.tsx` and `apps/web/src/styles/home-story.css` implement the new chapters, copy, typography, tokens and responsive layouts.
- `apps/web/src/components/marketing/HomeExperience.tsx` owns the ambient layer, progress, section navigation and pausable sentence. `HomeMotion.tsx` owns scoped GSAP.
- `apps/web/src/components/marketing/product-images.ts`, `ProductImage.tsx` and `apps/web/src/components/preview/PreviewTeaser.tsx` centralize image slots and retain gallery controls.
- `apps/web/src/components/marketing/PageTransitions.tsx` and `apps/web/src/styles/page-transitions.css` replace the previous route curtain with the session intro.
- `apps/web/src/components/navigation/SiteHeader.tsx` adds the Community anchor and updates section ordering. `SiteFooter.tsx` uses the brand line and relationship framing. `apps/web/src/components/brand/BrandMark.tsx` uses the existing compact `syntaflow-mark.webp` variant, and favicon links reuse `syntaflow-mark.png`. This avoids duplicate 693 KB icon downloads while preserving the approved mark.
- `apps/web/index.html`, `apps/web/src/seo/seoConfig.ts` and `apps/web/scripts/verify-seo.mjs` synchronize the homepage metadata and font preloads. `public/brand/barlow-condensed-latin-600.woff2` and `BARLOW-OFL.txt` supply the display font. `public/brand/grain.png` supplies the static texture. `apps/web/src/styles/marketing-chrome.css` underlines the footer credit link for accessibility.
- `apps/web/scripts/validate-motion.mjs` checks the new intro and scroll experience. `validate-redesign.mjs` checks the four outcome blocks through their real links. This record contains the synchronized design decisions and results.

### Validation

The final production `npm run build` passed, including the package's TypeScript build. `npm run lint` exited 0 with existing warnings and no warnings in the new marketing components. Vite retains its initial-chunk size advisory. `npm run verify:seo` passed 241 checks. `npm run verify:preview` passed the existing sample interaction and responsive checks at 390, 768, 1366 and 1600 px.

`node scripts/validate-motion.mjs` passed at 390, 768 and 1440 px with zero page errors. It checked the sub-1.2-second intro, Skip, session repetition, all eight section states, changing background hue, progress, a smooth dot-navigation click, pausing the sentence, stable gallery frame dimensions, keyboard FAQ operation and reduced motion. A fresh reduced-motion session omitted the intro. Each width recorded an initial layout shift of 0.

The final Lighthouse 12.8.2 mobile audit used the default simulated mobile network and 4× CPU slowdown against the production preview. It scored **90 performance** and **100 accessibility**, with FCP **1.9 seconds**, LCP **3.3 seconds**, total blocking time **80 ms** and CLS **0**. Its text contrast audit passed. These are local lab measurements. Earlier measurements led to deferred GSAP startup, static raster grain, naturally soft mobile gradients and reuse of the existing compact logo assets.

The final isolated `npm run verify` passed **280 checks across 40 routes and seven viewport sizes**, including the Review and Delivery gallery interactions. The first concurrent run had one empty-title timeout on `/auth/desktop`; the isolated rerun completed without failures. The earlier complete redesign script also reported zero failures at 390, 768, 1366 and 1600 px. The final focused motion suite, sample suite and route sweep cover the subsequent intro, asset and contrast corrections.

Browser screenshots, `website-motion.webm`, `lighthouse-mobile.report.html` and its JSON are saved in `C:\Users\ayari\Documents\Codex\Syntaflow-people-motion`. The review website is available at `http://localhost:5181/`. Public community features still need a product decision. The Lighthouse result is a local lab result, and the existing lint warnings and initial-bundle advisory remain.

## Blue motion and upward loading reveal, 5 November 2026

The palette now uses the logo’s cobalt and cyan with navy surfaces and pale blue reading sections. The hero’s two text lines enter through masks, its brand mark settles behind them, and the desktop capture rises into place. Section reveals and feature rows have longer staggered entrances, while the product gallery settles into view as the user scrolls.

`PageTransitions.tsx` owns the GSAP loading curtain. The static boot screen survives until React replaces it with the matching curtain. Actual Suspense fallbacks register pending work. Once that work finishes, the curtain slides up over about 950 ms and signals the hero timeline to begin during the reveal. A route with reduced motion removes the curtain immediately. In-page anchor links retain their normal scrolling behavior. No loading percentage or artificial waiting timer is used.

`HomeMotion.tsx` owns the hero and scroll animations. Motion for React owns the images inside the gallery, including their directional entrance and exit, plus the pressed feedback on gallery controls. The two libraries act on separate elements. Each route disposes its curtain timeline and each homepage visit disposes its GSAP context, listeners, and resize observer.

The implementation touches the web entry point, route fallback, loading markup, homepage, gallery, and web styles. `validate-motion.mjs` specifically exercises the curtain while a real lazy route is held pending, its upward movement after that route resolves, restored interaction, the gallery, and reduced motion at 390, 768, 1366, and 1600 px.

### Files and validation

- Loading and route coordination use `apps/web/src/components/marketing/PageTransitions.tsx`, `apps/web/src/styles/page-transitions.css`, `apps/web/src/main.tsx`, `apps/web/src/App.tsx`, and `apps/web/index.html`.
- Hero and scroll movement use `apps/web/src/components/marketing/HomeMotion.tsx`, `apps/web/src/pages/HomePage.tsx`, and `apps/web/src/styles/home-story.css`. Gallery transitions use `apps/web/src/components/preview/PreviewTeaser.tsx`.
- Shared blue styling uses `apps/web/src/styles/marketing-chrome.css`. `apps/web/src/pages/onboarding/OnboardingFlow.tsx` follows the renamed sky color token.
- `apps/web/scripts/validate-motion.mjs` adds the focused loading and gallery checks. This implementation record contains the synchronized motion and validation notes.

`npm run build` and `npm run lint -- src` exited successfully. Lint retains existing warnings and Vite reports the initial JavaScript chunk size advisory. `npm run verify` passed all 280 route and viewport checks. `npm run verify:seo` passed 241 checks. The motion script passed at 390, 768, 1366, and 1600 px, including the reduced-motion case at 768 px and actual lazy-route loading. `node scripts/validate-redesign.mjs` completed with zero failures at the same four widths, covering disclosures, gallery controls, the client brief, email draft, navigation, and sample links.

Browser artifacts are saved at `C:\Users\ayari\Documents\Codex\Syntaflow-blue-motion`. They include `blue-home-{390,768,1366,1600}.png`, `blue-gallery.png`, `loading-cover.png`, `loading-lift.png`, and `website-motion.webm`. The recording shows the real page entrance, gallery change, and upward route-loading reveal. The site remains available locally at `http://localhost:5181/`. No new desktop screenshot was captured in this pass. Existing authentic product captures retain their original pixels and provenance below. These results cover the local website.

## Editorial frontend

[Addviso](https://www.addviso.com/) informed the centered masthead, expandable capability rows, and bright case-study section. SyntaFlow's version uses its approved brand mark as a watermark, graphite and mint surfaces, and Harbor & Finch desktop captures in an interactive Project, Review, and Delivery gallery. The screenshots retain their original product pixels. The existing browser sample and client brief have separate entry points and keep their sample-data labels.

- `HomePage.tsx` and `home-story.css` restructure the landing page around an opening statement, feature disclosures, the product showcase, the client brief, and questions before early access.
- `PreviewTeaser.tsx`, `HomeMotion.tsx`, and `SiteHeader.tsx` add gallery navigation, section state, and motion that responds to changes in page height and reduced-motion preferences.
- `marketing-chrome.css` applies the graphite, mint, cream, and blue palette to shared navigation and footer, product and integration surfaces, preview, pricing, documentation, downloads, legal, and trust pages. `AuthLayout.tsx`, `AccountShell.tsx`, `OnboardingFlow.tsx`, and `index.html` carry the new presentation into sign-in, account, onboarding, and loading. The portal retains its denser work layout.
- `DocsPage.tsx` scrolls to valid deep links after the lazy route renders. The homepage FAQ links to the existing client update guide.
- `validate-redesign.mjs` covers keyboard operation of the feature disclosures and gallery wraparound alongside the existing responsive and interaction checks.

The production build and source lint exited successfully. Vite still reports a size advisory for the initial JavaScript bundle, and source lint retains existing warnings. The route suite passed 280 checks across 40 routes and seven viewport sizes. SEO passed 241 checks. The redesign and playable preview suites passed at 390, 768, 1366, and 1600 px. A signed-in browser check confirmed Plan and billing rendered with the updated account shell. Browser captures are in the local `Syntaflow-editorial-review` folder. The review server uses `http://localhost:5181/`.

## Client message to approved work, 4 November 2026

The homepage now starts with the client communication problem faced by freelancers in Tunisia and small creative teams. The story moves through a client request, a brief with evidence, a possible scope change, and the approval and handoff record. The feature explorer, audience section, five-stage roadmap, and early access form complete the page. The dark navy navigation, footer, and public page introductions connect the existing routes to the homepage. Documentation and other long reading surfaces retain a light body for contrast.

The homepage analysis demo uses a fixed Harbor & Finch example. It distinguishes statements in the original message, inferred scope, and a missing budget. Visitors can open the source of each detail, compare the new request with the agreement, read a suggested reply, and reset the example. The sample calls no AI service. The separate `/preview` route remains available for trying tasks, review actions, and the delivery gate.

The desktop source supports pasted project updates and user-selected linked Gmail messages. Scope signals are suggestions for operator review. Review decisions are recorded against submitted versions, and the app checks required approvals before recording a handoff. The homepage shows the reply as sample copy and lists payment follow-up as a future direction. The early access form validates the email address and prepares a draft to the site’s existing contact address. A visitor chooses whether to open and send it. A mailing list service would be needed for automated enrollment.

### Layout, motion, and assets

- `HomePage.tsx`, `ClientBriefDemo.tsx`, and `home-story.css` implement the complete homepage story and the request, brief, and scope states. The hero and desktop evidence selector use existing October captures listed below. The hero uses the separate attention crop at phone widths. No new capture was made, and the pasted brief’s referenced nine-panel image was absent from the attachment.
- `HomeMotion.tsx` uses scoped GSAP and ScrollTrigger for a brief hero entrance, section reveals, and workflow and roadmap lines. Image load and demo size changes refresh the triggers. The media context, observer, frame, and event listener are cleared when the page unmounts or motion preference changes. Motion for React handles the sample transitions and menu open and close. Reduced motion keeps the page and controls usable with static presentation.
- `SiteHeader.tsx`, `SiteFooter.tsx`, `Link.tsx`, `App.tsx`, `index.html`, and `marketing-chrome.css` provide the sticky navigation, section links, accessible focus behavior, shared palette, and branded loading states. Loading is tied to the actual script or route rather than a timer. The account PayPal modal uses the same shield icon for its existing labels.
- `SiteIcon.tsx`, `public/brand/uicons.svg`, and `public/brand/UICONS-LICENSE.txt` contain the selected glyphs from [Flaticon Uicons Regular Rounded](https://www.flaticon.com/uicons/get-started/). The SVG paths come from the official font at revision `01c7cf8e403afdf879ff56c99235a34df81db6a2`. Icons render locally and take their color from CSS. Visible credit is in the footer.
- `tokens.css` loads the local Latin and Latin Extended Inter subsets from `public/brand/`. The SIL Open Font License is included as `INTER-OFL.txt`. The initial page no longer requests fonts from a third party.
- `AboutPage.tsx` introduces the target audience. `DocsPage.tsx` adds a guide to pasting and interpreting a project update while preserving the existing section IDs. Homepage metadata is synchronized in `seoConfig.ts`, `index.html`, and the SEO verification script.

### Browser checks

The final build passed. Source lint exited zero with existing warnings. The build reported a bundle size advisory for the initial JavaScript chunk. The route suite passed 280/280 checks across 40 routes and seven viewport sizes. SEO passed 241/241. The redesign and playable preview checks passed at 390, 768, 1366, and 1600 px, including the sample analysis, evidence, scope and reply states, reset, email draft, mobile menu and focus, cross-route anchor, reduced motion, and the existing preview’s review and delivery gate. Browser screenshots are saved in the local `Syntaflow-website-preview` output folder. These are local checks. Production deployment was outside the scope of this pass.

A separate Edge check held the local entry module, observed the branded loader, then released the module and confirmed the loader disappeared as the homepage rendered. It also confirmed the GSAP workflow line advanced on scroll.

## Renovation and playable sample, 1 October 2026

The website now has a dedicated `/preview` route. It is a browser prototype of one Harbor & Finch / Brand identity system engagement. Its Client, Project, Work, Review, Approval, and Delivery views use the desktop sample seed's real names, versions, task titles, and approval state. A visitor can open the project, check a sample task, add a session-only sample note, try a review decision, see that delivery remains blocked, inspect a fixed Flow context panel, and reset. The prototype never writes to an account, desktop workspace, database, or server. Its simulated actions are labeled as sample actions. The real captured desktop screen for the selected stage sits below the interactive replica and can be opened larger.

The homepage leads with a current Home attention crop and links directly to the playable sample. Its former screenshot-only six-step tour is replaced by a smaller three-screen Project / Review / Delivery selector with one primary route into the prototype. The product and audience templates, shared header and footer, Pricing, Download, integrations, and FAQ route visitors to the new sample. Shared marketing typography uses Inter, labels are plain readable text, and the screen framing is level and restrained. Auth and account views inherit the typography and shared control treatment; their behavior and billing flows are unchanged. Existing docs anchors and route aliases remain.

### Source of the screen images

`apps/web/scripts/capture-product-proof.mjs` rebuilt the captures on 1 October 2026 from `apps/desktop/dist/index.html` in an isolated Playwright browser context at 1600 × 1000 CSS pixels and 2× device scale. It loaded the desktop app's existing `apps/desktop/src/domain/seed.ts` records, filtered to Harbor & Finch and `pr-identity`. This filtering changes only the capture workspace, so Home now shows the same engagement as Client, Project, Work, Review, Approval, Delivery, and Flow. No desktop renderer source or product logic was changed. The refreshed files are under `apps/web/public/product-screens/current/`; Home's `home-attention.png`, mobile-specific `home-attention-mobile.png`, and the `*-crop.png` files are browser screenshot crops of those rendered views. The mobile crop isolates the two Harbor & Finch attention rows so their text stays readable without clipping. The previously captured Verity attention crop is no longer used in the hero.

### Motion and interaction

Motion for React animates only state changes in the `/preview` prototype. GSAP ScrollTrigger advances the homepage engagement line and reveals selected real screen frames; its code is loaded as a separate homepage chunk and uses the scoped React cleanup hook. The existing CSS handles hover, focus, and pressed states. Reduced-motion preference disables these movement effects. The preview's optional natural-language starting point reuses the existing server-side Jev Choice function, with the six fixed stages and the same manual fallback. Its production endpoint remains unconfigured in this checkout; no credential is embedded in the website.

The prototype's delivery gate stays blocked after a simulated guidelines approval because the trial decision does not alter the captured desktop state. The current desktop delivery capture reports two approvals outstanding; the prototype names only file states present in the sample seed. The approved project brief shown in the Approval view is a different, earlier document. The prototype's Flow panel contains fixed sample suggestions and does not claim a live AI result.

### Route and file map

- New route and metadata: `apps/web/src/App.tsx`, `apps/web/src/seo/seoConfig.ts`, `apps/web/src/pages/PreviewPage.tsx`, and `apps/web/src/styles/preview-page.css`.
- Homepage and motion: `apps/web/src/pages/HomePage.tsx`, `apps/web/src/components/preview/PreviewTeaser.tsx`, `apps/web/src/components/marketing/HomeMotion.tsx`, and matching homepage/teaser styles.
- Shared marketing polish and links: web tokens/global/site styles, `OutcomePage`, `IntegrationDetail`, header/footer, Pricing, Download, Integrations, FAQ, and relevant company/trust calls to action.
- Evidence and checks: `apps/web/scripts/capture-product-proof.mjs`, `apps/web/scripts/validate-preview.mjs`, the existing web verification scripts, screenshot files, and this record.

The new page uses the current TypeSafe function only when `VITE_TOUR_GUIDE_URL` is configured. Use a fresh key in `TYPESAFE_API_KEY` on the function host. Publishing the function, installer, or site is release work and is not claimed by these local changes.

### Local validation on 1 October 2026

The desktop renderer build completed, followed by the isolated sample capture. The final web `build`, `lint`, `verify`, `verify:seo`, and `verify:preview` commands exited 0. Lint retained pre-existing warnings in older and copied files. Web verification covered 40 routes at seven widths with 280 checks and no failures; SEO verification completed 241 checks; the playable preview's task, comment, decision, delivery, reset, and reduced-motion paths passed at 390, 768, 1366, and 1600px. The existing redesign audit completed with zero failures across 390, 768, 1366, and 1600px. The feedback audit confirmed docs anchors, sticky navigation, account download and billing views at 390 and 1366px. The five mocked Jev function tests passed. Browser captures include `renovated-home-{390,768,1366,1600}.png`, `playable-preview-{390,768,1366,1600}.png`, refreshed `hero-*.png` and `home-*.png`, and account captures in `docs/product/website-validation/`.

This is local frontend validation. The function has no configured production endpoint in this checkout, the Windows installer is not present here, and the website was not deployed. `verify:live` was therefore not run.

Status: local implementation, 24 September 2026. This document describes source changes and capture provenance; it is not a deployment record.

## Changed-file map

- Website structure: `apps/web/src/pages/HomePage.tsx`, `apps/web/src/components/navigation/{SiteHeader,SiteFooter}.tsx`, `apps/web/src/components/preview/GuidedTour.tsx`, `apps/web/src/components/marketing/{OutcomePage,IntegrationDetail}.tsx` and their CSS in `apps/web/src/styles/` (`homepage-redesign`, `guided-tour`, `outcome-pages`, `catalog-redesign`, `integration-detail`, `docs-redesign`, `trust-redesign`, `account-home-redesign`, `legal-readability`, plus `site-system` and `pricing-page`).
- Public routes: product and solution page components, six integration detail pages, `IntegrationsCatalogPage`, `PricingPage`, `DownloadPage`, `DocsPage`, `FAQPage`, `AboutPage`, `ContactPage`, `RoadmapPage`, `ChangelogPage`, `SecurityPage`, and `DataHandlingPage` under `apps/web/src/pages/`.
- Account and authorization: `apps/web/src/pages/account/{AccountHomePage,PlanPage}.tsx`, `apps/web/src/pages/auth/{AuthLayout,DesktopAuthPage}.tsx`, and the callback presentation in `apps/desktop/electron/auth/auth-provider.cjs`.
- Legal presentation: `apps/web/public/privacy.html`, `privacy/index.html`, `terms.html`, `terms/index.html`, and the React legal page readability wrappers. The live contractual substance was not revised.
- Evidence and checks: `apps/web/scripts/{capture-product-proof,validate-redesign,verify-seo}.mjs`, `apps/web/verify-web.mjs`, `apps/web/public/product-screens/current/`, `apps/web/functions/tour-guide/`, `apps/desktop/scripts/verify-auth-callback-presentation.mjs`, the two legal review drafts, two empty security placeholders, and `docs/product/website-validation/`.

## Purpose and composition

The first viewport answers what the desktop app does, then shows Home/Today immediately. The homepage follows one sample engagement through Client → Project → Work → Review → Approval → Delivery. The approval screen is an earlier approved document in the same project; the delivery screen correctly shows two files still awaiting approval. Flow is shown as the contextual desktop operator, not a chat illustration. The product and audience routes pair one outcome-led sentence with a large current-build screen and short operational details. Integration detail pages describe connection context without promising provider authorization or actions that have not been verified.

Visual hierarchy: warm white editorial surfaces, navy type and contrast sections, cobalt primary actions, restrained teal state markers. Primary buttons lift and darken on hover; text links use an underline; row links change background and rise slightly. Focus remains visible. Body copy is at least 16px on new sections. The mobile layout stacks text before screenshots and makes stage selection horizontally available. The hero capture is framed as a desktop window but its pixels are not redrawn.

## Actual screen provenance

All files in `apps/web/public/product-screens/current/` were captured on 24 September 2026 with `apps/web/scripts/capture-product-proof.mjs`. The script uses the **built current desktop renderer** (`apps/desktop/dist/index.html`) in an isolated Playwright browser context at 1600 × 1000 CSS pixels and 2× device scale. It loads the desktop app's existing sample seed records into browser-local storage and signs in as `preview@syntaflow.example`. This is a renderer capture, not a photograph of an Electron window, and not a production account. No product pixels were generated or redrawn. The script saved full screens and screenshot-only crops. All images use the Harbor & Finch / Brand identity system sample engagement where the target view permits it.

| File | Source view | Use |
| --- | --- | --- |
| `home.png`, `home-crop.png`, `home-attention.png`, `home-attention-mobile.png` | Home / Today | Homepage hero and attention, legible mobile hero crop, download, solutions |
| `client.png` | Harbor & Finch client | Guided tour and client page |
| `project.png`, `project-crop.png` | Brand identity system project | Story and product/project pages |
| `work.png`, `work-crop.png` | Project work | Story and work page |
| `review.png`, `review-detail.png`, `review-detail-crop.png` | Reviews and version three detail | Review story and pricing preview |
| `approval.png`, `approval-crop.png` | Earlier approved document in same project | Approval story |
| `delivery.png`, `delivery-crop.png` | Delivery gate with two unapproved files | Delivery story; no successful handoff claim |
| `flow.png` | Flow contextual operator | Homepage and Flow page |

## Interaction and motion

The six-stage guided tour uses real-screen assets, clickable stage buttons, previous/next controls, and an `aria-live` panel. An optional text prompt can suggest a starting stage through a server-side Jev Choice call with six fixed stages and an `other` fallback. No client or desktop workspace records are sent by the prompt. The prompt is hidden until a `VITE_TOUR_GUIDE_URL` is configured. Low confidence, invalid responses, timeouts, and unavailable service leave manual stage selection usable. The server function requires `TYPESAFE_API_KEY` and `TOUR_ALLOWED_ORIGINS` secrets and is **not deployed by this source change**.

Hero and story elements use short intersection-triggered entrance motion; stage panel, provider rows, and buttons use 200–500ms transitions. `prefers-reduced-motion: reduce` removes transitions and reveal effects. There is no continuous floating, WebGL, or simulated live account.

## Route checklist

- `/`: new hero, real product story, guide, integrations, trust, closing action.
- `/product` and `/product/{client-management,projects,documents,reviews-approvals,ai-workspace}`: outcome-led layouts and matching captures.
- `/solutions` and four audience routes: outcome-led layouts with current-build evidence.
- `/integrations` and six provider detail routes: implemented connector types and permission caveats.
- `/pricing`: current free preview, no public paid-tier sales surface.
- `/download`: current Home capture and sign-in-gated installer access.
- `/docs`: six short guides; retained existing route and docs-host behavior.
- `/faq`, `/about`, `/contact`, `/roadmap`, `/changelog`, `/security`, `/data-handling`: shorter product-grounded explanations with unsupported claims removed. Contact retains the email-draft behavior and does not claim a message was sent; roadmap items are explicitly directional.
- `/login`, `/signup`, `/forgot-password`, `/auth/desktop`: shared visual system; desktop authorization copy simplified while the existing code exchange remains.
- `/account`: simplified overview with actual account status and active sessions link. Other account routes and billing logic retained.
- `/terms`, `/privacy`: readability polish only. Proposed substance is in separate review drafts.
- Existing redirects and aliases in `apps/web/src/App.tsx` remain unchanged.

## Sources and bounds

- [Linear](https://linear.app/) for bringing product evidence forward; [Attio](https://attio.com/) for calm interface staging; [Raycast](https://www.raycast.com/) for use-case and integration discovery.
- [Attio download shot](https://dribbble.com/shots/25966008-Attio-download-page) and [CopyCase interaction shot](https://dribbble.com/shots/19975182-CopyCase-com-Drag-and-drop-file) informed framing and motion only. Direct Dribbble browsing was verification-gated in research; public indexed pages were reviewed.
- [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) informed text contrast; [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) informed the static mode.
- The separate Jev headline comparison had low confidence (0.35); rendered product clarity remains the design criterion.

## Deployment notes

Create an Appwrite Function from `apps/web/functions/tour-guide/`, allow POST/OPTIONS, set the two server secrets, and point `VITE_TOUR_GUIDE_URL` at its public HTTPS endpoint before building the site. Use a **fresh** TypeSafe key; no key belongs in Vite variables, files, or screenshots. Configure `TOUR_ALLOWED_ORIGINS` to exact production origins. The function applies input validation, fixed-choice validation, timeout, and best-effort per-instance rate limiting; production abuse control should also be set at the hosting edge. The guided tour works manually without deployment.

## Local validation

The web build completed after TypeScript and Vite; web lint exited 0 with existing warnings. `verify` completed 273 checks across 39 routes and seven viewports with zero failures. `verify:seo` completed 233 checks with zero failures. An additional Playwright pass in `apps/web/scripts/validate-redesign.mjs` visited 34 representative routes at 390, 768, 1366, and 1600px with no horizontal overflow, broken images, or page errors. It also checked keyboard operation of the mobile menu, reduced-motion styling, tour stage selection, and the link from Download into the guided tour. Browser captures are in `docs/product/website-validation/` (`hero-*.png`, `home-*.png`, and `tour-mobile.png`). The Jev function's five mocked success/fallback cases passed; no live API key or deployed function was used.

The desktop TypeScript/Vite build and lint exited 0 (lint with existing warnings). `apps/desktop/scripts/verify-auth-callback-presentation.mjs` confirmed the three-second close attempt and visible manual-close fallback in a browser. It does not exercise a production identity-provider round trip. `verify:live` was not run because the redesign has not been deployed. All product captures are from the current desktop renderer in isolated sample mode; the capture set does not claim to show an Electron window or a live connected provider.

## Visual and usability revision, 24 September 2026

The owner's visual review identified technical-looking labels, repeated arrow CTAs, a cramped screenshot layout, an unreadable account menu, a docs link that opened the 404 page, and misleading account download options. The revision removes the monospace and numbered labels from the main homepage and guide, removes decorative arrow suffixes from primary actions, enlarges the hero product image, and gives review its own full-width composition. Product and audience pages now alternate image order or a dark hero instead of repeating one layout everywhere. Screen images remain the same unmodified renderer captures listed above. The guided tour adds an accessible large-screen view and two highlighted click targets on the captured Client and Project screens. These targets navigate between captured stages only; the tour is still a guided demonstration, not a live account.

The public navigation stays at the top when scrolling. The global horizontal overflow setting was changed from `hidden` to `clip` because the former made the body a scroll container and prevented sticky positioning. Account menu links now have readable light text and a short entrance transition. The account Downloads page focuses on the Windows preview and removes the unsupported macOS, Linux, and CLI installer rows. Its button checks that an installer exists before initiating a download and otherwise reports that it is unavailable. The installer path currently does **not** exist in this checkout; publishing the real installer remains release work. The Plan and Billing page now states the current plan plainly and uses “Choose Pro” to open the unchanged PayPal modal. Subscription retrieval and cancellation still use their previous endpoints. The public Pricing page gives the real review capture more room and shows the free preview terms without invented team tiers.

The Docs topic link bug came from treating every URL fragment as a route. Only fragments beginning with `/` are now treated as routes; ordinary page anchors keep the current path and scroll normally. The 404 page uses a simple recovery message. The Privacy page has larger navigation text, a clearer heading, and no small technical summary box; contractual policy substance is still reserved for the separate review draft. Professional email configuration is deferred, as requested.

The revision was checked with TypeScript, Vite production build, 273 route and viewport checks, SEO verification, and `validate-redesign.mjs` at 390, 768, 1366, and 1600px. `validate-feedback.mjs` checks Docs anchor navigation, the sticky header, the tour's zoom and click target, the plain 404, and mocked signed-in account Downloads and Plan at 390 and 1366px. The visual captures are in `docs/product/website-validation/`. Oxlint 1.81.0 ran from a temporary package location because the declared package was missing from the checkout's installed dependencies; it exited 0 with existing warnings. No production deployment or live installer was verified.

The account review captures are `docs/product/website-validation/account-downloads-{390,1366}.png` and `account-plan-{390,1366}.png`. Those use a mocked user profile in Playwright; they show the local frontend and do not represent a production account. The [BridgeMind product page](https://www.bridgemind.ai/products/bridgeshot) informed the idea of showing the actual interface early and letting visitors explore it. No BridgeMind layout, copy, or product screen was copied. The Syntaflow sample remains a bounded guided tour with captured screens.

Because the installer is absent here, the public Home, Pricing, Download, and FAQ paths now invite visitors to check Windows preview availability instead of promising that the file is already downloadable. The account Downloads action remains prominent and checks for an actual installer before handing off to the browser.

## Home and Flow restoration, 25 September 2026

The desktop Home navigation once again opens the attention-first Home view, and Flow remains in the sidebar and opens its contextual operator screen. The marketing capture script was rerun against the current desktop renderer in isolated sample mode on 25 September 2026. It refreshed the authentic Home, Client, Project, Work, Review, Approval, Delivery, and Flow images under `apps/web/public/product-screens/current/`. These are renderer captures with sample records, not images generated or redrawn for the site. The hero uses `home-attention.png`, a close crop of Home, while the Home section keeps `home-crop.png` for broader context and the Flow section uses `flow.png`. The screen images are cropped only by the browser frame for legibility; no interface pixels were reconstructed.

The homepage now pairs the result-led headline with a large Home crop in the first desktop viewport. A simple lifecycle row leads into the existing clickable six-stage project tour. Shared marketing buttons use the site's existing CSS design system with clearer hover, focus, and pressed states, so no new UI runtime is needed. On narrow screens, the authentic crop stays fully in frame; the guided tour offers a larger view for details. Motion remains short and respects reduced-motion settings.

The refreshed website build completed. Lint exited 0 with existing warnings. Web verification completed 273 checks with no failures, technical SEO completed 233 checks with no failures, and `validate-redesign.mjs` reported zero failures across 390, 768, 1366, and 1600px. Updated browser screenshots are in `docs/product/website-validation/hero-{390,768,1366,1600}.png`. These checks validate the local frontend only; the preview installer and any production deployment remain outside this result.
