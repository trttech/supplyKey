# Design System Specification: Industrial Precision
 
## 1. Overview & Creative North Star: "The Kinetic Monolith"
This design system moves beyond the standard B2B "SaaS dashboard" look to embrace the raw, authoritative power of the maritime, mining, and heavy supply chain industries. Our Creative North Star is **The Kinetic Monolith**.
 
The aesthetic is "Rugged but Modern"—it should feel as sturdy as a deep-sea vessel but as precise as a laser-guided surveyor. We achieve this through **Organic Brutalism**: a layout philosophy that uses heavy, deliberate typography and expansive whitespace to organize massive datasets. We break the "template" look by using intentional asymmetry, where data density is balanced by large, editorial-style display headings and overlapping surface layers that suggest physical depth.
 
---
 
## 2. Colors: Deep Maritime Tones & Structural Depth
The palette has shifted from high-visibility orange to a sophisticated maritime and mineral scheme, using deep blues and cool slates to convey stability and technical precision.
 
### The Palette
*   **Primary (`#003F63`):** A deep, authoritative maritime blue used for "Critical Path" actions and brand presence.
*   **Secondary (`#68798a`):** A slate blue-gray for supporting UI elements and secondary actions.
*   **Tertiary (`#5d3002`):** A dark mineral bronze used sparingly for high-contrast highlights or decorative accents.
*   **Neutral Hierarchy:** A base of `#75777a` informs a range of grays that replaces the need for lines.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts.
*   **Surface Hierarchy & Nesting:** Treat the UI as a physical stack. 
    *   *Base:* `surface` (derived from neutral)
    *   *Sectioning:* `surface-container-low`
    *   *Interactive Elements:* `surface-container-lowest`
*   **Signature Textures:** Use subtle linear gradients for primary CTAs to provide a "forged" metallic sheen rather than a flat, "plastic" button feel.
 
---
 
## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance "rugged" brand impact with "precise" data readability.
 
*   **Display & Headlines (Manrope):** This is our "Industrial Voice." Manrope’s geometric but slightly softened terminals provide a modern, engineered feel. Use `display-lg` (3.5rem) for high-level KPIs.
*   **Body & Labels (Inter):** Inter is our "Precision Tool." It is used for all data-heavy contexts. The tall x-height ensures readability in complex supply manifests.
*   **Hierarchy Note:** Pair large `headline-lg` with significantly smaller `label-md` in `on_surface_variant` to create a sophisticated, high-contrast tension.
 
---
 
## 4. Elevation & Depth: Tonal Layering
In this system, depth is felt, not seen. We avoid the "floating card" look in favor of **Tonal Layering**.
 
*   **The Layering Principle:** Depth is achieved by stacking containers. A `surface-container-lowest` card placed inside a `surface-container-high` zone creates a natural, soft "lift" without a single shadow.
*   **Spacious Layouts:** With a spacing scale of `2`, the UI embraces a "Normal" density that allows technical data to breathe, moving away from the cramped layouts of legacy industrial software.
*   **The "Ghost Border" Fallback:** If a container sits on a background of the same color, use the `outline-variant` token at 15% opacity.
*   **Glassmorphism:** For top navigation bars or floating action panels, use `surface` at 80% opacity with a `backdrop-blur: 12px`.
 
---
 
## 5. Components: Ruggedized Primitives
 
### Buttons
*   **Primary:** Heavy weight. Use `primary` background with a subtle `1` (subtle) roundedness.
*   **Tertiary:** No background, no border. Use `label-md` in all-caps with `primary` color for a "technical drawing" aesthetic.
 
### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use the **Spacing Scale** (Level 2) to create "active whitespace."
*   **Data Density:** Use `body-sm` for secondary data points to maintain clarity within the more spacious layout.
 
### Input Fields
*   **Style:** Minimalist. No full-box borders. Use a `surface-container-highest` background with a thick 2px bottom-accent in `outline` when focused.
 
### Signature Component: The "Status Monolith"
*   A large, vertical chip used in dashboards. It uses `primary_container` for the background and `on_primary_container` for text, utilizing a bold `headline-sm` font.
 
---
 
## 6. Do’s and Don’ts
 
### Do
*   **Do** use asymmetrical layouts to break the standard grid.
*   **Do** use the `1` (subtle) roundedness for most components to maintain a "machined" edge.
*   **Do** utilize the new maritime `primary` (#003F63) to establish a sense of modern engineering and reliability.
 
### Don't
*   **Don't** use 100% black (#000000) for large text blocks; use `on_surface` to maintain a premium feel.
*   **Don't** use "Drop Shadows" on cards. Use background color shifts instead.
*   **Don't** revert to compact spacing; maintain the `2` level spacing to ensure the "Monolith" feel is not compromised by clutter.
 
---
 
*Director's Note: The transition to deep maritime tones reinforces our authority in global logistics. Maintain the machined edges and tonal depth to ensure the tool feels as reliable as the hardware it monitors.*