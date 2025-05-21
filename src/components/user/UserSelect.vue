<template>
  <div>
    <div
      class="row q-col-gutter-y-lg"
      :class="users.length > 0 ? 'q-mb-lg' : 'q-mb-lg'"
    >
      <div
        v-for="(user, index) in users"
        :key="index"
        class="col-12"
        :class="index > 0 ? 'q-pt-lg' : ''"
      >
        <div
          class="row items-baseline"
          :class="{ 'q-col-gutter-x-md': $q.screen.gt.sm }"
        >
          <div class="col-11">
            <div class="row q-col-gutter-x-md">
              <div class="col-12">
                <q-select
                  outlined
                  dense
                  :value="user.username"
                  :rules="[(val) => !!val || $t('Required')]"
                  :options="userOptions"
                  options-selected-class="text-primary text-weight-600"
                  class="no-shadow input-radius-6"
                  @input="onSelect($event, index)"
                >
                  <template v-slot:selected>
                    <template v-if="!!user && !!user.id">
                      {{ user.username }}
                    </template>
                    <template v-else>
                      <span class="text-grey">
                        {{ $t("userSelector.title") }}
                      </span>
                    </template>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label
                          :class="
                            scope.opt.username === user.username ||
                            (!!scope.opt &&
                              !!scope.opt.user_detail &&
                              scope.opt.user_detail.fullName === user.username)
                              ? 'text-primary text-weight-600'
                              : ''
                          "
                        >
                          <span class="text-grey-7">{{
                            (!!scope.opt &&
                              !!scope.opt.user_detail &&
                              !!scope.opt.user_detail.municipality &&
                              scope.opt.user_detail.municipality.title) ||
                            ""
                          }}</span>
                          <span>
                            -
                            {{
                              !!scope.opt &&
                              !!scope.opt.user_detail &&
                              !!scope.opt.user_detail.fullName
                                ? scope.opt.user_detail.fullName
                                : scope.opt.username
                            }}
                          </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>
          <div class="col-1">
            <q-btn
              @click="removeUser(index)"
              icon="delete"
              flat
              round
              color="red"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <q-btn
        no-caps
        @click="addUser()"
        outline
        class="radius-6"
        icon="add"
        size="md"
        color="primary"
        :label="$t('addEditors')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "userSelect",
  props: {
    editing: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      users: this.editing,
    };
  },
  methods: {
    onSelect(value, selectedIndex) {
      if (!value) {
        return;
      } // Adding to users array
      this.users[selectedIndex].username =
        !!value.user_detail && !!value.user_detail.fullName
          ? value.user_detail.fullName
          : value.username;
      this.users[selectedIndex].id = value.id;
      // this.users.forEach((user, index) => {
      // if (index === selectedIndex) {
      //   this.users[selectedIndex] = {
      //     id: value.id,
      //     username: value.username
      //   };
      // }
      // });
      this.$emit(
        "update:user",
        this.users.length > 0
          ? this.users.map((user) => {
              return { id: user.id };
            })
          : []
      );
    },
    addUser() {
      this.users.push({
        username: "",
        id: null,
      });
    },
    setUsers() {
      const editors = this.$store.state.project.project.editors;
      editors.map((user) => {
        return {
          username: user.username,
          id: user.id,
        };
      });

      this.users = JSON.parse(JSON.stringify(editors));
    },
    removeUser(index) {
      this.users.splice(index, 1);
      this.$emit(
        "update:user",
        this.users.length > 0
          ? this.users.map((user) => {
              return { id: user.id };
            })
          : []
      );
    },
  },
  computed: {
    userOptions() {
      return (
        !!this.$store.state.userCenter && this.$store.state.userCenter.users
      );
    },
  },
  // mounted() {
  //   if (this.editing) {
  //     this.users = JSON.parse(
  //       JSON.stringify(
  //         this.$store.state.project.project.editors.map(user => {
  //           return {
  //             username: user.username,
  //             id: user.id
  //           };
  //         })
  //       )
  //     );
  //   } else {
  //     this.users = [];
  //   }
  // }
};
</script>

<style></style>
