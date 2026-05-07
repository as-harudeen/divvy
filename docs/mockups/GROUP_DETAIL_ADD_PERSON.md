# Group Detail Add People Mockup

Visual source of truth for the Add People bottom sheet opened from Group Detail.

This reference was added from the Claude design after the initial Group Detail task write-up. Use it
for future visual reviews of the Group Detail add-member flow, especially the multi-select behavior
and the unified search-or-create interaction.

## Source Files

- Sheet reference: [GROUP_DETAIL_ADD_PERSON.png](./GROUP_DETAIL_ADD_PERSON.png)
- Creating-state reference: [GROUP_DETAIL_ADD_PERSON_CREATE.png](./GROUP_DETAIL_ADD_PERSON_CREATE.png)
- Interaction summary source: Claude design notes screenshot supplied in chat

## Canvas

- Screenshot file: 247 x 482 px
- Target device look: iPhone-style rounded device frame with status bar, dynamic island, and home
  indicator visible in the mockup export
- Presentation: bottom sheet over the dimmed Group Detail screen
- Background screen: the current group stays visible behind the modal with a dark scrim
- Initial height: full-height browsing state before the keyboard is raised
- App background: very light neutral gray, not pure white
- Primary action color: brand blue
- Primary text color: deep navy
- Secondary text color: muted gray

## Entry Points

- Tap the `+ Add` member slot in Group Detail.
- Tap `Edit` in Group Detail, then choose the add-people action.
- Both entry points open the same Add People bottom sheet for the current group.

## Sheet Layout

- Bottom sheet is anchored to the bottom of the screen with rounded top corners.
- Small grabber handle appears centered at the top of the sheet.
- Header row is sticky:
  - Left action: `Cancel`
  - Center title: `Add people`
  - Right action: `Add (n)`
- Selected people appear in a horizontal pill strip below the header.
- The selected pill strip remains visible while the user scrolls the people list.
- Search field appears below the selected pill strip.
- Main list section begins below the search field.

## Information Shown

Claude labels this flow as adding people from Group Detail.

- Header confirmation count reflects the current selection count.
  - Reference state: `Add (2)`
- Selected people are shown as compact pills with:
  - Avatar initial or color
  - Person name
  - Remove affordance
  - Reference selected people: `Riya`, `Theo`
- One unified search field:
  - Placeholder: `Search or type a new name`
  - Filters existing people when matches exist.
  - Creates a new person when there is no match.
- People list section:
  - Header: `FROM YOUR GROUPS`
  - Count appears on the right, for example `7 people`
  - Pool is unified across all of the user's groups, not scoped to only recent people.
  - Each row includes avatar, name, and last-seen context.
- Reference rows shown:
  - `Riya` - `Lake trip - 3d ago`
  - `Sam` - `Office lunch - 1w ago`
  - `Priya` - `Mia's birthday - 2w ago`
  - `Theo` - `Lake trip - 3d ago`
  - `Noor` - `Office lunch - 1w ago`
  - `Devon` - `Lake trip - 3d ago`
  - `Kai` - `Mia's birthday - 2w ago`
- People already in the current group remain visible in the list but are locked.
  - Locked rows are dimmed.
  - Locked rows show an `In group` tag.
  - Locked rows cannot be selected.

## User Actions

- Tap a selectable row to toggle that person in the current selection.
- Tap the remove affordance on a selected pill to remove that person from the selection.
- Tap `Add (n)` to add every selected person to the current group and dismiss the sheet.
- Tap the search field to raise the keyboard and enter the creating/searching state.
- Type in the unified search field to filter existing people.
- Type a name with no exact match to create a new person from the same field.
- Swipe down on the grabber or tap `Cancel` to dismiss without saving changes.

## Feedback And State Rules

- Multi-select is the default behavior because adding several people is the common case.
- A selected row uses a blue-tinted background.
- A selected row's checkbox fills with brand blue and a check mark.
- An unselected row keeps a white background and an empty checkbox.
- `Add` is muted gray while no people are selected.
- `Add (n)` turns brand blue once at least 1 person is selected.
- The confirmation count updates immediately as people are selected or removed.
- Dismissing through `Cancel` or swipe-down discards the pending selection.
- When the keyboard is not shown, keep the sheet at full height for browsing.
- When the search field is focused, the keyboard rises and the sheet switches to the creating state.
- Existing group members are visible but not actionable; use the dimmed locked treatment with the
  `In group` tag to explain why.

## Implementation Notes

- Treat this as a Group Detail-owned bottom sheet, not as a separate routed screen.
- The data source should combine eligible people from all groups owned by or visible to the user.
- De-duplicate people across groups before rendering the unified pool.
- Last-seen context should identify the group and relative time where that person last appeared.
- Adding selected people should update only the current group membership and then return to Group
  Detail.
- New people created through the unified search field should be added to the global people store and
  selected for the current add operation.
