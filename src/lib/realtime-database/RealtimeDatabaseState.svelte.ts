import { type Auth, type User } from "firebase/auth";
import { WritableState } from "../WritableState.svelte.js";
import { get_firebase_user } from "../utils.svelte.js";
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
  protected readonly getUserPromise: Promise<User | null>;
  protected readonly pathFunctionOrString?: PathParam;
  protected readonly dataState: WritableState<Data | null | undefined>;
  protected readonly initRefPromise: Promise<void>;

  public loading = $state(false);
  protected unsub?: Unsubscribe | undefined;

  constructor({
    auth,
    database,
    listen,
    pathFunctionOrString
  }: RealtimeDatabaseStateOptions) {
    this.dataState = new WritableState<Data | undefined | null>(
      undefined,
      () => {
        this.start();
        return this.stop;
      }
    );

    this.auth = auth;
    this.database = database;
    this.listen = listen ?? false;
    this.pathFunctionOrString = pathFunctionOrString;

    this.getUserPromise = get_firebase_user(this.auth);
    this.initRefPromise = this.init_ref();
  }

  // Common start/stop logic can be defined here if needed
  private async start() {
    await this.initRefPromise;

    if (this.listen) {
      // Let child classes implement their own 'listen' method
      this.listen_data();
    } else {
      this.fetch_data();
    }
  }

  private stop = () => {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  };

  protected async get_path_string(): Promise<string | null> {
    const user = await this.getUserPromise;
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
