<script lang="ts">
  import { NodeListState } from "$lib/realtime-database/NodeListState.svelte.js";
  import { limitToLast, orderByChild } from "firebase/database";
  import { database } from "@/www-lib/firebase.js";

  interface Message {
    username: string;
    text: string;
    timestamp: number;
  }

  export const messages = new NodeListState<Message>({
    database,
    path: "messages",
    query: () => [orderByChild("timestamp"), limitToLast(5)],
    listen: true
  });
</script>

{JSON.stringify(messages.data)}
