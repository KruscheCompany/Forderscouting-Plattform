import Cookies from "js-cookie";

const _setItem = localStorage.setItem.bind(localStorage);

localStorage.setItem = function(key, value) {
  const cookieStr = Cookies.get("consent");
  if (!cookieStr) return;
  try {
    const consent = JSON.parse(cookieStr);
    if (consent.prefrences) {
      _setItem(key, value);
    }
  } catch (e) {
    // malformed consent cookie — block write
  }
};
