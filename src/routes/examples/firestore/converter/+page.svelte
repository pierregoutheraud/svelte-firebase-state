<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { genericIdConverter } from "@/lib/utils.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";
  import type {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    WithFieldValue
  } from "firebase/firestore";

  type DbUser = {
    name: string;
  };

  type AppUser = {
    id: string;
    username: string;
  };

  const converter: FirestoreDataConverter<AppUser, DbUser> = {
    toFirestore: (data: WithFieldValue<AppUser>): WithFieldValue<DbUser> =>
      data as unknown as DbUser,
    fromFirestore: (snap: QueryDocumentSnapshot<DbUser, AppUser>) => {
      const { name, ...firestoreData } = snap.data();
      return {
        ...firestoreData,
        id: snap.id,
        username: name
      };
    }
  };

  const users = new CollectionState<DbUser, AppUser>({
    firestore,
    listen: true,
    path: () => "users",
    converter
  });

  $inspect("--->", users.data);
</script>

<div class="users">
  {#if users.data}
    {#each users.data as user}
      <div class="user">
        <p>{user.username}</p>
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
