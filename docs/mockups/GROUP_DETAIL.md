# Group Detail Mockup

Visual source of truth for `tasks/GROUP_DETAIL.md`.

This reference was added from the Claude design after the initial task write-up. Use it for the
remaining `Match mockup pixel-for-pixel` work and for future visual reviews of Group Detail
Screen 03.

## Source Files

- Screen reference: [GROUP_DETAIL.png](./GROUP_DETAIL.png)
- Interaction summary source: Claude design notes screenshot supplied in chat

## Canvas

- Screenshot file: 191 x 388 px
- Target device look: iPhone-style rounded device frame with status bar, dynamic island, and home
  indicator visible in the mockup export
- App background: very light neutral gray, not pure white
- Primary action color: blue to purple gradient
- Primary text color: deep navy
- Secondary text color: muted gray

## Header

- Status bar shows `9:41`, dynamic island, signal, Wi-Fi, and battery.
- Navigation row:
  - Left action: `<- Groups`
  - Center title: current group name, for example `Saturday brunch`
  - Right action: `Edit`
- The group name is the persistent nav-bar title for this screen.

## Information Shown

Claude labels this screen as `Persistent ledger`.

- Member row with circular avatars and short labels.
  - Reference members: `You`, `Alex`, `Maya`, `Jordan`
  - Final slot is an `Add` affordance for adding another member.
- Aggregate balance card.
  - Label: `YOU ARE OWED`
  - Reference amount: `$32.10`
  - Supporting line: `3 splits - 1 open`
  - Right-side link: `View balances ->`
- Splits feed under the `SPLITS` label.
  - Each split row shows label, timestamp, total amount, and a settled/open status mark.
  - Rows are sorted newest first.

Reference split rows:

- `Brunch - Tartine`
  - Timestamp: `Today - 1:42 PM`
  - Amount: `$96.40`
  - Status: open, shown with amber status treatment
- `Coffeerun`
  - Timestamp: `Today - 10:08 AM`
  - Amount: `$18.75`
  - Status: settled, shown with green check treatment
- `Uber to brunch`
  - Timestamp: `Today - 1:15 PM`
  - Amount: `$24.00`
  - Status: settled, shown with green check treatment

## Primary CTA

- Bottom anchored button:
  - Text: `+ New split`
  - Full-width rounded rectangle
  - Blue to purple gradient

## User Actions

- Tap `+ New split` to open Split Creation for this group.
- Tap a split row to open that split's Settlement screen for review or edit.
- Tap a member avatar to see only that member's balance context.
- Tap `View balances ->` to open or reveal the full per-member balance breakdown.
- Tap `Edit` to rename the group or add/remove members.
- Tap the `Add` member slot to start adding a member to this group.

## Feedback And State Rules

- Green means settled and amber means open; the status color and icon must match.
- The aggregate balance card recolors red when the current user owes money overall.
- The aggregate balance card uses the owed/settled positive state when the current user is owed
  money or balanced.
- Empty state text when no splits exist: `Add your first split`.
- The selected member state should be visually clear when a member avatar filters the balance
  context.

## Implementation Notes

- The initial task file included a top status pill, but the mockup does not show one. Treat the
  split-row icons/colors and aggregate balance card as the visible status surfaces for Screen 03.
- The initial task file routed split rows to split detail. The Claude interaction notes say split
  rows open the Settlement screen for review or edit, so use the settlement route for row taps.
- The initial task file used `No splits yet` for the empty state. The design note uses
  `Add your first split`; prefer that exact copy for visual matching.
