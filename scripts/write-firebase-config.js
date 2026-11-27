const fs = require("fs");
const path = require("path");

const fields = {
  FIREBASE_API_KEY: "apiKey",
  FIREBASE_AUTH_DOMAIN: "authDomain",
  FIREBASE_DATABASE_URL: "databaseURL",
  FIREBASE_PROJECT_ID: "projectId",
  FIREBASE_STORAGE_BUCKET: "storageBucket",
  FIREBASE_MESSAGING_SENDER_ID: "messagingSenderId",
  FIREBASE_APP_ID: "appId",
};

const missing = Object.keys(fields).filter((name) => !process.env[name]);

if (missing.length > 0) {
  if (!fs.existsSync("firebase-config.js")) {
    console.error("Missing Firebase environment variables: " + missing.join(", "));
    process.exit(1);
  }
  console.log("Using the existing firebase-config.js");
} else {
  const firebaseConfig = {};
  for (const [envName, field] of Object.entries(fields)) {
    firebaseConfig[field] = process.env[envName];
  }
  fs.writeFileSync(
    "firebase-config.js",
    `export const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};\n`
  );
}

const outputDir = path.join(__dirname, "..", "public");
fs.mkdirSync(outputDir, { recursive: true });
for (const fileName of ["index.html", "style.css", "script.js", "firebase-config.js"]) {
  fs.copyFileSync(path.join(__dirname, "..", fileName), path.join(outputDir, fileName));
}
