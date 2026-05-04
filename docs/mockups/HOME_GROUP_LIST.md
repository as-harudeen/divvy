# Home Group List Mockup

Visual source of truth for `tasks/HOME_GROUP_LIST.md`.

These references were added from the Claude design after the initial implementation. Use them for
the remaining `Match mockup pixel-for-pixel` requirement and for future visual reviews of Home
Screen 01.

## Source Files

- Populated state: [HOME_GROUP_LIST.png](./HOME_GROUP_LIST.png)
- Empty state: [HOME_GROUP_LIST_empty.png](./HOME_GROUP_LIST_empty.png)
- Populated-state summary source: Claude design notes screenshot supplied in chat
- Empty-state summary source: Claude design notes screenshot supplied in chat

## Canvas

- Populated screenshot file: 306 x 609 px
- Empty screenshot file: 299 x 609 px
- Target device look: iPhone-style rounded device frame with status bar, dynamic island, and home
  indicator visible in the mockup export
- App background: very light neutral gray, not pure white
- Primary action color: blue to purple gradient
- Primary text color: deep navy
- Secondary text color: muted gray

## Shared Header

- Status bar shows `9:41`, dynamic island, signal, Wi-Fi, and battery.
- App header row:
  - Small Divvy mark on the left
  - `Divvy` wordmark beside it
  - User initial `Y` on the right
- Header content is inset from the device edge with compact top spacing.

## Populated State

Reference: `HOME_GROUP_LIST.png`.

Claude labels this state as `Entry point` / `No login`.

### Information Shown

- Divvy logo and user avatar in the header.
- List of groups with:
  - Avatar stack
  - Member count
  - Last activity
  - Total amount
- Status pill:
  - `Open`
  - `Settled`
- Most recent group has:
  - `ACTIVE` badge
  - Brand-blue border
- `+ Create new group` row appears at the bottom of the group list.
- Context strip appears above the primary CTA:
  - `Splitting under: <active group>`
  - `Change` link

### Title Area

- Main heading: `Your groups`
- Subcopy: `4 active - tap to open or split`
- Heading is large, bold, and left aligned.

### Group Cards

- Four group cards are shown.
- Cards are rounded white surfaces with subtle shadow/border.
- The active card has a blue outline and an `ACTIVE` badge attached near the top-right edge.
- Card content:
  - Left: stacked circular avatars with initials and overflow count.
  - Middle: group name and metadata line.
  - Right: balance amount and open/settled status.

Card rows shown in the reference:

- `Saturday brunch`
  - Metadata: `4 people - Today - 1:42 PM`
  - Amount: `$96.40`
  - Status: `Open`
  - Active badge: `ACTIVE`
- `Lake trip`
  - Metadata: `6 people - Yesterday`
  - Amount: `$412.80`
  - Status: `Open`
- `Office lunch`
  - Metadata: `8 people - Apr 26`
  - Amount: `$184.00`
  - Status: `settled`
- `Mia's birthday`
  - Metadata: `5 people - Apr 22`
  - Amount: `$220.50`
  - Status: `settled`

### Create Group Control

- A dashed-outline rounded rectangle appears after the group cards.
- Text: `+ Create new group`
- This is not a floating FAB in the populated design reference.

### Bottom Context And CTA

- Bottom anchored context card:
  - Upper label: `SPLITTING UNDER`
  - Active group: `Saturday brunch`
  - Metadata: `4 people`
  - Right action: `Change`
  - Small blue dot indicator on the left
- Primary bottom button:
  - Text: `+ New split`
  - Full-width rounded rectangle
  - Blue to purple gradient

### User Actions

- Tapping any group opens Group Detail and makes that group the active group.
- Tapping `+ Create new group` opens the Create Group screen.
- Tapping `+ New split` starts a split inside the active group shown in the bottom context strip.
- Tapping `Change` opens a bottom sheet to pick a different group first.

### Feedback And State Rules

- The active group is visually distinct with a border, `ACTIVE` badge, and tinted background.
- The context strip makes the target group unambiguous before the user taps the primary CTA.
- The CTA uses brand gradient and is the primary action for the whole app.
- If no groups exist, the list collapses to the single create-group prompt shown in the empty
  state.

## Empty State

Reference: `HOME_GROUP_LIST_empty.png`.

Claude labels this state as `First launch` / `Zero state`.

### Information Shown

- Same logo and avatar header as the populated state so the app identity stays consistent.
- Headline and one-sentence value prop:
  - `Welcome to Divvy`
  - `Split bills with friends in seconds. Create your first group to get started.`
- Illustrated empty card with:
  - Divvy logo mark
  - `No groups yet`
  - Setup primer steps
- Trust-line footer:
  - `No login`
  - `No phone numbers`
  - `Just names`

### Title Area

- Main heading: `Welcome to Divvy`
- Subcopy: `Split bills with friends in seconds. Create your first group to get started.`

### Empty Card

- Large rounded panel with subtle blue-tinted background and border.
- Center icon card with Divvy mark.
- Empty title: `No groups yet`
- Description:
  `A group is a circle of people you split with - roommates, a trip, brunch crew. You only set it up once.`
- Three setup rows:
  - `1` `Name a group`
  - `2` `Add a few people`
  - `3` `Split your first bill`

### Primary CTA

- Bottom primary button:
  - Text: `+ Create your first group`
  - Blue to purple gradient
- Footer copy: `No login - No phone numbers - Just names`

### User Actions

- Tapping `+ Create your first group` navigates to the Create Group screen.
- Tapping the avatar at the top-right opens Settings for currency, name, and theme.

### Feedback And State Rules

- Only one path forward is shown: the CTA is the page's sole call to action.
- There is no bottom context strip in the empty state because no group exists yet.
- After the first group is created, this screen is replaced by the populated Home state.

## Implementation Notes

- The current implementation should be visually adjusted to these PNG references before checking
  off `Match mockup pixel-for-pixel`.
- The task's older FAB requirement conflicts with the populated mockup, which shows an inline
  dashed create-group control and a bottom `+ New split` CTA instead of a bottom-right FAB. Treat
  the mockup as the visual source of truth and the task prose as the functional checklist unless a
  product decision says otherwise.
