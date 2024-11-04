let isEnabled = true;

// Function to handle the toggle action
async function toggleDeclutter(tab) {
  isEnabled = !isEnabled;
  
  // Update icon to show state
  browser.browserAction.setIcon({
    path: {
      48: isEnabled ? "icon48.png" : "icon48_disabled.png"
    }
  });
  
  // Store state
  await browser.storage.local.set({ isEnabled });
  
  // Notify content script
  browser.tabs.sendMessage(tab.id, { isEnabled });
}

// Listen for toolbar button clicks
browser.browserAction.onClicked.addListener(async (tab) => {
  await toggleDeclutter(tab);
});

// Listen for keyboard shortcut
browser.commands.onCommand.addListener(async (command) => {
  if (command === "_execute_browser_action") {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await toggleDeclutter(tabs[0]);
    }
  }
});

// Restore state on startup
browser.storage.local.get('isEnabled').then(result => {
  isEnabled = result.isEnabled ?? true;
  browser.browserAction.setIcon({
    path: {
      48: isEnabled ? "icon48.png" : "icon48_disabled.png"
    }
  });
});