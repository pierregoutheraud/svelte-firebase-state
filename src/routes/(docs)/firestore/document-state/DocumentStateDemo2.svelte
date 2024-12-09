<script lang="ts">
  import { DocumentState } from "$lib/DocumentState.svelte.js";
  import { where } from "firebase/firestore";
  import { firestore } from "@/www-lib/firebase.js";

  interface User {
    name: string;
    age: number;
  }

  const user = new DocumentState<User>({
    firestore,
    listen: true,
    // When you don't have the id of the document
    // you can use collectionPath & query to query the document you need.
    collectionPath: "users_2",
    query: (u) => {
      return [where("name", "==", "Anna")];
    }
  });

  function handleChange() {
    if (user.data) {
      user.data.age = Math.floor(Math.random() * 100);
      // Save to firebase
      user.save();
    }
  }
</script>

<div class="container">
  {#if user.data}
    <div class="user">
      <img
        src={`https://identicons-server.fly.dev/${user.data.name}?pixelSize=20`}
        alt="user"
        width="30"
      />
      <p>{user.data.name}</p>
      <p>{user.data.age}</p>
    </div>
  {/if}
  <button onclick={handleChange}>Update age</button>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .container button {
    width: fit-content;
    text-align: center;
    height: 21px;
    padding: 0;
    flex-shrink: 0;
    cursor: pointer;
    border: 1px solid black;
    padding: 0 8px;
    font-size: 16px;
    background: black;
    color: white;
  }
</style>
