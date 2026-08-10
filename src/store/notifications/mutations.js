export function setNotificationsCount(state, count) {
  state.notificationsCount = count;
}

export function addToast(state, toast) {
  state.toasts.push(toast);
  if (state.toasts.length > 3) {
    state.toasts.shift();
  }
}

export function markToastTimerArmed(state, id) {
  const toast = state.toasts.find(t => t.id === id);
  if (toast) toast.timerArmed = true;
}

export function setPageVisible(state, visible) {
  state.pageVisible = visible;
}

export function markToastExiting(state, id) {
  const toast = state.toasts.find(t => t.id === id);
  if (toast) toast.exiting = true;
}

export function removeToast(state, id) {
  state.toasts = state.toasts.filter(t => t.id !== id);
}

export function setActiveRibbon(state, ribbon) {
  state.activeRibbon = ribbon;
}
