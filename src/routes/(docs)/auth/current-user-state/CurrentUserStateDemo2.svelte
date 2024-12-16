<script lang="ts">
  import { CurrentUserState } from "@/lib/auth/CurrentUserState.svelte.js";
  import { auth } from "@/www-lib/firebase.js";
  import { signInAnonymously, signOut } from "firebase/auth";

  let user = new CurrentUserState({ auth });

  let signLoading = $state(false);
  let loading = $derived(user.loading || signLoading);
  let userId = $derived(user.data?.uid);

  async function handleSignIn() {
    signLoading = true;
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error(error);
    }
    signLoading = false;
  }

  async function handleSignOut() {
    signLoading = true;
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error(error);
    }
    signLoading = false;
  }
</script>

<div class="container">
  <p>Loading = {loading}</p>
  <p>userId = {userId ?? "None"}</p>
  <button onclick={handleSignIn}>Sign-in anonymously</button>
  <button onclick={handleSignOut}>Sign-out</button>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  button {
    cursor: pointer;
    border: 1px solid black;
    padding: 0 8px;
    font-size: 16px;
    background: black;
    color: white;
    width: fit-content;
  }
</style>
