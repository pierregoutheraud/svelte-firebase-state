import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue
} from "firebase/firestore";
import { untrack } from "svelte";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function effect_deps(fn: () => any, fnDeps: () => unknown[]) {
  $effect(() => {
    fnDeps();
    return untrack(() => fn());
  });
}

export async function get_firebase_user_promise(
  auth?: Auth
): Promise<User | null> {
  if (!auth) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe?.(); // Stop listening after first response
        if (user) {
          resolve(user);
        } else {
          resolve(null);
          // reject(new Error("No user is signed in"));
        }
      },
      reject
    );
  });
}

export const genericIdConverter = <
  DataDb extends DocumentData,
  DataApp extends DocumentData
>(): FirestoreDataConverter<DataApp, DataDb> => ({
  toFirestore: (data: WithFieldValue<DataApp>): WithFieldValue<DataDb> =>
    data as DataDb,
  fromFirestore: (snap: QueryDocumentSnapshot<DataApp, DataDb>): DataApp => {
    console.log("from firestore", snap);
    return {
      id: snap.id,
      ...snap.data()
    } as unknown as DataApp;
  }
});
