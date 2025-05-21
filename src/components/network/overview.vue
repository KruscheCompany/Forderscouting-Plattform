<template>
  <q-table
    grid
    title="My Network"
    :data="data"
    :columns="columns"
    row-key="name"
    hide-header
    class="tableHead q-mb-lg"
    hide-bottom
    :pagination="isInPage ? { rowsPerPage: 0 } : { rowsPerPage: 4 }"
    card-container-class="q-col-gutter-md q-mt-none"
    :filter="filter"
  >
    <template v-slot:top>
      <div v-if="isInPage" class="col-12 col-md-4">
        <q-input
          borderless
          outlined
          class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
          v-model="filter"
          :placeholder="$t('Search')"
          dense
          role="searcbox"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div v-if="!isInPage" class="col-12 q-mt-sm">
        <p class="font-24 q-mb-none">
          {{ $t("myNetworkHome.myNetwork") }}
          <span
            class="font-16 float-right q-mb-md q-pt-sm text-blue text-underline text-weight-600 cursor-pointer"
            @click="$router.push({ path: '/network' })"
          >
            {{ $t("myNetworkHome.showMy") }}
          </span>
        </p>
      </div>
    </template>
    <template v-slot:item="props">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <div class="q-pa-xs">
          <q-card class="shadow-2 radius-10 bg-blue-1">
            <q-card-section class="q-pt-xs ">
              <div class="row items-start no-wrap">
                <div class="col-1"></div>
                <div class="col-10 text-center q-mt-md">
                  <q-img
                    class="radius-10"
                    spinner-color="primary"
                    :src="
                      props.row.img.length > 0
                        ? props.row.img
                        : '/icons/networkPlaceholder.svg'
                    "
                    style="height: 100px; max-width: 100px"
                  />
                </div>
                <div class="col-1 q-mt-xs">
                  <q-btn
                    color="primary"
                    round
                    flat
                    size="md"
                    dense
                    icon="more_vert"
                    aria-label="Optionen"
                  >
                    <q-menu
                      transition-show="jump-down"
                      auto-close
                      transition-hide="jump-up"
                    >
                      <q-list style="min-width: 140px">
                        <q-item
                          clickable
                          v-close-popup
                          @click="
                            $router.push({ path: `/network/${props.row.name}` })
                          "
                        >
                          <q-item-section
                            ><span class="text-right font-14">
                              {{ $t("myNetworkHome.viewOption") }}

                              <q-icon
                                size="sm"
                                class="text-blue"
                                name="visibility"/></span
                          ></q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section
                            ><span class="text-right font-14">
                              {{ $t("myNetworkHome.unfollowOption") }}

                              <!-- TODO need to add the icon from Figma. Not sure how to do this -->
                              <q-icon
                                size="sm"
                                class="text-blue"
                                name="img:/icons/Unfollow.svg"/></span
                          ></q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col-12 text-center">
                  <p class="no-margin font-16 text-weight-bold">
                    {{ props.row.name }}
                  </p>
                  <!-- TODO adding color directly isnt working. Fix this -->
                  <p
                    class="secondaryText no-margin font-12 text-weight-regular"
                  >
                    {{ props.row.title }}
                  </p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
  </q-table>
</template>

<script>
export default {
  data() {
    return {
      filter: "",
      columns: [
        {
          name: "name",
          align: "center",
          label: "name",
          field: "name"
        },
        { name: "img", label: "image", field: "img" },
        { name: "title", label: "title", field: "title" }
      ],
      data: [
        {
          name: "Lindsey Herwitz",
          img: "",
          title: "Project Coordinator"
        },
        {
          name: "Förderscout",
          img:
            "https://imgs.search.brave.com/MTI0GmdD7i4R2FX8bPx0nqjwC6vH1mdGOjFL9116T5Y/rs:fit:1200:798:1/g:ce/aHR0cHM6Ly9zbS5h/c2ttZW4uY29tL3Qv/YXNrbWVuX2luL2Fy/dGljbGUvZi9mYWNl/Ym9vay1wL2ZhY2Vi/b29rLXByb2ZpbGUt/cGljdHVyZS1hZmZl/Y3RzLWNoYW5jZXMt/b2YtZ2V0dGluX2Zy/M24uMTIwMC5qcGc",
          title: "Admin"
        },
        {
          name: "Talan Herwitz",
          img:
            "https://imgs.search.brave.com/fZcJcVpvpq6LE03UmiiNY8KrMgDAXsgTesyBNAwBOUE/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93cml0/ZXN0eWxlc29ubGlu/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTYvMDgvRm9s/bG93LVRoZXNlLVN0/ZXBzLWZvci1hLUZs/YXdsZXNzLVByb2Zl/c3Npb25hbC1Qcm9m/aWxlLVBpY3R1cmUu/anBn",
          title: "Admin"
        },
        {
          name: "Stadt ABC",
          img:
            "https://imgs.search.brave.com/fDp0hsTsmFdZl8vlDpOeUXONfJKCvDcbcMhJYEqDEWk/rs:fit:399:600:1/g:ce/aHR0cDovLzEuYnAu/YmxvZ3Nwb3QuY29t/Ly0tMWVCb1VqcnR1/SS9UZ0MxTmdUNEg2/SS9BQUFBQUFBQUIw/WS8xNjBlZkNQUkRk/cy9zMTYwMC9DdXN0/b21pemUrWW91citG/YWNlYm9vaytQcm9m/aWxlK3dpdGgrQmVh/dXRpZnVsK0dpcmxz/KyUyNTI4NCUyNTI5/LmpwZw",
          title: "Project Coordinator"
        },
        {
          name: "Lindsey Herwitzas",
          img: "",
          title: "Project Coordinators"
        },
        {
          name: "Förderscoutdas",
          img:
            "https://imgs.search.brave.com/MTI0GmdD7i4R2FX8bPx0nqjwC6vH1mdGOjFL9116T5Y/rs:fit:1200:798:1/g:ce/aHR0cHM6Ly9zbS5h/c2ttZW4uY29tL3Qv/YXNrbWVuX2luL2Fy/dGljbGUvZi9mYWNl/Ym9vay1wL2ZhY2Vi/b29rLXByb2ZpbGUt/cGljdHVyZS1hZmZl/Y3RzLWNoYW5jZXMt/b2YtZ2V0dGluX2Zy/M24uMTIwMC5qcGc",
          title: "Adminf"
        },
        {
          name: "Talan Herwitzasdads",
          img:
            "https://imgs.search.brave.com/fZcJcVpvpq6LE03UmiiNY8KrMgDAXsgTesyBNAwBOUE/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93cml0/ZXN0eWxlc29ubGlu/ZS5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMTYvMDgvRm9s/bG93LVRoZXNlLVN0/ZXBzLWZvci1hLUZs/YXdsZXNzLVByb2Zl/c3Npb25hbC1Qcm9m/aWxlLVBpY3R1cmUu/anBn",
          title: "Admind"
        },
        {
          name: "Stadt ABCasdasd",
          img:
            "https://imgs.search.brave.com/fDp0hsTsmFdZl8vlDpOeUXONfJKCvDcbcMhJYEqDEWk/rs:fit:399:600:1/g:ce/aHR0cDovLzEuYnAu/YmxvZ3Nwb3QuY29t/Ly0tMWVCb1VqcnR1/SS9UZ0MxTmdUNEg2/SS9BQUFBQUFBQUIw/WS8xNjBlZkNQUkRk/cy9zMTYwMC9DdXN0/b21pemUrWW91citG/YWNlYm9vaytQcm9m/aWxlK3dpdGgrQmVh/dXRpZnVsK0dpcmxz/KyUyNTI4NCUyNTI5/LmpwZw",
          title: "Project Coordinatord"
        }
      ]
    };
  },
  computed: {
    isInPage() {
      return this.$router.currentRoute.fullPath == "/network";
    }
  }
};
</script>

<style lang="scss">
.tableHead .q-table__top {
  background: white;
}
.secondaryText {
  color: $black-1;
}
</style>
