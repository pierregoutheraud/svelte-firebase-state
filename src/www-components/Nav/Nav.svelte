<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="Nav">
  {@render children()}
</div>

<style>
  .Nav {
    align-self: center;
    display: flex;
    gap: 20px;
  }

  @media screen and (max-width: 767px) {
    .Nav {
      gap: 20px;
    }
  }
</style>
