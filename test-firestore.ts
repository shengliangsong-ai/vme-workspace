import fs from "fs";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp({
  credential: applicationDefault(),
  projectId: config.projectId
});
const db = getFirestore(firebaseApp, config.firestoreDatabaseId || '(default)');
db.collection('workspaces').doc('default').get().then(doc => console.log(doc.data())).catch(e => console.error(e));
