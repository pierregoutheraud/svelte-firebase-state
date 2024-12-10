import {
  collection,
  getDocs,
  query as firestoreQuery,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  type Query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type CollectionReference
} from "firebase/firestore";
import { type User } from "firebase/auth";
import {
  FirestoreState,
  type FirestoreStateOptions,
  type QueryParamsFn
} from "./FirestoreState.svelte.js";

type CollectionStateOptions<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = FirestoreStateOptions<DataDb, DataApp> & {
  path: string | ((user: User | null) => string);
  query?: QueryParamsFn;
};

export class CollectionState<
  DataDb extends DocumentData,
  DataApp extends DataDb & { id: string } = DataDb & { id: string }
> extends FirestoreState<DataDb, DataApp, DataApp[]> {
  private readonly queryParamsFn?: QueryParamsFn;

  private queryRef: Query | undefined;
  private collectionRef: CollectionReference | undefined;

  constructor({
    auth,
    firestore,
    query: queryParamsFn,
    path: pathFunctionOrString,
    listen: listenAtStart = false,
    fromFirestore,
    toFirestore
  }: CollectionStateOptions<DataDb, DataApp>) {
    super({
      auth,
      firestore,
      listen: listenAtStart,
      fromFirestore,
      toFirestore,
      pathFunctionOrString
    });

    this.queryParamsFn = queryParamsFn;
  }

  private getCollectionFromPath(path: string) {
    const pathArray: [string, ...string[]] = path.split("/") as [
      string,
      ...string[]
    ];
    return collection(this.firestore, ...pathArray);
  }

  private async getQueryRef(): Promise<Query | undefined> {
    if (this.queryRef) {
      return this.queryRef;
    }

    const user = await this.getUser;

    let pathStr = await this.get_path_string();

    if (!pathStr) {
      throw new Error("Path string is not set");
    }

    this.collectionRef = this.getCollectionFromPath(pathStr);

    const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];
    this.queryRef = firestoreQuery(this.collectionRef, ...queryParams);

    return this.queryRef;
  }

  private mapData(doc: QueryDocumentSnapshot<DataApp, DocumentData>): DataApp {
    return doc.data();
  }

  protected async fetch_data(): Promise<void> {
    this.loading = true;

    const queryRef = await this.getQueryRef();
    if (!queryRef) {
      return;
    }

    const querySnapshot = await getDocs(queryRef.withConverter(this.converter));
    this.value = querySnapshot.docs.map(this.mapData);

    this.loading = false;
  }

  protected async listen(callback?: (d: DataApp[]) => void): Promise<void> {
    if (this.unsub) {
      return;
    }

    const queryRef = await this.getQueryRef();
    if (!queryRef) {
      return;
    }

    this.unsub = onSnapshot(
      queryRef.withConverter(this.converter),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          callback?.([]);
          this.value = [];
          return;
        }
        const newData = querySnapshot.docs.map(this.mapData);
        this.value = newData;
        callback?.(this.value);
      }
    );

    return;
  }

  stop(): void {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }

  async add(data: DataDb): Promise<string | void> {
    if (!this.collectionRef) {
      console.log("Collection reference is not set");
      return;
    }

    const currentData = this.value || [];
    const randomId = Math.random().toString(36).substring(7);
    const newData = { id: randomId, ...data } as DataApp;
    this.value = [...currentData, newData];
    const docRef = await addDoc(this.collectionRef, data as DocumentData);
    this.value = this.value.map((d) => {
      if (d.id === randomId) {
        return { id: docRef.id, ...data } as DataApp;
      }
      return d;
    });
    return docRef.id;
  }

  getDocRef(id: string) {
    if (!this.collectionRef) {
      throw new Error("Collection reference is not set");
    }

    return doc(this.collectionRef, id);
  }

  async delete(id: string): Promise<void> {
    if (!this.collectionRef) {
      return;
    }

    const docRef = this.getDocRef(id);
    return deleteDoc(docRef);
  }
}
