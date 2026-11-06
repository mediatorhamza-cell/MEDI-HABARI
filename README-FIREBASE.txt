MEDI HABARI — FIREBASE ADMIN LOGIN

MUHIMU:
Firebase configuration yako tayari imewekwa kwenye assets/firebase.js.
Admin login sasa inatumia Firebase Authentication (Email/Password) na
uthibitishaji wa ruhusa kupitia Firestore collection: admins/{UID}.

HATUA ZA KUWEKA ONLINE
1. Fungua Firebase Console: https://console.firebase.google.com/
2. Chagua project: medi-habari.
3. Authentication > Sign-in method > washa Email/Password.
4. Authentication > Users > Add user. Tengeneza email na password ya admin.
5. Nakili UID ya mtumiaji huyo.
6. Firestore Database > Start collection. Collection ID: admins.
7. Document ID iwe UID uliyoikopi (si email).
8. Weka field:
      active   boolean   true
   Hifadhi document.
9. Firestore > Rules: nakili yaliyomo kwenye firestore.rules ya folder hili,
   kisha Publish. Rules zinaruhusu umma kusoma habari/matukio lakini ni admin
   aliyeidhinishwa pekee anayeweza kuongeza, kubadili au kufuta.
10. Deploy folder MEDI-HABARI kwenye Firebase Hosting au hosting inayotumia HTTPS.

ADMIN LOGIN:
   /admin/login.html

MUHIMU KUHUSU USALAMA
- Usitengeneze admin kwa kuweka document kupitia ukurasa wa tovuti.
  Tengeneza admin document kupitia Firebase Console pekee.
- API key ya Firebase Web SDK si password ya admin; usiweke password kwenye
  JavaScript au HTML.
- Usitumie Firestore Test Mode kwenye tovuti ya moja kwa moja.
- Kila admin lazima awe na Firebase Authentication user na document
  admins/{UID} yenye active=true.

KUMBUKA
Admin login na ukurasa wa dashboard umeunganishwa. Kurasa nyingine za admin
zilizokuwepo awali zimewekewa ukaguzi wa kuingia. Baadhi yake bado ni kurasa
za placeholder kama ilivyokuwa kwenye faili la awali.
