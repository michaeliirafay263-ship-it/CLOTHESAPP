# React Web App — Professional Product Development Skills

## Purpose

This skill set defines how the AI coding agent should design, build, modify, test, and maintain a React web application.

The primary design goal is a product that feels:

- Natural and intuitive
- Human-designed
- Professional
- Clean and modern
- Consistent
- Fast and reliable
- Clearly non-AI-generated

These rules should be treated as default project standards unless the user explicitly asks for something different.

---

## 1. Natural UI & UX

- Design interfaces around familiar user expectations.
- Prioritize usability over visual novelty.
- Make important actions obvious.
- Keep navigation predictable.
- Avoid interfaces that feel experimental without a clear usability benefit.
- Every screen should have a clear purpose.

## 2. Professional Visual Design

- Use strong visual hierarchy.
- Maintain balanced spacing and alignment.
- Use restrained, intentional decoration.
- Keep layouts clean and purposeful.
- Avoid visual clutter.
- Design as a professional production product, not a design demo.

## 3. No Gradients

- Do not use gradients by default.
- Avoid gradient backgrounds, buttons, text, borders, and decorative effects.
- Prefer solid colors and subtle tonal differences.
- Only use a gradient if the user explicitly requests one.

## 4. No Emojis

- Never use emojis in the UI.
- Do not use emojis as icons, buttons, headings, status indicators, navigation elements, or decoration.
- Use proper icons or text instead.

## 5. Natural Iconography

- Use professional, recognizable icon libraries when appropriate.
- Icons must communicate a clear meaning.
- Keep icon style, stroke weight, size, and visual density consistent.
- Do not use icons merely because an empty space exists.
- Prefer familiar symbols over unusual decorative icons.
- Ensure icons have accessible labels when their meaning is not obvious.

## 6. Non-AI Appearance

Avoid the visual patterns commonly associated with generic AI-generated interfaces, including:

- Excessive glassmorphism
- Neon colors
- Glowing borders
- Excessive blur
- Floating gradient blobs
- Unnecessary futuristic effects
- Excessive rounded cards
- Overuse of shadows
- Excessive pill-shaped controls
- Decorative AI-style sparkles
- Overly animated interfaces
- Generic "AI dashboard" layouts

The application should feel like a thoughtfully designed conventional professional product.

## 7. Design Consistency

Establish and consistently follow a design system covering:

- Colors
- Typography
- Spacing
- Border radius
- Borders
- Shadows
- Buttons
- Inputs
- Cards
- Navigation
- Icons
- Feedback states

Do not introduce random visual styles from one screen to another.

## 8. Responsive Design

Design intentionally for:

- Mobile phones
- Tablets
- Laptops
- Desktop monitors
- Large screens

Do not simply shrink a desktop interface.

Check:

- Navigation
- Text wrapping
- Button sizes
- Tables
- Cards
- Forms
- Images
- Modals
- Sidebars
- Touch targets

## 9. Accessibility

Use accessible web practices:

- Semantic HTML
- Proper heading hierarchy
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Meaningful labels
- Accessible form controls
- Appropriate ARIA only when necessary
- Alternative text for meaningful images

Do not sacrifice accessibility for appearance.

## 10. Typography

- Use a deliberate typography hierarchy.
- Limit unnecessary font variations.
- Prioritize readability.
- Avoid excessive use of bold or oversized text.
- Keep line lengths comfortable.
- Make headings and body text visually distinct.

## 11. Spacing & Layout Discipline

- Use a consistent spacing scale.
- Align related elements.
- Maintain visual rhythm.
- Avoid cramped layouts.
- Avoid excessive empty space.
- Keep containers and content widths intentional.

## 12. Interaction Design

All interactive elements should have predictable behavior.

Consider appropriate states such as:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Success
- Error

Do not create interactions that users cannot understand.

## 13. Micro-interactions

- Use animation only when it improves usability or provides useful feedback.
- Keep transitions subtle and fast.
- Avoid animation for decoration alone.
- Respect reduced-motion preferences where appropriate.

## 14. Performance

Build with performance in mind.

- Optimize images.
- Avoid unnecessary re-renders.
- Lazy-load expensive resources when appropriate.
- Avoid unnecessary API requests.
- Keep bundles reasonable.
- Avoid unnecessary dependencies.
- Use efficient rendering patterns.

Do not optimize prematurely at the expense of readability, but do not ignore obvious performance problems.

## 15. Component Architecture

- Build reusable React components.
- Avoid unnecessary duplication.
- Keep components understandable.
- Separate reusable UI from page-specific logic where appropriate.
- Avoid creating extremely large components.
- Reuse existing components before creating duplicates.

## 16. Clean React Code

- Follow modern React practices.
- Keep code readable.
- Use meaningful names.
- Avoid deeply nested or unnecessarily complicated logic.
- Keep business logic separate from presentation where appropriate.
- Remove unused imports, variables, and components.
- Avoid hacks that create future maintenance problems.

## 17. State Management Discipline

- Prefer local component state when possible.
- Do not introduce global state unnecessarily.
- Use shared state only when multiple parts of the application genuinely need it.
- Keep state ownership clear.
- Avoid duplicating the same source of truth.

## 18. Data & API Handling

Every data-driven interface should consider:

- Loading
- Success
- Empty
- Error
- Retry

Do not assume API responses are always available or correctly formatted.

Handle failures gracefully and provide useful feedback to users.

## 19. Form & Validation UX

Forms should be:

- Clear
- Predictable
- Easy to complete
- Properly labeled

Validation should:

- Explain what is wrong
- Identify the affected field
- Avoid unnecessary technical language
- Preserve valid user input
- Prevent accidental duplicate submissions

## 20. Empty & Error States

Do not leave users with blank screens.

Design meaningful states for:

- No data
- Failed requests
- Missing permissions
- Invalid routes
- Network problems
- Expired sessions
- Search results with no matches

Keep error messages useful and human-readable.

## 21. Security

- Never expose secrets or private API keys in frontend code.
- Never place sensitive credentials in source control.
- Use environment variables appropriately.
- Treat frontend validation as supplementary; enforce authorization on the backend.
- Do not expose data merely because it is hidden in the UI.
- Handle authentication and user data carefully.
- Avoid logging sensitive information.

## 22. SEO & Web Standards

Where applicable:

- Use semantic HTML.
- Provide meaningful page titles.
- Provide appropriate metadata.
- Use descriptive URLs.
- Use proper headings.
- Provide useful image alt text.
- Avoid unnecessary client-side rendering barriers for important indexable content.

## 23. Browser Compatibility

- Prefer stable web platform features.
- Avoid experimental APIs unless explicitly required.
- Consider common modern browsers.
- Test important interactions after implementation.
- Provide reasonable fallbacks when appropriate.

## 24. Maintainability

Prefer:

- Simple solutions
- Clear abstractions
- Reusable components
- Predictable architecture
- Small, focused changes

Avoid:

- Over-engineering
- Clever but confusing code
- Unnecessary abstraction
- Duplicate implementations
- Temporary hacks left in production

## 25. Dependency Discipline

Before adding a package:

1. Check whether the existing project already provides the capability.
2. Check whether native browser functionality is sufficient.
3. Check whether an existing dependency can solve the problem.
4. Add a new dependency only when it provides meaningful value.

Do not install packages simply because they are popular.

## 26. Image & Asset Discipline

- Use appropriate image dimensions and formats.
- Avoid unnecessarily large files.
- Maintain consistent aspect ratios.
- Use meaningful alt text.
- Avoid generic AI-looking imagery unless specifically requested.
- Do not add decorative images that do not improve the experience.

## 27. Content & Copywriting

UI copy should feel natural and human.

- Use concise language.
- Prefer familiar words.
- Avoid robotic phrases.
- Avoid excessive marketing language.
- Avoid unnecessary exclamation marks.
- Make buttons action-oriented.
- Explain technical errors in user-friendly language.

## 28. Mobile-First Thinking

On small screens:

- Prioritize important actions.
- Keep touch targets usable.
- Avoid horizontal overflow.
- Make navigation practical.
- Ensure forms are easy to complete.
- Make text readable without unnecessary zooming.
- Do not simply compress desktop layouts.

## 29. Progressive Enhancement

Core functionality should remain usable when optional enhancements fail.

Do not make essential functionality depend unnecessarily on:

- Animations
- Decorative effects
- Non-essential third-party resources
- Experimental browser features

## 30. Testing & Verification

After implementing a change:

- Run the relevant build or tests.
- Check the browser console.
- Check important routes.
- Test the changed interaction.
- Check responsive layouts.
- Check loading and error states.
- Verify that existing functionality was not broken.

Never assume code works merely because it compiles.

## 31. Before-Editing Inspection

Before modifying existing code:

1. Inspect the relevant files.
2. Understand the current architecture.
3. Identify reusable components.
4. Understand existing styling patterns.
5. Understand how data currently flows.
6. Check whether the requested functionality already partially exists.

Do not immediately rewrite code without understanding it.

## 32. Minimal-Change Principle

When fixing or modifying an application:

- Change only what is necessary.
- Preserve working functionality.
- Avoid unnecessary refactoring.
- Do not replace existing architecture without a real reason.
- Do not redesign unrelated screens.

If a small targeted change solves the problem, prefer it over a rewrite.

## 33. No Fake Data in Production

- Clearly distinguish development/demo data from real application data.
- Do not leave fake users, fake products, fake statistics, placeholder records, or test content in production.
- Remove temporary development content when preparing the application for real use.
- Do not present mock information as real information.

## 34. Production Readiness

Before considering a feature complete, verify:

- Build succeeds.
- Important routes work.
- Responsive layouts work.
- Forms work.
- Authentication behavior is correct where applicable.
- Error handling exists.
- Loading states exist.
- Accessibility basics are satisfied.
- No obvious console errors remain.
- No secrets are exposed.
- Temporary test content is removed.
- Performance is reasonable.

## 35. Agent Self-Verification

The agent must verify its own work.

Do not simply report:

"Done."

Instead:

1. Explain what was changed.
2. Explain what was tested.
3. Report any remaining issues.
4. Distinguish verified behavior from assumptions.

If testing cannot be performed, state that clearly.

## 36. Don't Invent Requirements

The agent must not add features merely because it thinks they would be useful.

- Follow the user's requested scope.
- Preserve existing behavior unless a change is requested.
- Do not introduce unnecessary pages, features, libraries, animations, or architecture.
- Do not turn a small request into a large redesign.
- If a requirement is genuinely ambiguous and the ambiguity materially affects implementation, ask for clarification.
- Otherwise, choose the simplest reasonable interpretation.

---

# General Agent Workflow

For substantial tasks, follow this workflow:

### Step 1 — Understand

Read the user's request carefully.

Identify:

- What must change
- What must remain unchanged
- Relevant files
- Existing architecture
- Existing components
- Existing design patterns

### Step 2 — Inspect

Inspect the relevant project files before making changes.

Do not guess how the project works.

### Step 3 — Plan

Create a concise implementation plan for complex changes.

Prefer the smallest solution that satisfies the requirement.

### Step 4 — Implement

Make targeted changes while following all design and engineering rules in this skill.

### Step 5 — Verify

Run appropriate:

- Build commands
- Tests
- Linting
- Browser checks
- Responsive checks

### Step 6 — Review

Look for:

- Console errors
- Broken routes
- Visual inconsistencies
- Accessibility issues
- Unnecessary code
- Unused dependencies
- Regressions

### Step 7 — Report

Clearly state:

- What changed
- What was verified
- Any remaining issues
- Any assumptions made

---

# Design Decision Priority

When requirements conflict, prioritize:

1. User's explicit request
2. Existing project functionality and architecture
3. Usability
4. Accessibility
5. Security
6. Maintainability
7. Performance
8. Visual polish
9. Decorative effects

Never sacrifice functionality, accessibility, security, or maintainability merely for visual effects.

---

# Core Principle

Build software that feels like it was designed and engineered by a thoughtful professional team.

The application should be:

**Natural. Clear. Useful. Consistent. Accessible. Fast. Maintainable. Professional.**

Avoid unnecessary complexity and visual trends that make the application feel artificial or AI-generated.
