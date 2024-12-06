import { CollectionState } from "$lib/index.js";
import { collection, query } from "firebase/firestore";
import { firestore } from "../../../www-lib/firebase.js";

export interface FirestoreUser {
	name: string;
	age: number;
}

export const firestoreUsersState = new CollectionState<FirestoreUser>({
	firestore,
	listen: true,
	path: "users"
	// query: () => {
	// 	return query(collection(firestore, "users"));
	// }
});
