# Design System

> Read this when working on UI components, styling, or visual design.

## Foundations

This template uses **NativeWind v4** (Tailwind for React Native) via `@repo/ui`. All design decisions should use Tailwind utility classes via the `className` prop.

### Colors

Define your project's color palette in `apps/mobile/tailwind.config.js`. The defaults ship with Tailwind's full palette.

| Token | Usage |
|---|---|
| `blue-600` | Primary action color (buttons, links) |
| `gray-*` | Neutral text, borders, backgrounds |
| `red-600` | Destructive actions, error states |
| `green-600` | Success states |

### Typography

React Native does not load Google Fonts implicitly. Use `expo-font` + `@expo-google-fonts/*` to load custom fonts at app startup.

| Scale | Class | Usage |
|---|---|---|
| Heading 1 | `text-3xl font-bold` | Screen titles |
| Heading 2 | `text-xl font-semibold` | Section headings |
| Body | `text-base` | Default text |
| Small | `text-sm` | Labels, captions |

### Spacing

Use Tailwind's default spacing scale. Prefer `gap-*` on flex containers over margins where possible.

### Dark Mode

NativeWind reads the system color scheme automatically. Use `dark:` variants for component-level dark styles. Wrap the root layout in a theme provider if you need manual override.

## Component Guidelines

- All shared components belong in `packages/ui/src/components/`.
- Every component **must have a corresponding test file** (`*.test.tsx`).
- Use `cn()` from `@repo/utils` for conditional class merging — never string concatenation.
- Expose `className` (and `textClassName` where text is rendered internally) as props to allow consumers to override styles.
- Use `React.forwardRef` for all interactive elements to ensure composability.
- Prefer `Pressable` over `TouchableOpacity` / `TouchableHighlight` — it is the modern, accessible primitive.

## Accessibility

- Every interactive element must have an `accessibilityRole` (e.g. `"button"`, `"link"`, `"header"`).
- Use `accessibilityState` (`disabled`, `busy`, `selected`, `checked`) to expose component state to assistive tech.
- Use `accessibilityLabel` when the visible text is insufficient or absent (icon-only buttons, decorative spinners).
- One `accessibilityRole="header"` per primary screen heading is the React Native equivalent of a single `<h1>`.
