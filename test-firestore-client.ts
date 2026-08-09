import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testConnection() {
  try {
    const docRef = doc(db, 'workspaces', 'default');
    const docSnap = await getDocFromServer(docRef);
    console.log(docSnap.data());
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}
testConnection();
