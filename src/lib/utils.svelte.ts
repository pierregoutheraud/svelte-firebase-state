import { onAuthStateChanged, type Auth, type User } from "firebase/auth";
import { untrack } from "svelte";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function effect_deps(fn: () => any, fnDeps: () => unknown[]) {
	$effect(() => {
		fnDeps();
		return untrack(() => fn());
	});
}

export async function get_firebase_user_promise(
	auth?: Auth
): Promise<User | null> {
	if (!auth) {
		return null;
	}

	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				unsubscribe?.(); // Stop listening after first response

				console.log("user", user);

				if (user) {
					resolve(user);
				} else {
					resolve(null);
					// reject(new Error("No user is signed in"));
				}
			},
			reject
		);
	});
}
