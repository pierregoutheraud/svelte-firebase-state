<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";
  import { average, count, sum } from "firebase/firestore";

  type DbUser = {
    name: string;
    age: number;
  };

  type AppUser = DbUser & {
    id: string;
  };

  type AggregateData = {
    count: number;
    averageAge: number;
    totalAge: number;
  };

  const users = new CollectionState<DbUser, AppUser, AggregateData>({
    firestore,
    listen: true,
    path: () => "users_2",
    aggregate: {
      count: count(),
      averageAge: average("age"),
      totalAge: sum("age")
    }
  });

  // How you can refetch data:
  function handleRefetch() {
    // Refetch collection data
    users.refetch();

    // Refetch aggregate data
    users.refetch_aggregate_data();
  }
</script>

{JSON.stringify(users.data)}
<br />
<br />
{JSON.stringify(users.aggregateData)}
