import { clientLength } from "./clients";
import path from "path";
import versionJson from "@/version.json";

export default function () {
  return {
    authURL: process.env.AUTH_URL,
    authPort: parseInt(process.env.AUTH_PORT),
    managerURL: process.env.MANAGER_URL,
    mongoHostname: process.env.MONGODB_HOSTNAME,
    mongoDBname: process.env.MONGODB_DATABASE,
    mongoPassword: process.env.MONGODB_PASSWORD,
    mongoPort: process.env.MONGODB_PORT,
    mongoUsername: process.env.MONGODB_USERNAME,
    isProd: Boolean(process.env.NODE_ENV !== "development"),
    clientLength: clientLength,
    logs: {
      level: process.env.LOG_LEVEL || "silly",
    },
    staticPath: `${path.join(__dirname, "../static")}`,
    viewEngine: "ejs",
    viewPath: `${path.join(__dirname, "../views")}`,
    corsOptions: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    appVersion: versionJson.version,
    appCommit: versionJson.hash,
    appDeployDate: versionJson.date,
  };
}
