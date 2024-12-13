import {
  type Query,
  type AggregateSpec,
  getAggregateFromServer,
  collection,
  query as firestoreQuery
} from "firebase/firestore";
import {
  FirestoreState,
  type FirestoreStateOptions,
  type PathParam
} from "./FirestoreState.svelte.js";

type CollectionAggregateStateOptions = Omit<
  FirestoreStateOptions<any, any>,
  "pathFunctionOrString" | "fromFirestore" | "toFirestore" | "listen"
> & {
  path: PathParam;
  aggregate: AggregateSpec;
};

export class CollectionAggregateState<
  AggregateData = Record<string, unknown>
> extends FirestoreState<any, any, AggregateData | null> {
  private readonly aggregate: AggregateSpec;
  private queryRef: Query | undefined;

  constructor({
    auth,
    firestore,
    path: pathFunctionOrString,
    aggregate
  }: CollectionAggregateStateOptions) {
    super({
      auth,
      firestore,
      listen: false,
      pathFunctionOrString,
      fromFirestore: (data) => data,
      toFirestore: (data) => data
    });

    this.aggregate = aggregate;
  }

  private get_collection_from_path(path: string) {
    const pathArray: [string, ...string[]] = path.split("/") as [
      string,
      ...string[]
    ];
    return collection(this.firestore, ...pathArray);
  }

  protected async init_ref(): Promise<Query | undefined> {
    if (this.queryRef) {
      return this.queryRef;
    }

    const user = await this.getUser;
    const pathStr = this.get_path_string(user);

    if (!pathStr) {
      throw new Error("Path string is not set");
    }

    const collectionRef = this.get_collection_from_path(pathStr);
    this.queryRef = firestoreQuery(collectionRef);

    return this.queryRef;
  }

  protected async fetch_data(): Promise<void> {
    this.loading = true;

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    const querySnapshot = await getAggregateFromServer(
      this.queryRef,
      this.aggregate
    );
    this.data = querySnapshot.data() as AggregateData;

    this.loading = false;
  }

  // Firestore doesn't support real-time updates for aggregations.
  // So this class does not implement it as this is not efficient and should be avoided.
}
