/* Firebase Analytics — loaded from layout.js on every page */
(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyDKQ5x1dCohEIeppElYY0PsyF7b2hu5hDc",
    authDomain: "kakobuywebsite2.firebaseapp.com",
    projectId: "kakobuywebsite2",
    storageBucket: "kakobuywebsite2.firebasestorage.app",
    messagingSenderId: "433406177038",
    appId: "1:433406177038:web:76adfcd0a52b0127b0315f",
    measurementId: "G-K2RLJ5W4M0",
  };

  Promise.all([
    import("https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js"),
  ])
    .then(([firebaseApp, firebaseAnalytics]) => {
      const app = firebaseApp.initializeApp(firebaseConfig);
      return firebaseAnalytics.isSupported().then((ok) => {
        if (ok) firebaseAnalytics.getAnalytics(app);
      });
    })
    .catch(() => {});
})();
