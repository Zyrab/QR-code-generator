import * as esbuild from "esbuild";
import { config } from "dotenv";

config();

await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: true,
  legalComments: "none",
  outfile: "dist/bundle.js",
  define: {
    "process.env.FIREBASE_API_KEY": JSON.stringify(process.env.FIREBASE_API_KEY),
    "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
    "process.env.FIREBASE_PROJECT_ID": JSON.stringify(process.env.FIREBASE_PROJECT_ID),
    "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
    "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
    "process.env.FIREBASE_APP_ID": JSON.stringify(process.env.FIREBASE_APP_ID),
    "process.env.GOOGLE_CLIENT_ID": JSON.stringify(process.env.GOOGLE_CLIENT_ID),
  },
});

console.log("⚡ Build complete! ⚡");
