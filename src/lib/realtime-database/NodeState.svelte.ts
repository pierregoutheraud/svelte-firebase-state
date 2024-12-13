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
        this.value = snapshot.val() as Data;
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
    this.value = snapshot.val() as Data;
    return this.value;
  }

  stop(): void {
    this.unsub?.();
    this.unsub = undefined;
  }

  /*
  // private initialize_effects(): () => void {
  //   return () => {};
  // return $effect.root(() => {
  // 	effect_deps(
  // 		() => {
  // 			console.log("effect_deps", this.value?.age);
  // 			this.save_data_to_firebase();
  // 			// this.initialize_effects();
  // 		},
  // 		() => [(this.value as any)?.age]
  // 	);
			$effect(() => {
				console.log(this.value?.age);
			});

			$effect(() => {
				if (!this.value) {
					return () => console.log("$effect cleanup 1");
				}

				console.log("$effect", this.value.age);

				if (!this.value || this.isUpdatingFromDB) {
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
  // 		console.log("$effect", this.value, this.isUpdatingFromDB);
  //
  // 		// Watch all keys in the object
  // 		Object.keys(this.value || {}).forEach((key) => {
  // 			console.log("key", key);
  // 		});
  //
  // 		if (!this.value || this.isUpdatingFromDB) {
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
    if (!this.nodeRef || !this.value) {
      return;
    }
    set(this.nodeRef, this.value);
  }

  set data(newValue: Data | undefined) {
    this.value = newValue;
    if (this.autosave) {
      this.save_data_to_firebase();
    }
  }

  get data(): Data | null | undefined {
    return this.value;
  }

  public save<K extends keyof Data>(
    key?: K,
    update?: Data[K] | ((prevValue: Data[K]) => Data[K])
  ): void {
    if (!key) {
      this.save_data_to_firebase();
      return;
    }

    if (!update || !this.nodeRef || !this.value) {
      return;
    }

    let newValue: Data[K];
    if (typeof update === "function") {
      const updateFn = update as (prevValue: Data[K]) => Data[K];
      const prevValue = this.value[key];
      newValue = updateFn(prevValue);
    } else {
      newValue = update;
    }

    this.value[key] = newValue as NonNullable<Data>[K];
    this.save_data_to_firebase();
  }
}
