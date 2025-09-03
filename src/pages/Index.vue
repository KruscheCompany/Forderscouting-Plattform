<template>
  <q-page class="bg-white">
    <section :class="$q.screen.gt.sm ? '' : 'q-px-sm'" class="light-blue">
      <div class="row justify-center text-center q-pb-xl">
        <div class="col-12 col-md-8">
          <div class="row">
            <div class="col-12 q-mb-md">
              <h1 class="font-50 text-weight-600 q-mb-none ppeditorial">
                {{ $t("fundingScoutingPlatform") }}
              </h1>
              <p class="ppeditorial">
                {{ $t("projectDescriptionDetailed") }}
              </p>
              <br />
              <strong class="ppeditorial">
                {{ $t("contactForRegistration") }}
              </strong>
            </div>
            <div class="col-12 col-md-6 q-mx-auto">
              <q-input class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
                :placeholder="$t('findDocument')" filled v-model="documentSearch" @keyup.enter="searchForDocument"
                role="searcbox">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" @click="searchForDocument" color="primary" name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div :class="$q.screen.gt.sm ? '' : 'q-px-sm'" class="bg-blue-1 q-py-xl">
      <section>
        <div class="row justify-center">
          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-card class="full-height full-width bg-white radius-20 shadow-1">
                  <q-card-section>
                    <div class="row">
                      <div class="col-12 text-center" style="position: absolute; top: -20px; right: 10px">
                        <q-img spinner-color="primary" src="../assets/Idea.svg" style="height: 100%; max-width: 60px" />
                      </div>
                      <div class="col-12 text-center">
                        <div class="font-16 text-weight-bold q-mb-none textColor ppeditorial" style="margin-top: 60px">
                          {{ $t("projectIdeas") }}
                        </div>
                        <p class="q-mb-none textColor">
                          {{ $t("projectIdeasDescription") }}
                        </p>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card class="full-height full-width radius-20 shadow-1">
                  <q-card-section>
                    <div class="row">
                      <div class="col-12 text-center" style="position: absolute; top: -20px; right: 10px">
                        <q-img spinner-color="primary" src="../assets/Fundings.svg"
                          style="height: 100%; max-width: 60px" />
                      </div>
                      <div class="col-12 text-center">
                        <div class="font-16 text-weight-bold q-mb-none textColor ppeditorial" style="margin-top: 60px">
                          {{ $t("fundingShortInfos") }}
                        </div>
                        <p class="q-mb-none textColor">
                          {{ $t("fundingShortInfosDescription") }}
                        </p>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-4">
                <q-card class="full-height full-width radius-20 shadow-1">
                  <q-card-section>
                    <div class="row">
                      <div class="col-12 text-center" style="position: absolute; top: -20px; right: 10px">
                        <q-img spinner-color="primary" src="../assets/Checklists.svg"
                          style="height: 100%; max-width: 80px" />
                      </div>
                      <div class="col-12 text-center">
                        <div class="font-16 text-weight-bold q-mb-none textColor ppeditorial" style="margin-top: 60px">
                          {{ $t("implementationChecklists") }}
                        </div>
                        <p class="q-mb-none textColor">
                          {{ $t("implementationChecklistsDescription") }}
                        </p>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mt-lg justify-center">
          <div class="col-12 col-md-8 q-mt-lg textColor">
            <p class="font-16 text-left textColor">
              {{ $t("platformGoal") }}
            </p>
            <p class="font-16 text-left">
              {{ $t("platformDescription") }}
            </p>
            <ul class="homepageList">
              <li class="font-16 text-left q-mb-md">
                {{ $t("simplifyProjectManagement") }}
              </li>
              <li class="font-16 text-left q-mb-md">
                {{ $t("connectProjectsAndFunding") }}
              </li>
              <li class="font-16 text-left q-mb-md">
                {{ $t("provideImplementationChecklists") }}
              </li>
            </ul>
            <p class="font-16 text-left">
              {{ $t("sustainabilityNote") }}
            </p>
            <p class="font-16 text-left">
              {{ $t("limitedAccessNote") }}
            </p>
          </div>
        </div>
        <!-- Videos -->
        <div class="row q-mt-lg">
          <div class="col-12 col-md-6 q-mt-lg textColor">
            <div class="flex justify-center">
              <span class="q-pa-xl font-18 ppeditorial">{{
                $t("howCanPlatformSupportProject")
                }}</span>
              <video controls poster="../assets/image1.png" style="width: 75%; height: auto">
                <source src="https://api.foerderscouting-plattform.de/uploads/Plattformpotentiale_d0f41f78dd.mp4" />
              </video>
            </div>
          </div>
          <div class="col-12 col-md-6 q-mt-lg textColor">
            <div class="flex justify-center">
              <span class="q-pa-xl font-18 ppeditorial">{{
                $t("howDoesPlatformWork")
                }}</span>
              <video controls poster="../assets/image2.png" style="width: 75%; height: auto">
                <source src="https://api.foerderscouting-plattform.de/uploads/Projektarbeit_acbd6b13eb.mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section :class="$q.screen.gt.sm ? '' : 'q-px-sm'" class="q-py-xl">
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4">
              <q-card class="full-height full-width shadow-0">
                <q-card-section class="full-height flex flex-center">
                  <q-img spinner-color="primary" src="logo-2.svg" height="150px" contain />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="full-height full-width shadow-0">
                <q-card-section class="full-height flex center">
                  <q-img spinner-color="primary" src="logo-1.svg" height="150px" contain />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="full-height full-width shadow-0">
                <q-card-section class="full-height flex flex-center">
                  <q-img spinner-color="primary" src="logo-3.png" height="130px" contain />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      documentSearch: "",
    };
  },
  methods: {
    searchForDocument() {
      this.$router.push({
        name: "documents",
        query: { q: this.documentSearch },
      });
    },
  },
};
</script>

<style lang="scss">
.textColor {
  color: #000055;
}

.homepageList {
  list-style-type: none;

  li::before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $primary;
    margin-right: 8px;
  }
}
</style>
