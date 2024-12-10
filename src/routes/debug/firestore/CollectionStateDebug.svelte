<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";

  interface User {
    name: string;
    age: number;
  }

  const firestoreUsersState = new CollectionState<User>({
    firestore,
    listen: true,
    path: () => "users"
  });

  let name = $state("John");
  let age = $state(0);

  function handleAdd() {
    firestoreUsersState.add({
      name,
      age
    });

    // firestoreUsersState.data = [
    // 	...(firestoreUsersState.data || []),
    // 	{
    // 		name,
    // 		age
    // 	}
    // ];
  }

  function handleRemove(user: FirestoreUser & { id: string }) {
    firestoreUsersState.delete(user.id);
  }
</script>

<div class="users">
  {#if firestoreUsersState.data}
    {#each firestoreUsersState.data as user}
      <div class="user">
        <p>{user.name} - {user.age}</p>
        <button onclick={() => handleRemove(user)}>Remove</button>
      </div>
    {/each}
  {/if}
</div>

<div>
  <input type="text" bind:value={name} />
  <input type="number" bind:value={age} />
  <button onclick={handleAdd}>Add</button>
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
