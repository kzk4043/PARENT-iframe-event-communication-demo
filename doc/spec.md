# Iframe Height Adjustment Demo - Specification

## Overview

This project demonstrates and tests iframe height adjustment behavior when the content inside an iframe dynamically changes its height.

## Purpose

The main goal is to verify whether a parent site's iframe automatically adjusts its height to fit the child site's content when the child site's height changes dynamically (e.g., through user interaction).

## Architecture

### Parent Site
- Contains an iframe element that embeds the child site
- Displays the iframe with initial dimensions
- May or may not implement height adjustment logic

### Child Site
- Embedded within the parent site's iframe
- Contains interactive elements (e.g., buttons) that trigger height changes
- Height changes can be triggered by:
  - Clicking on elements
  - Expanding/collapsing content
  - Adding/removing content dynamically

## Functionality Requirements

### Child Site Behavior
1. **Initial State**
   - Child site loads with a default height
   - Content is visible and interactive

2. **Height Change Trigger**
   - User clicks on a specific element (e.g., button, link, or content area)
   - Upon click, the child site's height changes (increases or decreases)
   - The height change should be visually noticeable

3. **Height Change Options**
   - Option A: Height increases (e.g., expanding content, showing more elements)
   - Option B: Height decreases (e.g., collapsing content, hiding elements)
   - Option C: Toggle between multiple height states

### Parent Site Behavior
1. **Iframe Display**
   - Iframe displays the child site
   - Initial iframe dimensions are set (width and height)

2. **Height Adjustment Observation**
   - Observe whether the iframe automatically adjusts to fit the child content
   - Document if scrolling appears or if content is clipped
   - Check if manual height adjustment is needed

## Technical Requirements

### Technologies
- HTML5
- CSS3
- JavaScript (for dynamic height changes and potential communication)

### Implementation Considerations
1. **Iframe Height Management**
   - Default iframe height (fixed or responsive)
   - Whether to use CSS `height: auto` or fixed pixel values
   - Potential need for JavaScript-based height adjustment

2. **Child Site Height Changes**
   - Use JavaScript to dynamically modify content
   - Change can be triggered by:
     - DOM manipulation (adding/removing elements)
     - CSS class toggling (showing/hiding content)
     - Content expansion/collapse

3. **Cross-Origin Considerations**
   - If parent and child are on different origins, postMessage API may be needed
   - If same origin, direct DOM access might be possible

## Testing Scenarios

1. **Scenario 1: Height Increase**
   - Click on child site element
   - Child site height increases
   - Verify: Does iframe adjust to show all content without scrolling?

2. **Scenario 2: Height Decrease**
   - Click on child site element
   - Child site height decreases
   - Verify: Does iframe adjust to remove extra space?

3. **Scenario 3: Multiple Height Changes**
   - Click multiple times to toggle between different heights
   - Verify: Does iframe consistently adjust to fit content?

4. **Scenario 4: Overflow Behavior**
   - If iframe doesn't adjust automatically
   - Verify: Does scrolling appear? Is content clipped?

## Expected Outcomes

The demo should clearly demonstrate:
- Whether iframes automatically adjust height when child content changes
- What happens when height adjustment doesn't occur automatically
- Potential solutions for ensuring proper height adjustment (if needed)

## File Structure

### Parent Repository (PARENT-iframe-event-communication-demo)
```
/
├── index.html              # Parent site HTML
├── styles.css              # Parent site styles
├── script.js               # Parent site JavaScript (if needed)
└── doc/
    └── spec.md             # This specification document
```

### Child Repository (CHILD-iframe-event-communication-demo)
```
/
├── index.html              # Child site HTML
├── styles.css              # Child site styles
└── script.js               # Child site JavaScript for height changes
```

## Deployment - GitHub Pages

### Repository Information

**Parent Site:**
- Repository URL: [https://github.com/kzk4043/PARENT-iframe-event-communication-demo](https://github.com/kzk4043/PARENT-iframe-event-communication-demo)
- GitHub Pages URL: `https://kzk4043.github.io/PARENT-iframe-event-communication-demo/`

**Child Site:**
- Repository URL: [https://github.com/kzk4043/CHILD-iframe-event-communication-demo](https://github.com/kzk4043/CHILD-iframe-event-communication-demo)
- GitHub Pages URL: `https://kzk4043.github.io/CHILD-iframe-event-communication-demo/`

### Deployment Strategy

Both parent and child sites are deployed as separate repositories to GitHub Pages (Option 1 - Separate Repositories).

**Advantages:**
- Clear separation of concerns
- Independent deployment cycles
- Easier to manage and maintain

### GitHub Pages Configuration

1. **Repository Settings**
   - Enable GitHub Pages in repository settings
   - Select source branch (typically `main` or `gh-pages`)
   - Select source folder (root directory or `/docs` folder)

2. **URL Structure**
   - Parent site URL: `https://kzk4043.github.io/PARENT-iframe-event-communication-demo/`
   - Child site URL: `https://kzk4043.github.io/CHILD-iframe-event-communication-demo/`
   - Iframe src in parent: `https://kzk4043.github.io/CHILD-iframe-event-communication-demo/`

3. **Cross-Origin Considerations**
   - If parent and child are on different GitHub Pages URLs, they are considered cross-origin
   - May need to use `postMessage` API for communication
   - Ensure proper CORS headers if needed

### Deployment Steps

1. **For Parent Site (PARENT-iframe-event-communication-demo repository):**
   ```bash
   # Push parent site files to repository root
   git add .
   git commit -m "Add parent site"
   git push origin main
   ```
   - Enable GitHub Pages in repository settings (Settings → Pages)
   - Select source branch: `main`
   - Select source folder: `/ (root)`
   - Access at: `https://kzk4043.github.io/PARENT-iframe-event-communication-demo/`

2. **For Child Site (CHILD-iframe-event-communication-demo repository):**
   ```bash
   # Push child site files to repository root
   git add .
   git commit -m "Add child site"
   git push origin main
   ```
   - Enable GitHub Pages in repository settings (Settings → Pages)
   - Select source branch: `main`
   - Select source folder: `/ (root)`
   - Access at: `https://kzk4043.github.io/CHILD-iframe-event-communication-demo/`

3. **Update Parent Site Iframe:**
   - Update iframe `src` attribute in parent site to point to child site's GitHub Pages URL
   - Example: `<iframe src="https://kzk4043.github.io/CHILD-iframe-event-communication-demo/"></iframe>`

### Testing After Deployment

1. Access parent site via GitHub Pages URL
2. Verify iframe loads child site correctly
3. Test height adjustment functionality
4. Check browser console for any cross-origin errors
5. Verify behavior matches local testing

