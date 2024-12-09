<script lang="ts">
  import { DocumentState } from "$lib/DocumentState.svelte.js";
  import { firestore } from "../../../www-lib/firebase.js";

  type DbUser = {
    name: string;
    age: number;
  };

  const user = new DocumentState<DbUser>({
    firestore,
    listen: true,
    path: "users_2/X4BqYa3gKF5Oku0NqAh8"
  });
</script>

{JSON.stringify(user.data)}
