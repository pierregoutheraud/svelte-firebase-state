<script lang="ts">
  import { CollectionState } from "@/lib/firestore/CollectionState.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";
  import { where } from "firebase/firestore";

  type DbUser = {
    name: string;
    age: number;
  };

  let age = $state(35);

  const users = new CollectionState<DbUser>({
    firestore,
    path: () => "users_3",
    query: () => {
      return [where("age", "==", age)];
    }
  });

  function handleInput() {
    users.refetch();
  }
</script>

<div class="users">
  <input type="number" bind:value={age} oninput={handleInput} />

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

  input {
    width: 100px;
    border: 1px solid black;
  }
</style>
