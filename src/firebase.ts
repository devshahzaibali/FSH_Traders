// 'use client' is not needed here, this is a utility file
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCx5EJlQbf4SLRw7xRw8RlPDSzkm3kb71w",
  authDomain: "h-traders-ecommerce-site.firebaseapp.com",
  projectId: "h-traders-ecommerce-site",
  storageBucket: "h-traders-ecommerce-site.appspot.com",
  messagingSenderId: "828816688927",
  appId: "1:828816688927:web:8d90b50b5915532f2e522a",
  measurementId: "G-1DXYEYE8R0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : undefined; 