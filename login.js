import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQRutWjYwLJAARJP9qWLkYlCGU7F-bThs",
    authDomain: "marco-polo-d62be.firebaseapp.com",
    projectId: "marco-polo-d62be",
    storageBucket: "marco-polo-d62be.firebasestorage.app",
    messagingSenderId: "1092350256189",
    appId: "1:1092350256189:web:89e8ea8159d84d6838f654",
    measurementId: "G-7W014ZSLX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Signed in as:", userCredential.user.email);
            alertify.success("Sign in complete!");
            localStorage.setItem("email", userCredential.user.email);
            window.location.href = "/";
        })
        .catch((error) => {
            console.error("Sign in error:", error.message);
            alertify.error(error.message);
        });
}

function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Signed up as:", userCredential.user.email);
            alertify.success("Sign up complete!");
            localStorage.setItem("email", userCredential.user.email);
            window.location.href = "/";
        })
        .catch((error) => {
            console.error("Sign up error:", error.message);
            alertify.error(error.message);
        });
}
let signUpBtn = document.getElementById("signUp");
let signInBtn = document.getElementById('signIn');
signUpBtn.addEventListener("click", function(e) {signUp()});
signInBtn.addEventListener("click", function(e) {signIn()});
