import { date } from "quasar";

function dateFormatter(val) {
  if (!!val) {
    return date.formatDate(new Date(val), "DD.MM.YYYY");
  } else {
    return;
  }
}

export { dateFormatter };
