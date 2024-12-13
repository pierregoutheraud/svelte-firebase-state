<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";
  import { getCountFromServer } from "firebase/firestore";

  interface User {
    name: string;
    age: number;
  }

  const firestoreUsersState = new CollectionState<User>({
    firestore,
    listen: true,
    path: () => "users"
  });

  async function getCount() {
    const q = await firestoreUsersState.get_query_ref();

    if (!q) {
      return undefined;
    }

    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  let countPromise = $state(getCount());
</script>

{#await countPromise then count}
  <p>Count: {count}</p>
{/await}
