<script lang="ts">
  import { NodeState } from "$lib/realtime-database/NodeState.svelte.js";
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

  function saveUser() {
    user.save();
    window.alert("User updated");
  }
</script>

<div class="demo">
  {#if user.data}
    <div class="user">
      <img
        src={`https://identicons-server.fly.dev/${user.data.avatarSeed}?pixelSize=4&width=30&height=30`}
        alt="user"
      />
      <p>{user.data.username}, {user.data.age}y</p>
    </div>
    <div class="form">
      <input type="string" bind:value={user.data.avatarSeed} />
      <input
        type="text"
        placeholder="username"
        bind:value={user.data.username}
      />
      <input type="number" bind:value={user.data.age} />
      <button onclick={saveUser}>Save</button>
    </div>
  {/if}
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .demo input,
  .demo button {
    height: 30px;
    padding: 0 10px;
  }

  .demo input {
    border: 1px solid black;
  }
  .demo button {
    cursor: pointer;
    border: 1px solid black;
    padding: 0 8px;
    font-size: 16px;
    background: black;
    color: white;
    width: fit-content;
  }

  .form {
    display: flex;
    gap: 10px;
  }
</style>
