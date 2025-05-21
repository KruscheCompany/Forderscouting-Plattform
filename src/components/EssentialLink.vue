<template>
  <div>
    <q-list>
      <q-item
        v-for="link in dashboardRoutes"
        :key="link.path"
        clickable
        v-ripple
        class="q-px-lg"
        :class="{ activeMenu: nextRoute === link.path }"
        v-show="
          (isAdmin === false &&
            link.meta.requireAdmin === false &&
            link.meta.showInNavigation === true) ||
            (isAdmin === true && link.meta.showInNavigation === true)
        "
        @click="prevent(link)"
        role="navigation"
      >
        <q-item-section avatar>
          <img class="icon-blue" alt="" :src="link.icon" />
        </q-item-section>
        <q-item-section style="color: #000055">
          <div>
            {{ $i18n.locale === "en-us" ? link.meta.title : link.meta.titleDE }}
          </div>
        </q-item-section>
      </q-item>
      <q-item
        v-if="$q.screen.lt.md"
        clickable
        @click="$store.dispatch('userCenter/logout')"
        v-ripple
        class="q-px-lg"
      >
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          Logout
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
export default {
  name: "links",
  props: {
    miniState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nextRoute: ""
    };
  },
  computed: {
    dashboardRoutes() {
      let routes = this.$router.options.routes[1].children;
      if (this.isGuest) {
        routes.splice(4, 5);
      }
      return routes;
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    },
  },
  methods: {
    prevent(link) {
      if (this.miniState || this.$router.currentRoute.path == link.path) return;

      if (link.path == "/watchlist")
        this.$router.push({
          path: "/watchlist?tab=all"
        });
      else if (link.path == "/catkeytags")
        this.$router.push({
          path: "/catkeytags?tab=categories"
        });
      else this.$router.push(link.path);
      this.nextRoute = link.path;
    }
  },
  mounted() {
    this.nextRoute = this.$router.currentRoute.path;
  }
};
</script>
<style lang="scss">
.activeMenu {
  position: relative;
}
.activeMenu .q-focus-helper {
  background: #0050FF !important;
  opacity: 0.15 !important;
}
.activeMenu::before {
  position: absolute;
  left: 0;
  content: "";
  top: 0;
  background: yellow;
  height: 100%;
  width: 3px;
}
//TODO: this class is applied to the current active link. made it white for now.
.q-item--active {
  color: white;
}
</style>
