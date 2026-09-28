# Space Colony UI Prototype

## Goal
Build a responsive, polished Mars colony management interface with coherent navigation and realistic game-management workflows. The prototype will focus on front-end presentation and interaction only, while keeping the structure practical for a future ASP.NET Core Razor Pages and Bootstrap implementation.

## Visual Direction
- Dark, restrained space interface with charcoal surfaces, light text, Mars orange/red accents, and clean status colors.
- Scientific dashboard typography and compact information hierarchy without movie-style neon or dense HUD decoration.
- Subtle star texture in selected backgrounds and a prominent interactive 3D Mars visual using Three.js.
- Consistent cards, badges, progress bars, icons, controls, spacing, and responsive behavior across all screens.

## Screens
1. **Dashboard**
   - Colony header with New Horizon identity, Mars map/planet visual, status summary, and offline progression notice.
   - Five detailed resource cards showing capacity, production, consumption, net change, and progress.
   - Population summary with health, happiness, working, and idle counts.
   - Colony Infrastructure cards for all six initial buildings, including levels, staffing, production, status, and upgrade controls.
   - Current research and construction progress.
   - Recent event timeline with active/completed states.

2. **Buildings**
   - Full building-management grid with production, staffing, capacity, upgrade cost, and build time.
   - Working upgrade controls and an under-construction state with progress and remaining time.

3. **Colonists**
   - Searchable, filterable colonist roster.
   - Health, happiness, job, and status indicators.
   - Assign Job dialog with selectable buildings and confirmation flow.

4. **Research**
   - Three clear branches: Agriculture, Engineering, and Life Support.
   - Connected technology nodes with locked, available, researching, and completed states.
   - One active research item at a time with progress and duration feedback.

5. **Exploration**
   - Mission planning panel showing destination, duration, energy cost, and possible rewards.
   - Launch interaction and active mission progress state.
   - Interactive 3D Mars as the visual focus.

6. **Events**
   - Active and completed event history with positive, negative, warning, and completion styling.
   - Effects, durations, and remaining-time details.

7. **Settings**
   - Compact interface settings suitable for the navigation destination, without adding backend account functionality.

8. **Login and Register**
   - Focused authentication mockups with subtle Mars/space atmosphere.
   - Login and registration switching/navigation.
   - Registration includes username, email, password confirmation, colony name, and fixed Mars selection.

## Interaction and Responsive Behavior
- Desktop sidebar with a compact top status area; mobile navigation drawer with stacked content.
- Working page navigation, search/filtering, job assignment dialog, upgrade states, research selection, mission launch, and auth-page links.
- Stable progress bars and status badges with accessible labels and clear color semantics.
- Reduced-motion support; animations limited to the rotating Mars, subtle status movement, and purposeful transitions.

## Technical Details
- Use TanStack Start routes/components and Tailwind v4 semantic design tokens.
- Use Three.js for a lightweight, draggable rotating Mars scene, loaded safely in the browser.
- Keep data as deterministic front-end prototype state; no database, authentication service, APIs, or deployment work.
- Build reusable navigation, resource, building, status, progress, and dialog patterns that map cleanly to Razor partials and Bootstrap components later.
- Add route-specific page metadata and verify desktop and mobile layouts with browser screenshots.
