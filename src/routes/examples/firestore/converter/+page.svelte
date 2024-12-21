<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { genericIdConverter } from "@/lib/utils.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";

  interface User {
    name: string;
    age: number;
  }

  const users = new CollectionState<User>({
    firestore,
    listen: true,
    path: () => "users",
    converter: genericIdConverter<User, User & { id: string }>()
  });

  $inspect(users.data);
</script>

<div class="users">
  {#if users.data}
    {#each users.data as user}
      <div class="user">
        <p>{user.name}</p>
      </div>
    {/each}
  {/if}
</div>

<style>
  .users {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .user {
    display: flex;
    gap: 10px;
    align-items: center;
  }
</style>
