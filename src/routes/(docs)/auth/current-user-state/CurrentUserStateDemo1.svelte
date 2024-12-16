<script lang="ts">
  import { CurrentUserState } from "@/lib/auth/CurrentUserState.svelte.js";
  import { auth } from "@/www-lib/firebase.js";

  let user = new CurrentUserState({ auth });
</script>

{JSON.stringify(user.data)}
