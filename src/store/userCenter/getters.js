export function isSignedIn(state) {
  return !!(state.user && state.user.jwt) || false;
}

export function isAdmin(state) {
  const signedIn = isSignedIn(state);
  if (signedIn) {
    return (
      !!(
        state.user &&
        state.user.user &&
        state.user.user.role.type === "admin"
      ) || false
    );
  } else {
    return false;
  }
}

export function isGuest(state) {
  const signedIn = isSignedIn(state);
  if (signedIn) {
    return (
      !!(
        state.user &&
        state.user.user &&
        state.user.user.role.type === "guest"
      ) || false
    );
  } else {
    return false;
  }
}

export function isLeader(state) {
  const signedIn = isSignedIn(state);
  if (signedIn) {
    return (
      !!(
        state.user &&
        state.user.user &&
        state.user.user.role.type === "leader"
      ) || false
    );
  } else {
    return false;
  }
}
