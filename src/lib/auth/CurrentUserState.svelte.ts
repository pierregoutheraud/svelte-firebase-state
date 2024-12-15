import {
  onAuthStateChanged,
  type Auth,
  type Unsubscribe,
  type User
} from "firebase/auth";
import { WritableState } from "../WritableState.svelte.js";

type CurrentUserStateOptions = {
  auth: Auth;
};

export class CurrentUserState {
  private readonly auth: Auth;
  private unsub?: Unsubscribe;
  public userState: WritableState<User | undefined | null>;
  public loading = $state(true);

  constructor({ auth }: CurrentUserStateOptions) {
    this.auth = auth;

    this.userState = new WritableState<User | undefined | null>(
      undefined,
      () => {
        this.start();
        return this.stop;
      }
    );
  }

  private listen_user() {
    this.unsub = onAuthStateChanged(this.auth, (currentUser) => {
      if (currentUser) {
        this.userState.value = currentUser;
      } else {
        this.userState.value = null;
      }
      this.loading = false;
    });
  }

  private start() {
    this.listen_user();
  }

  private stop = () => {
    this.unsub?.();
  };

  public get data() {
    return this.userState.value;
  }
}
