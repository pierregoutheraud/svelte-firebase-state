import { type Auth, type User } from "firebase/auth";
import {
  ref,
  type Database,
  onValue,
  type DatabaseReference,
  QueryConstraint,
  query,
  type Query,
  get,
  DataSnapshot
} from "firebase/database";
import { RealtimeDatabaseState } from "./RealtimeDatabaseState.svelte.js";

type PathFunctionOrString = ((user: User | null) => string) | string;

interface CreateNodeStateOptions {
  auth?: Auth;
  database: Database;
  path: PathFunctionOrString;
  query?: (user: User | null) => QueryConstraint[];
  listen?: boolean;
}

export class NodeListState<T> extends RealtimeDatabaseState<T[]> {
  private readonly queryParamsFn?: (user: User | null) => QueryConstraint[];

  private listRef?: DatabaseReference;
  private queryRef?: Query;

  constructor({
    auth,
    database,
    path: pathFunctionOrString,
    listen: listenAtStart = false,
    query: queryParamsFn
  }: CreateNodeStateOptions) {
    super({
      auth,
      database,
      listen: listenAtStart,
      pathFunctionOrString
    });

    this.queryParamsFn = queryParamsFn;
  }

  protected async set_ref(): Promise<void> {
    const pathStr = await this.get_path_string();
    if (!pathStr) {
      throw new Error("Path is not defined");
    }

    this.listRef = ref(this.database, pathStr);

    const user = await this.getUser;
    const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];

    this.queryRef = query(this.listRef, ...queryParams);
  }

  private createArrayFromSnapshot(snapshot: DataSnapshot) {
    const arr: T[] = [];
    snapshot.forEach((childSnapshot) => {
      // const childKey = childSnapshot.key;
      const childData = childSnapshot.val() as T;
      arr.push(childData);
    });
    return arr;
  }

  protected listen() {
    if (!this.queryRef) {
      throw new Error("queryRef is not set");
    }

    this.unsub = onValue(this.queryRef, (snapshot) => {
      this.value = this.createArrayFromSnapshot(snapshot);
    });
  }

  protected async fetch_data() {
    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    const snapshot = await get(this.queryRef);
    this.value = this.createArrayFromSnapshot(snapshot);
    return this.value;
  }

  stop(): void {
    this.unsub?.();
    this.unsub = undefined;
  }
}
