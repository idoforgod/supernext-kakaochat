---
description: UI/UX Design System Guidelines
globs: src/**/*.{ts,tsx,css}
---

# UI/UX Design System Guidelines

## Color System

### Brand Colors (Purple-based)

**Primary:**
```
- Base: hsl(270 60% 50%) - #8B5CF6 (Main brand color)
- Light: hsl(270 70% 65%) - #A78BFA
- Dark: hsl(270 70% 40%) - #7C3AED
```

**Secondary:**
```
- Pink Accent: hsl(300 60% 60%) - #E879F9 (Events, highlights)
- Blue Accent: hsl(240 60% 60%) - #818CF8 (Info, links)
```

**Neutral (Warm Gray):**
```
- 50: hsl(270 20% 98%) - Background
- 200: hsl(270 12% 88%) - Border
- 500: hsl(270 8% 50%) - Muted text
- 700: hsl(270 10% 30%) - Body text
- 900: hsl(270 15% 15%) - Heading
```

**Semantic:**
```
- Success: hsl(150 60% 45%) - #2DD4BF (Mint green)
- Warning: hsl(40 95% 55%) - #FBBF24 (Amber)
- Error: hsl(350 85% 60%) - #F87171 (Coral red)
- Info: hsl(200 85% 55%) - #38BDF8 (Sky blue)
```

### Color Usage Rules

**Do:**
- Use primary purple for main actions (buttons, links)
- Use warm gray neutrals for text and borders
- Use semantic colors for status indicators
- Maintain WCAG AA contrast ratios (4.5:1 for text)

**Don't:**
- Mix multiple accent colors in the same component
- Use pure black (#000) or pure white (#FFF) for text
- Apply primary colors to large background areas

---

## Typography

### Font Scale

```
Hero: text-5xl (48px) font-bold tracking-tight
H1: text-4xl (36px) font-bold
H2: text-3xl (30px) font-semibold
H3: text-xl (20px) font-semibold
Body Large: text-lg (18px) font-normal leading-relaxed
Body: text-base (16px) font-normal leading-relaxed
Body Small: text-sm (14px) font-normal
Caption: text-xs (12px) font-medium
```

### Typography Rules

**Do:**
- Use clear hierarchy (H1 → H2 → H3 → Body)
- Apply `leading-relaxed` for body text (1.625)
- Use `font-semibold` or `font-bold` for headings
- Limit line length to 60-75 characters for readability

**Don't:**
- Skip heading levels (H1 → H3)
- Use more than 3 font weights in a single view
- Center-align long paragraphs (>3 lines)
- Use font sizes smaller than 12px

---

## Spacing System

### Container & Layout

```
Container:
- Max-width: 1280px (max-w-7xl)
- Padding: px-6 (mobile), px-8 (tablet), px-12 (desktop)

Section Spacing:
- Small: py-8 (32px)
- Medium: py-12 (48px)
- Large: py-16 (64px)
- XLarge: py-24 (96px)

Component Spacing:
- Tight: gap-2 (8px)
- Normal: gap-4 (16px)
- Relaxed: gap-6 (24px)
- Loose: gap-8 (32px)
```

### Spacing Rules

**Do:**
- Use consistent spacing scale (multiples of 4px)
- Apply generous spacing between sections (48px+)
- Use `gap` utilities for flex/grid layouts
- Maintain consistent padding within components

**Don't:**
- Use arbitrary spacing values (e.g., `p-[13px]`)
- Mix different spacing units (px, rem, em)
- Stack multiple margin utilities (`mt-4 mb-6`)

---

## Border & Shadow

### Border Radius

```
- Small: rounded-lg (8px) - Buttons, inputs
- Medium: rounded-xl (12px) - Cards, modals
- Large: rounded-2xl (16px) - Image cards
- Full: rounded-full - Avatars, badges
```

### Shadows (Purple-tinted)

```
- sm: 0 1px 2px 0 rgba(139, 92, 246, 0.05)
- md: 0 4px 6px -1px rgba(139, 92, 246, 0.1),
      0 2px 4px -1px rgba(139, 92, 246, 0.06)
- lg: 0 10px 15px -3px rgba(139, 92, 246, 0.1),
      0 4px 6px -2px rgba(139, 92, 246, 0.05)
- xl: 0 20px 25px -5px rgba(139, 92, 246, 0.1),
      0 10px 10px -5px rgba(139, 92, 246, 0.04)
```

### Shadow Rules

**Do:**
- Use subtle shadows for depth (not borders)
- Apply stronger shadows on hover states
- Use purple-tinted shadows (matching brand)
- Stack multiple shadow layers for depth

**Don't:**
- Use hard borders for elevation (prefer shadows)
- Apply shadows to flat UI elements
- Mix shadow directions in the same view

---

## Component Patterns

### Buttons

**Primary:**
```tsx
bg-primary text-white
hover:bg-primary-dark shadow-lg
rounded-lg px-6 py-3
font-semibold
transition-all duration-200
```

**Secondary:**
```tsx
border-2 border-primary text-primary
hover:bg-primary hover:text-white
rounded-lg px-6 py-3
```

**Ghost:**
```tsx
text-primary hover:bg-primary/10
rounded-lg px-4 py-2
```

### Cards

```tsx
border border-gray-200
rounded-xl
shadow-md
hover:shadow-xl hover:-translate-y-1
transition-all duration-300
```

**Rules:**
- Always include hover states
- Use consistent border radius (rounded-xl)
- Apply transition for smooth animations
- Maintain aspect ratios for images (aspect-[4/3])

### Forms

**Input Fields:**
```tsx
border-2 border-gray-200
focus:border-primary focus:ring-2 focus:ring-primary/20
rounded-lg px-4 py-3
placeholder:text-gray-400
```

**Labels:**
```tsx
text-sm font-semibold text-gray-700 mb-2
```

**Helper Text:**
```tsx
text-xs text-gray-500 mt-1
```

**Rules:**
- Always show focus states (ring + border color)
- Use semibold labels for clarity
- Place helper text below inputs
- Show error states in red (error color)

### Images

```tsx
aspect-[4/3] (cards)
aspect-[21/9] (hero banners)
rounded-xl overflow-hidden
object-cover
```

**Rules:**
- Always specify aspect ratio
- Apply rounded corners (rounded-xl or rounded-2xl)
- Use `object-cover` for cropping
- Add gradient overlays for text on images

---

## Interaction Design

### Hover States

**Cards:**
```
- transform: translateY(-4px)
- shadow: md → xl
- image: scale(1.05)
- transition: duration-300
```

**Buttons:**
```
- brightness: increase
- shadow: md → lg
- scale: scale-105
- transition: duration-200
```

**Links:**
```
- color: transition
- underline: underline-offset-4
- transition: duration-200
```

### Focus States

```
- ring-2 ring-primary ring-offset-2
- outline-none
- border-primary
```

### Transition Timing

```
- Fast (200ms): Buttons, links, toggles
- Normal (300ms): Cards, dropdowns, modals
- Slow (500ms): Page transitions, large elements
- Easing: ease-in-out
```

### Interaction Rules

**Do:**
- Provide immediate visual feedback (<100ms)
- Use consistent timing across similar elements
- Apply hover states to interactive elements
- Show clear focus indicators for accessibility

**Don't:**
- Create hover states without transitions
- Use animations longer than 500ms
- Apply hover effects to disabled elements
- Forget keyboard focus states

---

## Layout Patterns

### Header (Navigation)

```tsx
sticky top-0 z-50
backdrop-blur-md bg-white/80
shadow-sm
h-16 (desktop), h-14 (mobile)
```

**Structure:**
```
[Logo]  [Nav Items]  [User Actions]
```

### Content Container

```tsx
max-w-7xl mx-auto
px-6 md:px-8 lg:px-12
```

### Grid Layouts

**Card Grids:**
```tsx
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
gap-6 md:gap-8
```

**Form Layouts:**
```tsx
grid grid-cols-1 md:grid-cols-2
gap-4 md:gap-6
```

### Layout Rules

**Do:**
- Use consistent container max-width (1280px)
- Apply responsive padding (mobile → desktop)
- Use CSS Grid for 2D layouts
- Use Flexbox for 1D layouts
- Maintain consistent gap spacing

**Don't:**
- Exceed container max-width without purpose
- Mix fixed and fluid layouts arbitrarily
- Use nested containers unnecessarily

---

## Accessibility

### Color Contrast

- Text on background: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus Indicators

```tsx
focus-visible:ring-2 focus-visible:ring-primary
focus-visible:ring-offset-2
outline-none
```

### Touch Targets

- Minimum size: 44x44px (mobile)
- Spacing between targets: 8px minimum

### Accessibility Rules

**Do:**
- Provide keyboard navigation for all interactions
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add ARIA labels when needed
- Test with screen readers
- Provide alt text for images

**Don't:**
- Rely on color alone for information
- Remove focus indicators
- Use `div` for buttons
- Set `tabindex` arbitrarily

---

## Responsive Design

### Breakpoints

```
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
```

### Mobile-First Approach

```tsx
// Mobile default
text-base
px-4

// Tablet
md:text-lg
md:px-6

// Desktop
lg:text-xl
lg:px-8
```

### Responsive Rules

**Do:**
- Design mobile-first, enhance for desktop
- Test on actual devices (not just browser resize)
- Use responsive images (`srcset`, `sizes`)
- Optimize touch interactions for mobile
- Adjust spacing for different screen sizes

**Don't:**
- Hide critical content on mobile
- Use horizontal scrolling
- Make buttons smaller than 44x44px on mobile
- Ignore landscape orientation

---

## Animation Guidelines

### When to Animate

- State changes (loading → loaded)
- User feedback (button click)
- Attention guidance (new message)
- Transitions (page changes)

### Animation Rules

**Do:**
- Keep animations under 500ms
- Use `ease-in-out` for natural motion
- Provide reduced motion alternatives
- Animate transforms (not layout properties)

**Don't:**
- Animate on page load (annoying)
- Use easing like `ease-in` alone (feels abrupt)
- Animate `width`, `height`, `top`, `left` (triggers reflow)
- Chain too many animations (overwhelming)

---

## Dark Mode Support

### Color Adjustments

**Light Mode:**
```
--background: hsl(270 20% 98%)
--foreground: hsl(270 15% 15%)
--primary: hsl(270 60% 50%)
```

**Dark Mode:**
```
--background: hsl(270 15% 10%)
--foreground: hsl(270 20% 98%)
--primary: hsl(270 50% 60%) (lower saturation)
```

### Dark Mode Rules

**Do:**
- Lower saturation for dark mode colors
- Adjust contrast ratios for readability
- Test all states in both modes
- Use CSS variables for easy switching

**Don't:**
- Simply invert colors
- Use pure black (#000) backgrounds
- Forget to adjust shadows

---

## Performance Considerations

### CSS Best Practices

**Do:**
- Use Tailwind's JIT mode (only generate used classes)
- Leverage CSS variables for theming
- Minimize custom CSS (prefer utilities)
- Group related styles logically

**Don't:**
- Write inline styles
- Create duplicate utility classes
- Use `!important` excessively
- Nest selectors deeply (>3 levels)

### Image Optimization

**Do:**
- Use Next.js `<Image>` component
- Specify width and height
- Apply lazy loading (`loading="lazy"`)
- Use modern formats (WebP, AVIF)
- Compress images before upload

**Don't:**
- Use unoptimized images
- Skip alt text
- Load all images eagerly

---

## Common Mistakes

### ❌ Anti-Patterns

**Color Usage:**
```tsx
// Bad: Using arbitrary colors
<div className="text-[#a855f7]">

// Good: Using design tokens
<div className="text-primary">
```

**Spacing:**
```tsx
// Bad: Inconsistent spacing
<div className="mt-3 mb-5 px-2">

// Good: Consistent spacing scale
<div className="my-4 px-4">
```

**Typography:**
```tsx
// Bad: No hierarchy
<div className="text-lg">Title</div>
<div className="text-base">Body</div>

// Good: Clear hierarchy
<h2 className="text-3xl font-semibold">Title</h2>
<p className="text-base leading-relaxed">Body</p>
```

**Hover States:**
```tsx
// Bad: No transition
<button className="hover:bg-primary">

// Good: Smooth transition
<button className="hover:bg-primary transition-colors duration-200">
```

---

## Quick Reference

### Component Checklist

**Every Interactive Component Should Have:**
- [ ] Hover state
- [ ] Focus state (keyboard navigation)
- [ ] Disabled state (if applicable)
- [ ] Loading state (if async)
- [ ] Error state (if can fail)
- [ ] Transition/animation
- [ ] Accessible markup (semantic HTML, ARIA)

### Before Committing

**Design Consistency:**
- [ ] Colors match design system (no arbitrary values)
- [ ] Spacing uses standard scale (4px increments)
- [ ] Typography follows hierarchy
- [ ] Shadows are purple-tinted
- [ ] Border radius is consistent

**Responsiveness:**
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Touch targets are 44x44px minimum

**Accessibility:**
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] Alt text for images

**Performance:**
- [ ] Images optimized
- [ ] No layout shifts
- [ ] Animations under 500ms
- [ ] No excessive re-renders

---

## Resources

### Design Tools
- [Coolors](https://coolors.co) - Color palette generator
- [Color Hunt](https://colorhunt.co) - Color inspiration
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Documentation
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Inspiration
- [Airbnb](https://airbnb.com) - Layout and spacing
- [Stripe](https://stripe.com) - Purple branding
- [Linear](https://linear.app) - Minimal design

---

**Version**: 1.0
**Last Updated**: 2025-10-13