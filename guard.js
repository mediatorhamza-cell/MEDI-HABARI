import { auth, db } from "../assets/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("./login.html");
    return;
  }
  try {
    const adminSnap = await getDoc(doc(db, "admins", user.uid));
    if (!adminSnap.exists() || adminSnap.data().active === false) {
      await signOut(auth);
      location.replace("./login.html");
    }
  } catch (error) {
    console.error("Admin access verification failed:", error);
    await signOut(auth);
    location.replace("./login.html");
  }
});

document.querySelectorAll('.admin-bottom a[href="./login.html"]').forEach(link => {
  link.addEventListener("click", async event => {
    event.preventDefault();
    await signOut(auth);
    location.replace("./login.html");
  });
});
