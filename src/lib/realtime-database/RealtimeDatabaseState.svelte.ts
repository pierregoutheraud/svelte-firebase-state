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

export class RealtimeDatabaseState<Data> {
  protected readonly auth?: Auth;
  protected readonly database: Database;
  protected readonly listen: boolean;
  protected readonly getUser: Promise<User | null>;
  protected readonly pathFunctionOrString?: PathParam;
  protected readonly dataState: SubscriberState<Data | null | undefined>;

  public loading = $state(false);
  protected unsub?: Unsubscribe | undefined;

  constructor({
    auth,
    database,
    listen,
    pathFunctionOrString
  }: RealtimeDatabaseStateOptions) {
    this.dataState = new SubscriberState<Data | undefined | null>({
      defaultValue: undefined,
      start: this.start.bind(this),
      stop: this.stop.bind(this)
    });

    this.auth = auth;
    this.database = database;
    this.listen = listen ?? false;
    this.getUser = get_firebase_user_promise(this.auth);
    this.pathFunctionOrString = pathFunctionOrString;
  }

  // Common start/stop logic can be defined here if needed
  private async start() {
    await this.init_ref();

    if (this.listen) {
      // Let child classes implement their own 'listen' method
      this.listen_data();
    } else {
      this.fetch_data();
    }
  }

  private stop(): void {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }

  protected async get_path_string(): Promise<string | null> {
    const user = await this.getUser;
    if (typeof this.pathFunctionOrString === "function") {
      return this.pathFunctionOrString(user) ?? null;
    } else if (typeof this.pathFunctionOrString === "string") {
      return this.pathFunctionOrString;
    }
    return null;
  }

  protected async init_ref(): Promise<void> {}

  protected async fetch_data(): Promise<Data | null> {
    return null;
  }

  protected listen_data(): void {}

  public get data(): Data | null | undefined {
    return this.dataState.value;
  }

  public set data(data: Data | null) {
    this.dataState.value = data;
  }

  public refetch(): Promise<Data | null> {
    return this.fetch_data();
  }
}
