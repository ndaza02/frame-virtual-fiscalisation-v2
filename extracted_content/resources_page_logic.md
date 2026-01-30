# Resources Page Logic & ClickUp Integration

This document outlines the architecture of the **Resources** page (`resources.html`), specifically focusing on the ClickUp form integration and the "Auto-Reveal" feature that opens specific forms based on URL links.

## 1. ClickUp Forms Integration

The Resources page embeds several ClickUp forms using `<iframe>` elements wrapped in custom accordions. Each form is identified by a unique ID in the HTML.

### Form IDs & Links

| Form Name | HTML ID | ClickUp Form URL |
| :--- | :--- | :--- |
| **Mobile App Form** | `resources-form-mobile` | `https://forms.clickup.com/7278763/f/6y45b-43772/AQB9UM50RL7TVCOELL` |
| **Desk-Web App Form** | `resources-form-desk` | `https://forms.clickup.com/7278763/f/6y45b-42172/E7ZG8VFWXL2BJ63OUP` |
| **Library Integration Form** | `resources-form-library` | `https://forms.clickup.com/7278763/f/6y45b-43752/C2DL93YFNX5HVUVSUF` |
| **Partner / Reseller Form** | `resources-form-partner` | `https://forms.clickup.com/7278763/f/6y45b-43752/C2DL93YFNX5HVUVSUF` |
| **Terms & Service Agreement** | `resources-form-terms` | `https://forms.clickup.com/7278763/f/6y45b-49512/7YC23488OGEVDQPL5V` |

> **Note:** The *Library Integration* and *Partner / Reseller* forms currently share the same ClickUp source URL.

### HTML Structure
Each form follows this structure:
```html
<div class="resources-form" id="resources-form-mobile" data-resources-form>
  <!-- Toggle Button -->
  <button type="button" class="resources-form__toggle ...">
    <span>FRAME Mobile App form</span>
    <i data-lucide="chevron-down" ...></i>
  </button>
  
  <!-- Content Panel (Hidden by default) -->
  <div class="resources-form__panel" hidden>
    <div class="clickup-form-wrapper">
      <iframe src="[CLICKUP_URL]" ...></iframe>
    </div>
  </div>
</div>
```

---

## 2. Form Auto-Reveal Feature

The "Auto-Reveal" feature allows you to link directly to a specific form from any other page (e.g., a "Get Started" button). When the link is clicked, the Resources page loads, automatically expands the target form, and scrolls it into view.

### How to Use It
To trigger a specific form, append the **Form ID** as a hash to the `resources.html` URL.

**Link Format:**
`resources.html#[FORM_ID]`

**Examples:**
*   **Link to Mobile Form:** `resources.html#resources-form-mobile`
*   **Link to Partner Form:** `resources.html#resources-form-partner`
*   **Link to Terms:** `resources.html#resources-form-terms`

### Logic Implementation (`scripts.js`)
The logic is handled by the `initResourcesForms()` function in `scripts.js`.

1.  **Detection:** On page load (`DOMContentLoaded`), the script checks `window.location.hash`.
2.  **Validation:** It verifies if the hash starts with `#resources-form-`.
3.  **Action:**
    *   It extracts the ID (e.g., `resources-form-mobile`).
    *   It searches for an element with that ID that also has the `data-resources-form` attribute.
    *   If found, it calls `openContainer()` with `{ scroll: true }`.
4.  **Behavior:**
    *   The `openContainer` function removes the `hidden` attribute from the panel.
    *   It adds the `resources-form__panel--open` class for styling/transitions.
    *   It smoothly scrolls the browser window until the form is in view.

### Code Snippet Reference
```javascript
// scripts.js - initResourcesForms()

const hash = window.location.hash;
if (hash && hash.startsWith("#resources-form-")) {
  const targetId = hash.slice(1);
  const targetContainer = document.getElementById(targetId);
  // specific check for data-resources-form to prevent arbitrary ID targeting
  if (targetContainer && targetContainer.hasAttribute("data-resources-form")) {
    openContainer(targetContainer, { scroll: true });
  }
}
```
