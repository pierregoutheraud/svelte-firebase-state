<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    class?: string;
    children: Snippet;
    backgroundColor: string;
  };

  let { children, backgroundColor, class: classProps }: Props = $props();
</script>

<span class={`Tag ${classProps}`} style:background-color={backgroundColor}>
  {@render children()}
</span>

<style>
  .Tag {
    padding: 0px 3px;
    font-size: 14px;
    font-weight: 400;
    color: white;
    width: fit-content;
  }
</style>
