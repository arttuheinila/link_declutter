let styleSheet = null;

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
      a {
        color: #000000 !important;
        text-decoration: none !important;
      }
      a:hover {
        color: #666 !important;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

function disableDeclutter() {
  if (styleSheet) {
    styleSheet.remove();
    styleSheet = null;
  }
}

// Check initial state
browser.storage.local.get('isEnabled').then(result => {
  if (result.isEnabled ?? true) {
    enableDeclutter();
  }
});