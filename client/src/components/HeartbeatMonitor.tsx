import toast from "react-hot-toast";
import { BASE_SHORT } from "./Home";

export async function pingServer() {
  try {
    const res = await fetch(`${BASE_SHORT}/heartbeat`);
    const data = await res.json();

    if (data.alive) {
      toast.success("Server & database are alive! 🚀", { duration: 4000 });
    } else {
      toast.error("Server is up but DB is down. Attempting reconnect...", { duration: 5000 });
        await fetch(`${BASE_SHORT}/api/reconnectMongo`); // optional endpoint
    }
  } catch (err) {
    toast.error("Server is unreachable. It may be restarting soon!", { duration: 5000 });
  }
}
