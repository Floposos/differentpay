'use strict';

const api = globalThis.browser ?? globalThis.chrome;
const action = api.action ?? api.browserAction; // Chrome MV3 / Firefox MV2

async function getEnabled() {
  const { enabled = true } = await api.storage.local.get('enabled');
  return enabled;
}

async function updateBadge() {
  const enabled = await getEnabled();
  action.setBadgeText({ text: enabled ? '' : 'AUS' });
  action.setBadgeBackgroundColor({ color: '#6b7280' });
}

api.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-hours') return;
  await api.storage.local.set({ enabled: !(await getEnabled()) });
});

api.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'enabled' in changes) updateBadge();
});

api.runtime.onInstalled.addListener(updateBadge);
api.runtime.onStartup.addListener(updateBadge);
updateBadge();
