<script lang="ts">
  import { DocumentState } from "$lib/firestore/DocumentState.svelte.js";
  import { where } from "firebase/firestore";
  import { firestore } from "@/www-lib/firebase.js";

  interface UserDb {
    name: string;
    age: number;
  }

  interface UserApp extends UserDb {
    id: string;
  }

  // const user = new DocumentState<UserDb, UserApp>({
  //   firestore,
  //   listen: true,
  //   path: "users_2/kek",
  //   fromFirestore: (doc) => {
  //     return {
  //       ...doc.data(),
  //       id: doc.id
  //     };
  //   }
  // });

  const user = new DocumentState<UserDb, UserApp>({
    firestore,
    listen: true,
    path: "users_2/kek"
  });

  // const user = new DocumentState<UserDb, UserApp>({
  //   firestore,
  //   listen: true,
  //   collectionPath: "users_2",
  //   query: () => {
  //     return [where("name", "==", "Anna")];
  //   }
  // });

  $inspect(user.data);

  function onclick() {
    if (user.data) {
      user.data.age++;
      user.save();
    }
  }
</script>

<div>
  {JSON.stringify(user.data)}
  <button {onclick}>Change</button>
</div>

<style>
</style>
