<script lang="ts">
  /* Database structure:
  {
    "messages": {
      "id1": {
        "username": "username1",
        "text": "text1",
        timestamp: 1234567890
      },
      "id2": {
        "username": "username2",
        "text": "text2",
        timestamp: 1234567890
      }
    }
  }
  */

  import { NodeListState } from "$lib/realtime-database/NodeListState.svelte.js";
  import { limitToLast, orderByChild, push, ref, set } from "firebase/database";
  import { database } from "@/www-lib/firebase.js";
  import { onMount } from "svelte";

  interface Message {
    username: string;
    text: string;
    timestamp: number;
  }

  let username = $state("");
  let text = $state("");

  export const messages = new NodeListState<Message>({
    database,
    path: "messages",
    query: () => [orderByChild("timestamp"), limitToLast(5)],
    listen: true
  });

  onMount(() => {
    // messages.add({
    //   username: "username1",
    //   text: "text1",
    //   timestamp: 1234567890
    // });
  });

  async function handleSend() {
    if (!username.length || !text.length) {
      window.alert("Please enter a username and a message.");
      return;
    }

    const newMessageRef = await messages.add({
      username,
      text,
      timestamp: Date.now()
    });

    console.log("+page | key", newMessageRef?.key);

    // Or you can also use your custom code:

    // const listRef = await messages.get_list_ref();
    // if (!listRef) {
    //   return;
    // }
    // const newMessageRef = push(listRef);
    // set(newMessageRef, {
    //   username,
    //   text,
    //   timestamp: Date.now()
    // });

    text = "";
  }
</script>

<div class="demo">
  <div class="form">
    <input type="text" placeholder="username" bind:value={username} />
    <input type="text" placeholder="message" bind:value={text} />
    <button onclick={handleSend}>Send message</button>
  </div>

  {#if messages.data?.length}
    <div class="messages">
      {#each messages.data as message}
        <div class="message">
          <img
            src={`https://identicons-server.fly.dev/${message.username}?pixelSize=4&width=30&height=30`}
            alt="user"
          />
          <div class="content">
            <div class="infos">
              <p class="username">{message.username}</p>
              <p class="time">
                ({new Date(message.timestamp).toLocaleString()})
              </p>
            </div>
            <p>{message.text}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .demo input,
  .demo button {
    font-size: 16px;
    padding: 4px 8px;
  }

  .demo input {
    border: 1px solid black;
  }

  .demo button {
    background: black;
    color: white;
    cursor: pointer;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .username {
    font-weight: 600;
  }

  .message {
    display: flex;
    gap: 10px;
  }

  .infos {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .time {
    font-size: 12px;
    opacity: 0.5;
  }
</style>
