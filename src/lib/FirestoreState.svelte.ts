import { type Auth, type User } from "firebase/auth";
import {
  Firestore,
  QueryConstraint,
  type DocumentData,
  type FirestoreDataConverter,
  type Unsubscribe
} from "firebase/firestore";
import { SubscriberState } from "./SubscriberState.svelte.js";
import {
  get_firebase_user_promise,
  type FromFirestore,
  type ToFirestore
} from "./utils.svelte.js";

export type QueryParamsFn = (user: User | null) => QueryConstraint[];

export type PathParam =
  | string
  | ((user: User | null) => string | null | undefined);

export type FirestoreStateOptions<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = {
  auth?: Auth;
  firestore: Firestore;
  listen?: boolean;
  fromFirestore?: FromFirestore<DataApp, DataDb>;
  toFirestore?: ToFirestore<DataApp, DataDb>;
  pathFunctionOrString?: PathParam;
};

export class FirestoreState<
  DataDb extends DocumentData,
  DataApp extends DataDb & { id: string },
  State
> extends SubscriberState<State | null> {
  protected readonly auth?: Auth;
  protected readonly firestore: Firestore;
  protected readonly listenAtStart: boolean;
  protected readonly getUser: Promise<User | null>;
  protected readonly converter: FirestoreDataConverter<DataApp, DataDb>;
  protected readonly pathFunctionOrString?: PathParam;

  protected loading = $state(false);
  protected unsub: Unsubscribe | undefined;

  constructor({
    auth,
    firestore,
    listen,
    fromFirestore,
    toFirestore,
    pathFunctionOrString
  }: FirestoreStateOptions<DataDb, DataApp>) {
    super();

    this.auth = auth;
    this.firestore = firestore;
    this.listenAtStart = listen ?? false;
    this.getUser = get_firebase_user_promise(this.auth);
    this.pathFunctionOrString = pathFunctionOrString;

    const defaultFromFirestore: FromFirestore<DataApp, DataDb> = (snap) => ({
      ...snap.data(),
      id: snap.id
    });

    const defaultToFirestore: ToFirestore<DataApp, DataDb> = (data) => {
      const { id, ...rest } = data;
      return rest as unknown as DataDb;
    };

    this.converter = {
      toFirestore: toFirestore ?? defaultToFirestore,
      fromFirestore: fromFirestore ?? defaultFromFirestore
    };
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

  // Common start/stop logic can be defined here if needed
  start(): void {
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

  get data(): State | null | undefined {
    return this.value;
  }

  set data(data: State | null) {
    this.value = data;
  }

  // Abstract methods for children to implement their fetching logic
  protected async fetch_data(): Promise<void> {}

  protected async listen(): Promise<void> {}

  protected refetch(): Promise<void> {
    return this.fetch_data();
  }

  get isLoading(): boolean {
    return this.loading;
  }
}
