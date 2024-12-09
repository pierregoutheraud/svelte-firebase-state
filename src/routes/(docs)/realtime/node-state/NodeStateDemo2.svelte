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
    listen: true,
    autosave: true
  });

  const handleInput = (key: keyof User) => (e: Event) => {
    if (!user.data) return;

    const target = e.target as HTMLInputElement;
    // Because autosave === true, we don't need to call user.save() here
    // For now autosave only works when you re-assign the data object, not when you mutate it
    user.data = {
      ...user.data,
      [key]: target.value
    };
  };
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
      <input
        type="string"
        value={user.data.avatarSeed}
        oninput={handleInput("avatarSeed")}
      />
      <input
        type="text"
        placeholder="username"
        value={user.data.username}
        oninput={handleInput("username")}
      />
      <input type="number" value={user.data.age} oninput={handleInput("age")} />
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

  .demo input {
    height: 30px;
    padding: 0 10px;
  }

  .demo input {
    border: 1px solid black;
  }

  .form {
    display: flex;
    gap: 10px;
  }
</style>
