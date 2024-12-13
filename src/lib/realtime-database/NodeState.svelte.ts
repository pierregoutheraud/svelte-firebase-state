import { type Auth, type User } from "firebase/auth";
import {
  ref,
  type Database,
  onValue,
  type DatabaseReference,
  set,
  get
} from "firebase/database";
import { RealtimeDatabaseState } from "./RealtimeDatabaseState.svelte.js";

type PathFunctionOrString = ((user: User | null) => string) | string;

interface NodeStateOptions {
  auth?: Auth;
  database: Database;
  path: PathFunctionOrString;
  autosave?: boolean;
  listen?: boolean;
}

export class NodeState<Data> extends RealtimeDatabaseState<Data> {
  private readonly autosave: boolean;

  // private firstFetchDone: boolean = false;
  // private isUpdatingFromDB: boolean = true;
  // private cleanup: () => void;
  private nodeRef?: DatabaseReference;

  constructor({
    auth,
    database,
    path: pathFunctionOrString,
    listen: listenAtStart = false,
    autosave = false
  }: NodeStateOptions) {
    super({
      auth,
      database,
      listen: listenAtStart,
      pathFunctionOrString
    });

    this.autosave = autosave;
    // this.cleanup = this.initialize_effects();
  }

  protected async init_ref(): Promise<void> {
    const pathStr = await this.get_path_string();
    if (!pathStr) {
      throw new Error("Path is not defined");
    }
    this.nodeRef = ref(this.database, pathStr);
  }

  protected listen() {
    if (!this.nodeRef) {
      throw new Error("nodeRef is not set");
    }

    this.unsub = onValue(
      this.nodeRef,
      (snapshot) => {
        // this.isUpdatingFromDB = true;
        this.dataState.value = snapshot.val() as Data;
        // this.firstFetchDone = true;
      },
      (error) => {
        console.error("NodeState.svelte | listen | error", error);
      }
    );
  }

  async fetch_data() {
    if (!this.nodeRef) {
      return null;
    }

    const snapshot = await get(this.nodeRef);
    this.dataState.value = snapshot.val() as Data;
    return this.dataState.value;
  }

  /*
  // private initialize_effects(): () => void {
  //   return () => {};
  // return $effect.root(() => {
  // 	effect_deps(
  // 		() => {
  // 			console.log("effect_deps", this.data?.age);
  // 			this.save_data_to_firebase();
  // 			// this.initialize_effects();
  // 		},
  // 		() => [(this.data as any)?.age]
  // 	);
			$effect(() => {
				console.log(this.data?.age);
			});

			$effect(() => {
				if (!this.data) {
					return () => console.log("$effect cleanup 1");
				}

				console.log("$effect", this.data.age);

				if (!this.data || this.isUpdatingFromDB) {
					this.isUpdatingFromDB = false;
					return () => console.log("$effect cleanup 2");
				}

				console.log("SAVE VALUE");
				this.save_data_to_firebase();
				// this.initialize_effects();
				//
				return () => console.log("$effect cleanup 3");
			});

  // 	return () => console.log("$effect.root cleanup");
  // });
  //
  // return $effect.root(() => {
  // 	$effect(() => {
  // 		console.log("$effect", this.data, this.isUpdatingFromDB);
  //
  // 		// Watch all keys in the object
  // 		Object.keys(this.data || {}).forEach((key) => {
  // 			console.log("key", key);
  // 		});
  //
  // 		if (!this.data || this.isUpdatingFromDB) {
  // 			this.isUpdatingFromDB = false;
  // 			return () => {};
  // 		}
  //
  // 		console.log("SAVE VALUE");
  // 		this.save_data_to_firebase();
  //
  // 		return () => {};
  // 	});
  //
  // 	return () => {};
  // });
  //
  // return () => {};
  // }
  */

  private save_data_to_firebase() {
    if (!this.nodeRef || !this.data) {
      return;
    }
    set(this.nodeRef, this.data);
  }

  set data(newValue: Data | undefined) {
    this.dataState.value = newValue;
    if (this.autosave) {
      this.save_data_to_firebase();
    }
  }

  //!\ If set data is defined, we need to defined get data here as well
  get data(): Data | undefined | null {
    return this.dataState.value;
  }

  public save<K extends keyof Data>(
    key?: K,
    update?: Data[K] | ((prevValue: Data[K]) => Data[K])
  ): void {
    if (!key) {
      this.save_data_to_firebase();
      return;
    }

    if (!update || !this.nodeRef || !this.data) {
      return;
    }

    let newValue: Data[K];
    if (typeof update === "function") {
      const updateFn = update as (prevValue: Data[K]) => Data[K];
      const prevValue = this.data[key];
      newValue = updateFn(prevValue);
    } else {
      newValue = update;
    }

    this.data[key] = newValue as NonNullable<Data>[K];
    this.save_data_to_firebase();
  }
}
