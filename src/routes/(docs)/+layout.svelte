<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();
</script>

<div class="container">
  {@render children()}
</div>

<style>
  .container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 0 500px;
    width: 1000px;
  }
</style>
