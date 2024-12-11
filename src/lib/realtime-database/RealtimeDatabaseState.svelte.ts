import { type Auth, type User } from "firebase/auth";
import { SubscriberState } from "../SubscriberState.svelte.js";
import { get_firebase_user_promise } from "../utils.svelte.js";
import type { Database, Unsubscribe } from "firebase/database";
import type { PathParam } from "../firestore/FirestoreState.svelte.js";

export type RealtimeDatabaseStateOptions = {
  auth?: Auth;
  database: Database;
  listen?: boolean;
  pathFunctionOrString?: PathParam;
};

export class RealtimeDatabaseState<Data> extends SubscriberState<Data | null> {
  protected readonly auth?: Auth;
  protected readonly database: Database;
  protected readonly listenAtStart: boolean;
  protected readonly getUser: Promise<User | null>;
  protected readonly pathFunctionOrString?: PathParam;

  protected loading = $state(false);
  protected unsub?: Unsubscribe | undefined;

  constructor({
    auth,
    database,
    listen,
    pathFunctionOrString
  }: RealtimeDatabaseStateOptions) {
    super();

    this.auth = auth;
    this.database = database;
    this.listenAtStart = listen ?? false;
    this.getUser = get_firebase_user_promise(this.auth);
    this.pathFunctionOrString = pathFunctionOrString;
  }

  async get_path_string(): Promise<string | null> {
    const user = await this.getUser;
    if (typeof this.pathFunctionOrString === "function") {
      return this.pathFunctionOrString(user) ?? null;
    } else if (typeof this.pathFunctionOrString === "string") {
      return this.pathFunctionOrString;
    }
    return null;
  }

  protected async set_ref(): Promise<void> {}

  // Common start/stop logic can be defined here if needed
  async start() {
    await this.set_ref();

    if (this.listenAtStart) {
      // Let child classes implement their own 'listen' method
      this.listen();
    } else {
      this.fetch_data();
    }
  }

  stop(): void {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }

  get data(): Data | null | undefined {
    return this.value;
  }

  set data(data: Data | null) {
    this.value = data;
  }

  // Abstract methods for children to implement their fetching logic
  protected async fetch_data(): Promise<Data | null> {
    return null;
  }

  protected listen() {}

  protected refetch(): Promise<Data | null> {
    return this.fetch_data();
  }

  get is_loading(): boolean {
    return this.loading;
  }
}
