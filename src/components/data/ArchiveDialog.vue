<template>
  <q-dialog v-model="$_options">
    <q-card class="q-px-xl radius-10 column">
      <q-card-section align="center">
        <h6 class="text-center font-20 q-mt-md q-mb-none">
          {{
            tab == "projectIdeas"
              ? $t("Archive Project Idea")
              : tab === "fundings"
              ? $t("Archive Funding")
              : tab === "implementationChecklist"
              ? $t("Archive Implementation Checklist")
              : ""
          }}
        </h6>
      </q-card-section>
      <q-card-section align="left"
        ><div class=" items-center text-center ">
          <p>
            {{
              tab == "projectIdeas"
                ? $t("Are you sure you want to archive this Project Idea?")
                : tab === "fundings"
                ? $t("Are you sure you want to archive this Funding?")
                : tab === "implementationChecklist"
                ? $t(
                    "Are you sure you want to archive this Implementation Checklist?"
                  )
                : ""
            }}
          </p>
        </div></q-card-section
      >
      <q-card-section>
        <div class="row justify-center q-ml-lg ">
          <q-btn
            :label="$t('category&Keyword.cancel')"
            outline
            v-close-popup
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl  q-mr-sm "
            :loading="isLoading"
          />
          <q-btn
            :label="$t('confirm')"
            unelevated
            :loading="isLoading"
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl q-py-sm"
            @click="archiveItem"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "archiveDataDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    tab: { type: String, default: "" },
    id: { type: Number, default: null }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async archiveItem() {
      if (this.tab === "projectIdeas") {
        this.isLoading = true;
        const id = this.id;
        const res = await this.$store.dispatch("project/archiveProjectIdea", {
          id: id
        });
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
      } else if (this.tab === "fundings") {
        this.isLoading = true;
        const id = this.id;
        const res = await this.$store.dispatch("funding/archiveFunding", {
          id: id
        });
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
      } else {
        this.isLoading = true;
        const id = this.id;
        const res = await this.$store.dispatch(
          "implementationChecklist/archiveChecklist",
          {
            id: id
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
      }
    }
  },
  computed: {
    $_options: {
      get: function() {
        return this.dialogState;
      },
      set: function(val) {
        this.$emit("update", val);
      }
    }
  }
};
</script>

<style></style>
