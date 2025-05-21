import { api } from "boot/axios";
import { Notify } from "quasar";
export async function login(context, payload) {
  const { identifier } = payload;
  const { password } = payload;
  if (!!identifier && !!password) {
    try {
      context.commit("changeLoadingMessages", "Logging you in...");
      const res = await api.post("/api/auth/local", { identifier, password });
      context.commit("setUser", res.data);
      context.commit("changeLoadingMessages", "Getting user details");
      await context.dispatch("getUserDetails");
      await context.dispatch("getUserInfo");
      context.commit("changeLoadingMessages", "Getting Categories");
      await context.dispatch("category/getCategories", null, { root: true });
      context.commit("changeLoadingMessages", "Getting Tags");
      await context.dispatch("tag/getTags", null, { root: true });
      context.commit("changeLoadingMessages", "Getting Municipalities");
      await context.dispatch("municipality/getMunicipalities", null, {
        root: true
      });
      context.commit("changeLoadingMessages", "Getting users");
      await context.dispatch("getUsers");

      // if (context.getters.isAdmin === true) {
      //   context.commit("changeLoadingMessages", "Getting Fundings");
      //   await context.dispatch("funding/getFundings", null, {
      //     root: true
      //   });
      // }

      context.commit("changeLoadingMessages", "Getting Checklists");
      await context.dispatch("implementationChecklist/getChecklists", null, {
        root: true
      });

      context.commit("changeLoadingMessages", "");
      this.$router.push({ path: "/dashboard" });
      return true;
    } catch (error) {
      console.log("error :>> ", error.response);
      // TODO add error for too many login requests
      // console.log("error :>> ", error.response);
      // Notify.create({
      //   type: "negative",
      //   message: error.response.data.error.message
      // });
      return (
        error.response.data.error.message ||
        "Login failed, please try again in a while"
      );
    }
  }
}

export async function getUserDetails(context) {
  try {
    const res = await api.get("/api/user-details");
    console.log("res", res);
    // Delete the IDs from the response as they are not needed.
    const userDetails = res.data;
    delete userDetails.notifications.id;
    delete userDetails.notifications.app.id;
    delete userDetails.notifications.email.id;
    context.commit("setUserDetails", userDetails);
  } catch (error) {
    console.log("error :>> ", error.response);
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getUserInfo(context) {
  try {
    const res = await api.get("/api/users/me");
    console.log("USER INFO res", res);
    context.commit("setUserInfo", res.data);
  } catch (error) {
    console.log("error :>> ", error.response);
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getUsers(context) {
  try {
    const res = await api.get("/api/users");
    context.commit("setUsers", res.data);
  } catch (error) {
    console.log("error :>> ", error.response);
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function inviteUser(context, payload) {
  const { data } = payload;
  if (!!data) {
    try {
      const res = await api.post("/api/users", data);
      console.log("res :>> ", res);
      Notify.create({
        message: "Eine Einladung wurde an den User geschickt",
        type: "positive"
      });
      context.dispatch("getUsers");
      // TODO perform add user mutation? Ask Ameen if I should update the table right away
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function resetPassword(context, payload) {
  const { data } = payload;
  if (!!data) {
    try {
      await api.post("/api/auth/reset-password", data);
      Notify.create({
        message: "Passwort erfolgreich zurück gesetzt. Weiterleitung zum Login",
        type: "positive"
      });
      setTimeout(() => {
        this.$router.push({ path: "/" });
      }, 2000);
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function updatePersonalData(context, payload) {
  const { data } = payload;
  const userDetailsId =
    !!context.state.user.userDetails && context.state.user.userDetails.id;
  if (!!data && !!userDetailsId) {
    try {
      const res = await api.put(`/api/user-details/${userDetailsId}`, { data });
      Notify.create({
        message: "Userdaten wurden erfolgreich geändert",
        type: "positive"
      });
      context.commit("updatePersonalData", res.data.data);
      context.dispatch("getUserDetails");
      context.dispatch("getUsers");
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function updateUser(context, payload) {
  const data = payload;
  if (!!data.id && !!data.data) {
    try {
      const res = await api.put(`/api/users/${data.id}`, { data: data.data });
      Notify.create({
        message: "Userdaten wurden erfolgreich geändert",
        type: "positive"
      });
      context.dispatch("getUserDetails");
      context.dispatch("getUserInfo");
      this.$router.push({ path: "/Administation/User/" });
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function transferData(context, payload) {
  const id = payload.selectedUser;
  const { data } = payload;
  console.log("id :>> ", id);
  console.log("data :>> ", data);

  const dataString = data.toString();
  console.log("dataString", dataString);

  if (!!id && data.length > 0) {
    try {
      const res = await api.get(
        `/api/user/transfer/${id}?data=${dataString}${
          payload.hasOwnProperty("fromId") ? `&fromId=${payload.fromId}` : ""
        }`
      );
      Notify.create({
        message: "Userdaten wurden transferiert",
        type: "positive"
      });
      console.log("res", res);
      // context.dispatch("getUserDetails");
      // this.$router.push({ path: "/Administation/User/" });
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}

export async function manageRequest(context, payload) {
  console.log("payload", payload);
  const { id } = payload;
  const { val } = payload;
  if (!!id) {
    try {
      const res = await api.put(`/api/requests/${id}`, {
        data: { approved: val }
      });
      console.log("res :>> ", res);
      // context.commit("setDataOverview", res.data);
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
    }
  }
}
export async function deleteGuestRequest(context, payload) {
  const { id } = payload;
  if (!!id) {
    try {
      const res = await api.delete(`/api/guest-requests/${id}`);
    } catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
    }
  }
}

//Mark notification as read
export async function markNotificationAsRead(context, payload) {
  if (!!payload) {
    try {
      const res = await api.post(`/api/read-notifications`, payload);
      console.log("res :>> ", res);
      context.dispatch("getUserDetails");
    }
    catch (error) {
      console.log("error :>> ", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
    }
  }
}

export async function getDataOverview(context) {
  try {
    const res = await api.get("/api/user/overview");
    context.commit("setDataOverview", res.data);
  } catch (error) {
    console.log("error :>> ", error.response);
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function getWatchlists(context) {
  try {
    const res = await api.get("/api/watchlists");
    context.commit("setWatchlists", res.data);
  } catch (error) {
    console.log("error :>> ", error.response);
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
  }
}

export async function logout(context) {
  this.$router.push({ path: "/" });
  context.commit("setUser", null);
  context.commit("setUsers", []);
  context.commit("clearDataOverview", []);
  context.commit("setWatchlists", []);
  context.commit("project/setProjectIdeas", [], { root: true });
  context.commit("project/setSpecificProject", null, { root: true });
  context.commit("tag/setTags", [], { root: true });
  context.commit("municipality/setMunicipalities", [], { root: true });
  context.commit("category/setCategories", [], { root: true });
  context.commit("funding/setFundings", [], { root: true });
  context.commit("funding/setSpecificFunding", null, { root: true });
  context.commit("funding/setFundingsWithArchived", [], { root: true });
  context.commit("implementationChecklist/setChecklists", [], { root: true });
  context.commit("implementationChecklist/setSpecificChecklist", null, {
    root: true
  });
  sessionStorage.clear();
}

export async function forgotPassword(context) {
  try {
    await api.post("/api/auth/forgot-password", {
      email: context.state.user.user.email
    });
    Notify.create({
      message:
        "Ein Link für die Zurücksetzung Ihres Passwortes wurde an Ihre Email geschickt",
      type: "positive"
    });
  } catch (error) {
    console.log("error :>> ", error.response);
    Notify.create({
      type: "negative",
      message: error.response.data.error.message
    });
    return false;
  }
}
export async function uploadProfile(context, payload) {
  if (payload.img && payload.id) {
    let formData = new FormData();
    formData.append("ref", "api::user-detail.user-detail");
    formData.append("refId", payload.id);
    formData.append("field", "profile");
    formData.append("files", payload.img);
    try {
      const fileRes = await api.post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      context.dispatch("getUserDetails");
      console.log("fileRes", fileRes);
    } catch (error) {
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}
//delete profile image
export async function deleteProfile(context, payload) {
  if (payload) {
    try {
      const res = await api.delete(`/api/upload/files/${payload}`);
      context.dispatch("getUserDetails");
      console.log("res", res);
    } catch (error) {
      console.log("error.response", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
    }
  }
}
export async function deleteUser(context, payload) {
  if (payload) {
    try {
      const res = await api.delete(`/api/users/${payload.id}`);
      if (!payload.admin) context.dispatch("logout");
      Notify.create({
        message: "Benutzer wurde gelöscht.",
        type: "positive"
      });
    } catch (error) {
      console.log("error.response", error.response);
      Notify.create({
        type: "negative",
        message: error.response.data.error.message
      });
      return false;
    }
  }
}
