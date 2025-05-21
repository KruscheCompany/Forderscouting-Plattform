
export function showError (state, payload) {
    state.activeError = payload.active;
    state.errorMsg = payload.msg;
}

