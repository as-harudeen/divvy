# Group Detail Add People Create-State Mockup

Visual source of truth for the keyboard-up create/search state of the Add People bottom sheet opened
from Group Detail.

This reference is the focused companion to [GROUP_DETAIL_ADD_PERSON.md](./GROUP_DETAIL_ADD_PERSON.md).
Use it for the inline person creation behavior, live filtering, keyboard layout, and pinned
selection/search controls.

## Source Files

- Create-state reference: [GROUP_DETAIL_ADD_PERSON_CREATE.png](./GROUP_DETAIL_ADD_PERSON_CREATE.png)
- Browsing-state reference: [GROUP_DETAIL_ADD_PERSON.png](./GROUP_DETAIL_ADD_PERSON.png)
- Interaction summary source: Claude design notes screenshot supplied in chat

## Canvas

- Screenshot file: 359 x 693 px
- Target device look: iPhone-style rounded device frame with status bar, dynamic island, and home
  indicator visible in the mockup export
- Presentation: same Add People bottom sheet over the dimmed Group Detail screen
- Keyboard state: iOS keyboard is visible and the search field is focused
- Sheet height: shrinks to make room for the keyboard
- Pinned controls: header, selected pills, and search field stay visible above the scrolling content
- Background screen: current group stays visible behind the modal with a dark scrim
- Primary action color: brand blue
- Primary text color: deep navy
- Secondary text color: muted gray

## Information Shown

- Header row remains sticky:
  - Left action: `Cancel`
  - Center title: `Add people`
  - Right action: `Add (n)`
  - Reference state: `Add (2)`
- Selected people remain visible as pills below the header.
  - Reference selected people: `Riya`, `Theo`
- Search field is focused with the typed query `Ril`.
- Clear-text affordance appears inside the focused search field.
- When the typed name has no exact match, a create affordance appears at the top of the results.
- Create section:
  - Header: `CREATE NEW`
  - Row title: `Create "Ril"`
  - Row subcopy: `New person - added to this group`
  - Row action: `Add ->`
  - Leading icon: brand-blue circular plus
- Matches section:
  - Header: `MATCHES`
  - Matching rows filter live as the query changes.
  - Matching name prefixes are highlighted so the user can confirm the search target.

## User Actions

- Type in the search field to filter the people list live.
- Tap the brand-blue create row to create a new person with the typed name.
- Tap any matching existing-person row to add that existing person to the selection instead.
- Keep typing to refine matches.
- Tap `done` on the keyboard to collapse the keyboard.
- Tap outside the field to collapse the keyboard and return toward the browsing layout.
- Tap `Cancel` or swipe down to dismiss without applying the pending add operation.

## Feedback And State Rules

- The create row appears only when the trimmed query is non-empty and has no exact match.
- Exact-match checks should be case-insensitive and ignore leading or trailing whitespace.
- Once the query exactly matches an existing person, the create row disappears.
- Prefix highlighting applies only to the matching portion of existing-person names.
- Creating is inline; do not open a separate new-person modal or route.
- Avatar tint for a newly created person is auto-assigned from the name hash, matching the app's
  existing deterministic avatar-color behavior.
- After inline creation:
  - The new person is added to the global people pool for future groups.
  - The new person is added to the current selection.
  - A selected pill appears for the new person.
  - The create row collapses away.
  - The search field clears so the user can add another person.
- `Add (n)` updates immediately after a new or existing person is selected.

## Implementation Notes

- Keep this as the same Group Detail-owned bottom sheet as the browsing state.
- Use a single search value for filtering and inline creation.
- Do not maintain separate create-person form state beyond the current search query.
- Reuse the same person de-duplication rules as the browsing list so newly created people do not
  appear twice.
- Persist the newly created person before adding it to the current group selection so future groups
  can find it in the unified people pool.
