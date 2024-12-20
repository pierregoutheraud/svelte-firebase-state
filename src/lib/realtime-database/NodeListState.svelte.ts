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
  DataSnapshot,
  push,
  set
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

export class NodeListState<Data> extends RealtimeDatabaseState<Data[]> {
  private readonly queryParamsFn?: (user: User | null) => QueryConstraint[];

  private listRef?: DatabaseReference;
  private queryRef?: Query;

  constructor({
    auth,
    database,
    path: pathFunctionOrString,
    listen = false,
    query: queryParamsFn
  }: CreateNodeStateOptions) {
    super({
      auth,
      database,
      listen,
      pathFunctionOrString
    });

    this.queryParamsFn = queryParamsFn;
  }

  protected async init_ref(): Promise<void> {
    const pathStr = await this.get_path_string();
    if (!pathStr) {
      throw new Error("Path is not defined");
    }

    this.listRef = ref(this.database, pathStr);

    const user = await this.getUserPromise;
    const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];

    this.queryRef = query(this.listRef, ...queryParams);
  }

  private createArrayFromSnapshot(snapshot: DataSnapshot) {
    const arr: Data[] = [];
    snapshot.forEach((childSnapshot) => {
      // const childKey = childSnapshot.key;
      const childData = childSnapshot.val() as Data;
      arr.push(childData);
    });
    return arr;
  }

  protected listen_data() {
    if (!this.queryRef) {
      throw new Error("queryRef is not set");
    }

    this.unsub = onValue(this.queryRef, (snapshot) => {
      this.data = this.createArrayFromSnapshot(snapshot);
    });
  }

  protected async fetch_data() {
    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    const snapshot = await get(this.queryRef);
    this.data = this.createArrayFromSnapshot(snapshot);
    return this.data;
  }

  public async get_list_ref() {
    await this.initRefPromise;
    return this.listRef;
  }

  public async add(data: Data) {
    await this.initRefPromise;

    if (!this.listRef) {
      throw new Error("listRef is not set");
    }

    const newMessageRef = push(this.listRef);
    set(newMessageRef, data);

    return newMessageRef;
  }
}
