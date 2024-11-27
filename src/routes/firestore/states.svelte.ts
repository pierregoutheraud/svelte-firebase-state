import { CollectionState } from "$lib/index.js";
import { firestore } from "../firebase.js";

export interface FirestoreUser {
	name: string;
	age: number;
}

export const firestoreUsersState = new CollectionState<FirestoreUser>({
	firestore,
	listen: true,
	path: "users"
});
