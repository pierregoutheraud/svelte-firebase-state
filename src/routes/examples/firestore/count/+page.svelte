<script lang="ts">
  import { CollectionState } from "$lib/firestore/CollectionState.svelte.js";
  import { firestore } from "@/www-lib/firebase.js";
  import {
    average,
    count,
    getAggregateFromServer,
    getCountFromServer,
    sum
  } from "firebase/firestore";

  interface User {
    name: string;
    age: number;
  }

  const firestoreUsersState = new CollectionState<User>({
    firestore,
    listen: true,
    path: () => "users_2"
  });

  let countPromise = $state(getCount());
  let aggregatePromise = $state(getAggregate());

  async function getCount() {
    const q = await firestoreUsersState.get_query_ref();

    if (!q) {
      return undefined;
    }

    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  async function getAggregate() {
    const q = await firestoreUsersState.get_query_ref();

    if (!q) {
      return undefined;
    }

    const querySnapshot = await getAggregateFromServer(q, {
      count: count(),
      averageAge: average("age"),
      totalAge: sum("age")
    });

    return querySnapshot.data();
  }
</script>

{#await countPromise then count}
  <p>Count: {count}</p>
{/await}

{#await aggregatePromise then data}
  <p>{JSON.stringify(data)}</p>
{/await}
