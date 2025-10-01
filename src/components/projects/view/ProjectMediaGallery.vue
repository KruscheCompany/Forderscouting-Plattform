<template>
  <q-card class=" shadow-0">
    <q-card-section class="q-pa-none" v-if="hasMedia">
      <q-carousel swipeable animated v-model="slide" infinite class="radius-10" autoplay>
        <q-carousel-slide class="imageStyling" v-for="(item, index) in media" :key="index" :name="index + 1"
          :img-src="!item.mime.includes('video') ? `${appUrl}${item.url}` : ''">
          <video v-if="item.mime.includes('video')" class="full-width full-height" controls>
            <source :src="`${appUrl}${item.url}`" type="video/mp4" />
          </video>
        </q-carousel-slide>
      </q-carousel>

      <div class="row justify-center">
        <div class="col-9">
          <q-tabs swipeable v-model="slide" indicator-color="transparent" outside-arrows inline-label mobile-arrows
            align="center" active-class="opacity-50" class="no-padding q-mt-md"
            :class="{ carouselThumbnails: $q.screen.gt.sm }">
            <q-tab :name="index + 1" @click="slide = index + 1" v-for="(item, index) in media" :key="index"
              class="no-padding q-mx-sm radius-10" content-class="no-padding overflow-hidden">
              <div class="no-padding radius-10 overflow-hidden" style="width:100px; height:100px">
                <q-card-section class="no-padding">
                  <q-img v-if="!item.mime.includes('video')" class="tabStyling" :src="`${appUrl}${item.url}`"
                    height="100px" width="100px" />
                  <video v-if="item.mime.includes('video')" class="full-width full-height">
                    <source :src="`${appUrl}${item.url}`" type="video/mp4" />
                  </video>
                </q-card-section>
              </div>
            </q-tab>
          </q-tabs>
          <p class="q-mt-md q-mb-none font-14 text-center text-blue-grey-10">
            {{ currentMediaCaption }}
          </p>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="flex flex-center" v-else style="height: 548px">
      <div>
        <h6 class="text-blue-grey-10">{{ $t("No Images") }}</h6>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "ProjectMediaGallery",
  data() {
    return {
      slide: 1
    };
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    appUrl: {
      type: String,
      required: false,
      default: process.env.VUE_APP_MAIN_URL
    }
  },
  computed: {
    media() {
      return this.project.media || [];
    },
    hasMedia() {
      return this.media.length > 0;
    },
    currentMediaCaption() {
      const currentMedia = this.media[this.slide - 1];
      return (currentMedia && currentMedia.caption) || "";
    }
  }
};
</script>

<style lang="scss">
.carouselThumbnails .q-tabs__arrow--end {
  right: -70px;
  color: $blue;
}

.carouselThumbnails .q-tabs__arrow--start {
  left: -70px;
  color: $blue;
}

.imageStyling {
  background-size: contain;
  background-repeat: no-repeat;
}

.tabStyling div.q-img__image {
  background-size: contain !important;
  background-repeat: no-repeat !important;
}
</style>
