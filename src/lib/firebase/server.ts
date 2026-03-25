// Firebase Admin SDK - only initialized when env vars are present
// In demo/local mode, this is not required

let db: any = null;

export function getDb() {
  if (db) return db;
  
  // Only initialize if Firebase env vars are set
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.log('Firebase not configured - running in demo mode');
    return null;
  }

  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    db = admin.firestore();
    return db;
  } catch (error) {
    console.error('Firebase init error:', error);
    return null;
  }
}
