# Design System Strategy: Editorial Manga Tech

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Interactive Manuscript."** It is a digital experience that rejects the sterile, homogenized look of modern SaaS in favor of the kinetic energy, high contrast, and tactile imperfection of hand-drawn manga.

We are breaking the "template" look by treating the browser or mobile screen as a physical page of ink and paper. This system leverages **intentional asymmetry**, where decorative speed lines and hand-drawn stars bleed off the edges of containers, and **dynamic screentones** (halftones) provide texture where a standard UI would use flat grey. The goal is to create a playful, "Kawaii" tech aesthetic that feels simultaneously nostalgic for print media and cutting-edge in its execution.

---

## 2. Colors & Textures
The palette is rooted in the binary relationship between ink and paper. While we use a Material-based token set for systematic scaling, the visual output should always prioritize the "Manga Black" and "Manga White" contrast.

### The Palette
- **Primary (#000000):** Our "Inking" color. Used for heavy strokes, text, and decorative speed lines.
- **Surface (#F9F9F9):** Our "Paper" color. A slightly off-white that prevents eye strain while maintaining high contrast.
- **Secondary (#5E5E5E):** Used primarily for screentone textures and mid-tone halftones.

### The "No-Line" Rule (Functional)
In contrast to the "Heavy Ink" decorative rule, functional UI sectioning must **prohibit 1px solid grey borders**. Section boundaries are defined by:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Screentone Overlays:** Using a halftone dot pattern (repeating SVG) to define a sidebar or header area.
3.  **Heavy 4px Black Strokes:** Use these only for emphasized elements (like a "Hero Card"), never for simple layout dividers.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked paper sheets. Use `surface-container-lowest` for the base and `surface-container-highest` for nested interactive elements. This creates "tonal depth" without relying on realistic lighting.

### Signature Textures (The Manga Soul)
To move beyond a generic "B&W" look, utilize **Screentone Gradients**. Instead of a CSS linear gradient from black to transparent, use a halftone dot pattern that gets smaller/sparser. This provides a professional polish that feels authentically "printed."

---

## 3. Typography
Typography is our "Voice Actor." It should feel loud, expressive, and integrated into the art.

- **Headings (Epilogue):** Chosen for its geometric but slightly idiosyncratic weight. Headlines should be styled with **heavy letter-spacing** or **slight rotation (±1-2 degrees)** to mimic hand-placed manga sound effects (SFX).
- **Body (Plus Jakarta Sans):** This provides the "Tech" balance. It is clean, highly legible, and modern. Use `body-lg` for primary narrative text and `body-md` for data-heavy sections.
- **Visual Hierarchy:** Headlines should utilize `display-lg` to create massive "impact" moments, contrasting sharply with the structured, minimalist body text.

---

## 4. Elevation & Depth
We reject traditional "soft" UI depth in favor of **Tonal Layering** and **Graphic Shadows**.

- **The Layering Principle:** Depth is achieved by "stacking" surface tiers. A card (using `surface-container-lowest`) should sit on a background of `surface-container-low` to create a natural lift.
- **Ambient Manga Shadows:** Floating elements (like Modals or Tooltips) must use a high-offset, sharp shadow. Instead of a 10% black blur, use a **Halftone Shadow**: a repeating dot pattern offset by `8px` from the container, creating a "graphic" lift.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use `outline-variant` at 20% opacity. This prevents the "boxed-in" feel and keeps the layout airy.
- **Glassmorphism:** Use for floating Kawaii elements. Apply a `backdrop-blur` of 8px to a semi-transparent `surface` color to allow speed lines or decorative stars to peek through from the background layer.

---

## 5. Components

### Buttons
- **Primary:** `primary` (#000000) fill with `on-primary` text. No border-radius (`0px`). On hover, swap to a halftone pattern fill.
- **Secondary:** `surface` background with a heavy **3px black stroke**.
- **Tertiary:** Text-only with a hand-drawn underline (SVG) that appears on hover.

### Input Fields
- **Styling:** Square corners (`0px`). Use `surface-container-high` for the input background.
- **Active State:** A heavy 3px black stroke on the bottom only, mimicking a "line" in a sketchbook.

### Cards & Lists
- **Rule:** **Forbid the use of divider lines.**
- **Separation:** Use `16` (5.5rem) vertical white space to separate list items, or alternating background tints between `surface` and `surface-container-lowest`.
- **Kawaii Accents:** Every third or fourth card should feature a hand-drawn "sparkle" or "star" (from the Reference Image) tucked into the corner or overlapping the header.

### Speech Bubble Tooltips
Instead of standard rectangles, tooltips should be styled as **Speech Bubbles** with a hand-drawn "tail" pointing to the anchor. This reinforces the manga theme while providing functional feedback.

---

## 6. Do's and Don'ts

### Do:
- **Use "Rough" Edges:** Apply `clip-path` or SVG masks to large hero sections to create a hand-torn paper or rough ink edge.
- **Embrace Asymmetry:** Let a "Speed Line" decoration bleed off the right side of the screen while the text is aligned left.
- **Scale with Impact:** Use `display-lg` for key messages. In manga, the most important words are the biggest.

### Don't:
- **Don't use 1px solid grey borders:** This immediately makes the design look like a generic template. Use background shifts or heavy ink strokes instead.
- **Don't use standard border-radius:** Stick to the `0px` scale provided. Organic curves should only be used for "hand-drawn" decorative elements, never for functional buttons or inputs.
- **Don't over-clutter:** The "Minimalist" part of the prompt is key. Use the screentones and stars sparingly to highlight, not to overwhelm.