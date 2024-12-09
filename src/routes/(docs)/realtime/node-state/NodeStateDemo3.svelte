<script lang="ts">
  import { NodeState } from "$lib/NodeState.svelte.js";
  import { database } from "@/www-lib/firebase.js";

  interface User {
    age: number;
    username: string;
    avatarSeed: string;
  }

  const user = new NodeState<User>({
    database,
    path: "users/1",
    listen: true
  });
</script>

{JSON.stringify(user.data)}
