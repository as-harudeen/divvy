# Create Group Mockup

Visual source of truth for `tasks/CREATE_GROUP.md`.

This reference was added from the Claude design after the initial task write-up. Use it for the
remaining `Match mockup pixel-for-pixel` work and for future visual reviews of Create Group
Screen 02.

## Source Files

- Screen reference: [CREATE_GROUP.png](./CREATE_GROUP.png)
- Interaction summary source: Claude design notes screenshot supplied in chat

## Canvas

- Screenshot file: 191 x 379 px
- Target device look: iPhone-style rounded device frame with status bar, dynamic island, and home
  indicator visible in the mockup export
- App background: very light neutral gray, not pure white
- Primary action color: blue to purple gradient
- Primary text color: deep navy
- Secondary text color: muted gray

## Header

- Status bar shows `9:41`, dynamic island, signal, Wi-Fi, and battery.
- Navigation row:
  - Left action: `Cancel`
  - Center title: `New group`
  - No right-side header action
- Header content is compact and inset from the device edge.

## Information Shown

Claude labels this screen as `Minimal input` / `Tap-to-add`.

- Group name field with an editable auto-suggestion.
  - Example value: `Saturday brunch`
  - Suggestion can come from time of day, such as brunch, lunch, or dinner.
- People already added are shown as horizontal pills.
  - The first pill is always `You`.
  - Example added people: `You`, `Alex`, `Maya`.
  - Each pill includes an avatar initial and a remove affordance.
- Member counter appears aligned to the right of the `PEOPLE` section label.
  - Reference text: `3 added`
- `+ Add person` pill appears below the added people row.
- Recent contacts list appears under `RECENT - TAP TO ADD`.
  - Example recents: `Alex`, `Maya`, `Jordan`, `Riya`, `Sam`, `Priya`, `Theo`
  - Recent contacts are compact avatar-name chips laid out in wrapping rows.
- Bottom primary CTA:
  - Text: `Create group ->`
  - Full-width rounded rectangle
  - Blue to purple gradient

## User Actions

- Type in the group name field to replace or edit the default suggestion.
- Tap a recent person once to add them to the group.
- Tap `+ Add person` to open the Add Person modal or sheet for a new name.
- Tap the remove affordance on an added person pill to remove that person.
- Tap `Cancel` to return to Home without saving.
- Tap `Create group ->` to create the group and continue to the group detail flow.

## Feedback And State Rules

- Already-added recent contacts stay visible but render dimmed at about 35% opacity to prevent
  duplicate adds.
- The `Create group ->` CTA becomes enabled the moment at least 2 people are added.
- The group name suggestion is editable and should behave like normal input text.
- The current user is included automatically as `You` and is always the first added person.
- No login, email, or phone number is required here: names only.

## Implementation Notes

- The current task file says save is disabled when the name is empty or there are `0 members`.
  The Claude design says `Create` is enabled when there are at least 2 people added. Treat the
  design as the visual and product source of truth unless product decides otherwise.
- The task file says recents exclude added people, but the design notes say already-added recents
  are dimmed at 35% opacity. Prefer the mockup behavior for visual matching.
- The counter text in the mockup is `N added`, not `N members`.
