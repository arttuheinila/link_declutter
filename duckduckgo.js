let styleSheet = null;
let observer = null;

// Listen for messages from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.isEnabled) {
    enableDeclutter();
  } else {
    disableDeclutter();
  }
});

function enableDeclutter() {
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .theme-dark a {
        color: #ffffff !important;
        text-decoration: none !important;
      }
      .theme-dark a:hover {
        color: #dadada !important;
      }
    `;
    document.head.appendChild(styleSheet);

    // Add mutation observer for dynamic theme changes
    if (!observer) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            // Re-apply styles when theme changes
            if (styleSheet) {
              styleSheet.remove();
              document.head.appendChild(styleSheet);
            }
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }
}

function disableDeclutter() {
  if (styleSheet) {
    styleSheet.remove();
    styleSheet = null;
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Check initial state
browser.storage.local.get('isEnabled').then(result => {
  if (result.isEnabled ?? true) {
    enableDeclutter();
  }
});