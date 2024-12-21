import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
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

export async function get_firebase_user(auth?: Auth): Promise<User | null> {
  if (!auth) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        // Stop listening after first response
        unsubscribe?.();

        if (user) {
          resolve(user);
        } else {
          resolve(null);
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
    return {
      id: snap.id,
      ...snap.data()
    } as unknown as DataApp;
  }
});

export type FromFirestore<
  DataApp extends DocumentData,
  DataDb extends DocumentData
> = (
  snapshot: QueryDocumentSnapshot<DataApp, DataDb>,
  options?: SnapshotOptions
) => DataApp;

export type ToFirestore<
  DataApp extends DocumentData,
  DataDb extends DocumentData
> = (data: DataApp) => DataDb;
