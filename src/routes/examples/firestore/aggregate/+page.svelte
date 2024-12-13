<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { CollectionAggregateState } from "@/lib/firestore/CollectionAggregateState.svelte.js";
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

  const firestoreUsersState = new CollectionState<
    DbUser,
    AppUser,
    AggregateData
  >({
    firestore,
    listen: true,
    path: () => "users_2",
    aggregate: {
      count: count(),
      averageAge: average("age"),
      totalAge: sum("age")
    }
  });

  // OR if you only want the aggregate data

  const aggregateState = new CollectionAggregateState<AggregateData>({
    firestore,
    path: () => "users_2",
    aggregate: {
      count: count(),
      averageAge: average("age"),
      totalAge: sum("age")
    }
  });
</script>

{JSON.stringify(firestoreUsersState.data)}
<br />
<br />
{JSON.stringify(firestoreUsersState.aggregateData)}
<br />
<br />
{JSON.stringify(aggregateState.data)}
