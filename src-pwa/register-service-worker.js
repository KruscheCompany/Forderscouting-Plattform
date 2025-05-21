import { register } from "register-service-worker";
import { Notify } from "quasar";
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(/* registration */) {
    // console.log('Service worker is active.')
  },

  registered(/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached(/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound(/* registration */) {
    // console.log('New content is downloading.')
  },

  updated(/* registration */) {
    Notify.create({
      message:
        "Es sind neue Inhalte verfügbar. Bitte aktualisieren Sie den Browser oder klicken Sie auf die Schaltfläche unten, um auf dem Laufenden zu bleiben!",
      color: "blue",
      position: "top-right",
      timeout: 0,
      multiLine: true,
      actions: [
        {
          label: "Refresh",
          color: "white",
          handler: () => {
            location.reload();
            return false;
          }
        }
      ]
    });
  },

  offline() {
    Notify.create({
      message:
        "Wir können uns nicht mit dem Internet verbinden. Um die Plattform zu nutzen, benötigen Sie eine Internetverbindung",
      color: "blue",
      position: "top-right",
      timeout: 0,
      multiLine: true,
      actions: [
        {
          label: "Dismiss",
          color: "white",
          handler: () => {
            return false;
          }
        }
      ]
    });
  },

  error(/* err */) {
    // console.error('Error during service worker registration:', err)
  }
});
