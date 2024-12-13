<script lang="ts">
    import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
    import { firestore } from "@/www-lib/firebase.js";
    import { average, count, sum } from "firebase/firestore";

    interface User {
      name: string;
    }

    const users = new CollectionState<any>({
      firestore,
      listen: true,
      path: "users_2",
      aggregate: {
        count: count(),
        averageAge: average("age"),
        totalAge: sum("age")
      }
    });
  </script>

  {JSON.stringify(users.data)}
