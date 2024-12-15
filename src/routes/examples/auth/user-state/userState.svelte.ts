import { CurrentUserState } from "@/lib/auth/CurrentUserState.svelte.js";
import { auth } from "@/www-lib/firebase.js";

export let user = new CurrentUserState({ auth });
