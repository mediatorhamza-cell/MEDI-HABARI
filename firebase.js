
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIFViuVnWoIgCC3vSiNnC3zeoO0I2oEFQ",
    authDomain: "medi-habari.firebaseapp.com",
    projectId: "medi-habari",
    storageBucket: "medi-habari.firebasestorage.app",
    messagingSenderId: "886153052892",
    appId: "1:886153052892:web:5e5be0c493b73b5330aa19"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
