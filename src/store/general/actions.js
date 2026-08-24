import { api } from "boot/axios";

export async function fetchMaintenanceStatus(context) {
  try {
    const res = await api.get("/api/maintenance-mode", { timeout: 5000 });
    context.commit("SET_MAINTENANCE", res.data.data);
  } catch (error) {
    context.commit("SET_MAINTENANCE", { enabled: false, message: "" });
  }
}
