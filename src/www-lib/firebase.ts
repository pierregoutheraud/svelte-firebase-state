import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDxsraY7q6obOPhQKHBzqTp0jv6i0zmd6c",
	authDomain: "svelte-firebase-state.firebaseapp.com",
	databaseURL: "https://svelte-firebase-state-default-rtdb.firebaseio.com",
	projectId: "svelte-firebase-state",
	storageBucket: "svelte-firebase-state.firebasestorage.app",
	messagingSenderId: "824814631026",
	appId: "1:824814631026:web:0b5122bd5b25d951d26aeb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const firestore = getFirestore(app);

export { database, firestore };
