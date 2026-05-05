# Add Person Mockup

Visual source of truth for the Add Person modal opened from Create Group.

This reference was added from the Claude design after the initial Create Group task write-up. Use it
for modal visual reviews and for the add-person interaction that appends a new person back into the
Create Group flow.

## Source Files

- Modal reference: [ADD_PERSON.png](./ADD_PERSON.png)
- Interaction summary source: Claude design notes screenshot supplied in chat

## Canvas

- Screenshot file: 232 x 461 px
- Target device look: iPhone-style rounded device frame with status bar, dynamic island, and home
  indicator visible in the mockup export
- Presentation: bottom-sheet modal over the dimmed Create Group screen
- Background screen: stays visible behind the modal with a dark scrim; no full-screen navigation
- App background: very light neutral gray, not pure white
- Primary action color: blue to purple gradient
- Primary text color: deep navy
- Secondary text color: muted gray

## Sheet Layout

- Bottom sheet is anchored to the bottom of the screen with rounded top corners.
- Small grabber handle appears centered at the top of the sheet.
- Header row:
  - Left title: `Add person`
  - Right text action: `Close`
- Sheet content is compact and inset from the sheet edge.
- Home indicator remains visible below the sheet content.

## Information Shown

Claude labels this modal as `From Create group`.

- Single first-name text field.
  - Field label: `NAME`
  - Example value: `Riley`
  - Keyboard should be up by default when the sheet opens.
- Helper text below the field:
  - `First name only - keep it short. No phone or email needed.`
- Avatar color picker row.
  - Field label: `AVATAR COLOR`
  - Color is auto-assigned by default.
  - Swatches are tappable to swap the color before saving.
  - Reference swatches include navy, blue, purple, cyan, orange-red, green, and magenta.
  - Selected swatch has a visible ring treatment.
- Bottom primary CTA:
  - Text: `Add to group`
  - Full-width rounded rectangle
  - Blue to purple gradient

## User Actions

- Tap `+ Add person` on Create Group to open this bottom-sheet modal.
- Type a first name in the text field.
- Tap a color swatch to pick a different avatar tint.
- Tap `Add to group` to dismiss the sheet and return to Create Group with the new person pill
  appended.
- Tap `Close`, swipe down on the grabber, or tap the dimmed background scrim to dismiss without
  saving.

## Feedback And State Rules

- `Add to group` is disabled until the trimmed name has at least 1 character.
- Avatar color is assigned automatically when the modal opens and can be changed manually before
  saving.
- On save, the new person is added to the current group and also appears in recent contacts for the
  next time the user opens Create Group.
- The background Create Group screen remains in place throughout the modal interaction so returning
  from the sheet feels immediate.
- No full navigation transition is used for this flow.
- No login, email, or phone number is required here: first names only.

## Implementation Notes

- Treat this as a modal or bottom sheet owned by the Create Group flow, not as a separate routed
  screen.
- Keep dismissal paths consistent: `Close`, swipe-down, and scrim tap should all discard unsaved
  modal input.
- Saving should append the person to the Create Group selected-person list and update the local
  recents source used by the tap-to-add chips.
