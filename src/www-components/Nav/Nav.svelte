<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    activeColor?: string;
  }

  let { children, activeColor = "var(--red-1)" }: Props = $props();
</script>

<div class="Nav" style:--active-color={activeColor}>
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
      gap: 18px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
