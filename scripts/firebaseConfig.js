const firebaseConfig = {
  apiKey: "AIzaSyCy7lAzu_hu-T7AM8YV7clqaFYkCKr1Wg4",
  authDomain: "hms-pos-system.firebaseapp.com",
  projectId: "hms-pos-system",
  storageBucket: "hms-pos-system.appspot.com",
  messagingSenderId: "707072267812",
  appId: "1:707072267812:web:233d1db01ecc538562aab1",
  measurementId: "G-NP9H7R4E2Z"
};

firebase.initializeApp(firebaseConfig);

// Add a click event listener to the logout button
document.getElementById("logoutButton").addEventListener("click", function() {
  firebase.auth().signOut().then(function() {
      // Sign-out successful, redirect to the login page
      alert("Sign out!", "success!")
      window.location.href = "login.html"; // Replace with your login page URL
  }).catch(function(error) {
      console.error("Error signing out:", error);
  });
});

