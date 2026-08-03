import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// The user's configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA6n34sbWwnXnS07syHgOjb_SNSNcaTeg",
  authDomain: "lifeclock-70cd5.firebaseapp.com",
  projectId: "lifeclock-70cd5",
  storageBucket: "lifeclock-70cd5.firebasestorage.app",
  messagingSenderId: "60189812210",
  appId: "1:60189812210:web:e9181f0531d1f0ce5ab76b",
  measurementId: "G-YFP37TKKW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authNavBtn = document.getElementById('auth-nav-btn');
const authMobileBtn = document.getElementById('auth-mobile-btn');
const authModal = document.getElementById('auth-modal');
const authCloseBtn = document.getElementById('auth-close-btn');
const authForm = document.getElementById('auth-form');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authSwitchBtn = document.getElementById('auth-switch-btn');
const authSwitchText = document.getElementById('auth-switch-text');

let isLoginMode = true;

// Modal Toggles
function openModal() {
  authModal.classList.add('active');
  authError.textContent = '';
}
function closeModal() {
  authModal.classList.remove('active');
  authForm.reset();
}

if (authNavBtn) authNavBtn.addEventListener('click', () => {
  if (auth.currentUser) signOut(auth); else openModal();
});
if (authMobileBtn) authMobileBtn.addEventListener('click', () => {
  if (auth.currentUser) signOut(auth); else openModal();
});
if (authCloseBtn) authCloseBtn.addEventListener('click', closeModal);
if (authModal) authModal.addEventListener('click', (e) => {
  if (e.target === authModal) closeModal();
});

// Switch between Login and Register
if (authSwitchBtn) {
  authSwitchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
      authTitle.textContent = 'Sign In';
      authSubmitBtn.textContent = 'Sign In';
      authSwitchText.textContent = "Don't have an account?";
      authSwitchBtn.textContent = 'Register';
    } else {
      authTitle.textContent = 'Register';
      authSubmitBtn.textContent = 'Create Account';
      authSwitchText.textContent = "Already have an account?";
      authSwitchBtn.textContent = 'Sign In';
    }
    authError.textContent = '';
  });
}

// Form Submit
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.textContent = '';
    
    // Firebase requires an email, so we construct a dummy email from the username
    const username = authUsername.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!username) {
      authError.textContent = 'Please enter a valid username (letters, numbers, underscores).';
      return;
    }
    const email = `${username}@lifeclock.local`;
    
    const password = authPassword.value;
    authSubmitBtn.disabled = true;
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      closeModal();
    } catch (err) {
      authError.textContent = err.message.replace('Firebase: ', '');
    } finally {
      authSubmitBtn.disabled = false;
    }
  });
}

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (authNavBtn) authNavBtn.textContent = 'Sign Out';
    if (authMobileBtn) authMobileBtn.textContent = 'Sign Out';
    
    // Pull data from Firestore
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Dispatch custom event to let script3d.js know to update
        window.dispatchEvent(new CustomEvent('lifeclock-cloud-load', { detail: data }));
      }
    } catch (err) {
      console.error('Error fetching user data from Firestore:', err);
    }
  } else {
    if (authNavBtn) authNavBtn.textContent = 'Sign In';
    if (authMobileBtn) authMobileBtn.textContent = 'Sign In';
    // Clear cloud state, revert to local
    window.dispatchEvent(new Event('lifeclock-cloud-logout'));
  }
});

// Expose a way for script3d.js to save data
window.saveToCloud = async function(data) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error('Error saving to Firestore:', err);
  }
};
