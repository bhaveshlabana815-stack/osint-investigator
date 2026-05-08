document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.sync.get([
    'darkMode', 
    'autoScan'
  ]);

  document.getElementById('darkMode').checked = settings.darkMode !== false;
  document.getElementById('autoScan').checked = settings.autoScan || false;

  // Save settings
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
      const updates = {};
      updates[checkbox.id] = checkbox.checked;
      await chrome.storage.sync.set(updates);
    });
  });

  // Export settings
  document.getElementById('exportSettings').addEventListener('click', async () => {
    const data = await chrome.storage.sync.get(null);
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'osint-settings.json';
    a.click();
  });

  // Reset settings
  document.getElementById('resetSettings').addEventListener('click', async () => {
    if (confirm('Reset all settings?')) {
      await chrome.storage.sync.clear();
      location.reload();
    }
  });
});