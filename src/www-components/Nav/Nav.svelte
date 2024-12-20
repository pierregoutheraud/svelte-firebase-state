<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    activeColor?: string;
    size?: "small" | "default";
  }

  let {
    children,
    activeColor = "var(--red-1)",
    size = "default"
  }: Props = $props();
</script>

<div class={`Nav nav-size-${size}`} style:--active-color={activeColor}>
  {@render children()}
</div>

<style>
  .Nav {
    align-self: center;
    display: flex;
    gap: 26px;
  }

  @media screen and (max-width: 767px) {
    .Nav {
      gap: 18px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
