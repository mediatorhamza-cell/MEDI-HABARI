import { auth, db } from "../assets/firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc,
  deleteDoc, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $ = id => document.getElementById(id);

async function isAdmin(user) {
  if (!user) return false;
  const snap = await getDoc(doc(db, "admins", user.uid));
  return snap.exists() && snap.data().active !== false;
}

// LOGIN
const loginForm = $("loginForm");
if (loginForm) {
  onAuthStateChanged(auth, async user => {
    if (!user) return;
    try {
      if (await isAdmin(user)) {
        location.replace("dashboard.html");
      } else {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Admin verification failed:", err);
    }
  });

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const button = $("loginButton");
    const message = $("message");
    button.disabled = true;
    button.textContent = "INAINGIA...";
    message.textContent = "";

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        $("email").value.trim(),
        $("password").value
      );

      if (!(await isAdmin(credential.user))) {
        await signOut(auth);
        throw new Error("Akaunti hii haijaidhinishwa kuwa Admin. Wasiliana na msimamizi.");
      }
      location.replace("dashboard.html");
    } catch (error) {
      message.textContent = error.code
        ? "Imeshindikana kuingia. Hakiki email na password."
        : error.message;
      console.error("Login error:", error);
    } finally {
      button.disabled = false;
      button.textContent = "INGIA KWENYE DASHBOARD";
    }
  });
}

// DASHBOARD
if ($("newsForm")) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      location.replace("login.html");
      return;
    }
    try {
      if (!(await isAdmin(user))) {
        await signOut(auth);
        location.replace("login.html");
        return;
      }
      loadData();
    } catch (error) {
      console.error("Admin access check failed:", error);
      await signOut(auth);
      location.replace("login.html");
    }
  });

  $("logoutButton")?.addEventListener("click", async () => {
    await signOut(auth);
    location.replace("login.html");
  });

  $("newsForm").addEventListener("submit", async e => {
    e.preventDefault();
    const id = $("newsId").value;
    const data = {
      title: $("newsTitle").value.trim(),
      category: $("newsCategory").value,
      imageUrl: $("newsImage").value.trim(),
      summary: $("newsSummary").value.trim(),
      body: $("newsBody").value.trim(),
      featured: $("featured").checked,
      updatedAt: serverTimestamp()
    };
    try {
      if (id) await updateDoc(doc(db, "news", id), data);
      else await addDoc(collection(db, "news"), { ...data, createdAt: serverTimestamp() });
      $("newsMessage").textContent = "Habari imehifadhiwa.";
      resetNews();
      loadData();
    } catch (error) {
      $("newsMessage").textContent = "Imeshindikana kuhifadhi habari: " + error.message;
    }
  });

  $("cancelEdit")?.addEventListener("click", resetNews);

  $("eventForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        title: $("eventTitle").value.trim(),
        date: $("eventDate").value,
        location: $("eventLocation").value.trim(),
        description: $("eventDescription").value.trim(),
        createdAt: serverTimestamp()
      });
      $("eventForm").reset();
      $("eventMessage").textContent = "Tukio limehifadhiwa.";
      loadData();
    } catch (error) {
      $("eventMessage").textContent = "Imeshindikana kuhifadhi tukio: " + error.message;
    }
  });

  $("newsList")?.addEventListener("click", async e => {
    const editId = e.target.dataset.edit;
    const deleteId = e.target.dataset.delete;
    if (editId) {
      const snap = await getDoc(doc(db, "news", editId));
      if (!snap.exists()) return;
      const n = snap.data();
      $("newsId").value = editId;
      $("newsTitle").value = n.title || "";
      $("newsCategory").value = n.category || "Kitaifa";
      $("newsImage").value = n.imageUrl || "";
      $("newsSummary").value = n.summary || "";
      $("newsBody").value = n.body || "";
      $("featured").checked = !!n.featured;
      $("formHeading").textContent = "Hariri habari";
      $("saveNews").textContent = "HIFADHI MABADILIKO";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (deleteId && confirm("Una uhakika unataka kufuta habari hii?")) {
      await deleteDoc(doc(db, "news", deleteId));
      loadData();
    }
  });

  $("eventList")?.addEventListener("click", async e => {
    const id = e.target.dataset.eventDelete;
    if (id && confirm("Futa tukio hili?")) {
      await deleteDoc(doc(db, "events", id));
      loadData();
    }
  });
}

function resetNews() {
  $("newsForm").reset();
  $("newsId").value = "";
  $("formHeading").textContent = "Ongeza Habari Mpya";
  $("saveNews").textContent = "HIFADHI HABARI";
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

async function loadData() {
  try {
    const newsSnap = await getDocs(query(collection(db, "news"), orderBy("createdAt", "desc")));
    $("newsCount").textContent = newsSnap.size;
    $("newsList").innerHTML = newsSnap.docs.map(d => {
      const n = d.data();
      return `<div class="admin-item"><div><strong>${escapeHtml(n.title)}</strong><small>${escapeHtml(n.category)}</small></div><div class="item-buttons"><button data-edit="${d.id}">Hariri</button><button class="delete" data-delete="${d.id}">Futa</button></div></div>`;
    }).join("") || "<p>Hakuna habari bado.</p>";

    const eventSnap = await getDocs(query(collection(db, "events"), orderBy("date", "asc")));
    $("eventCount").textContent = eventSnap.size;
    $("eventList").innerHTML = eventSnap.docs.map(d => {
      const event = d.data();
      return `<div class="admin-item"><div><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.date)}</small></div><button class="delete" data-event-delete="${d.id}">Futa</button></div>`;
    }).join("") || "<p>Hakuna matukio bado.</p>";
  } catch (error) {
    console.error("Data loading error:", error);
  }
}
