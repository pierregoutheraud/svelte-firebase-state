<script lang="ts">
  import { CollectionState } from "$lib/CollectionState.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";

  interface User {
    name: string;
  }

  const users = new CollectionState<User>({
    firestore,
    listen: true,
    path: "users"
  });
</script>

{JSON.stringify(users.data)}
