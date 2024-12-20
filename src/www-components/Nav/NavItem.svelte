<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    href?: string;
    active?: boolean;
    onclick?: () => void;
  }

  let { children, href, active = false, onclick }: Props = $props();
</script>

{#if href}
  <a {href} class="nav-item" class:active>
    {@render children()}
  </a>
{:else}
  <button class="nav-item" class:active {onclick}>
    {@render children()}
  </button>
{/if}

<style>
  .nav-item {
    color: var(--black);
    text-decoration: none;
    font-size: 20px;
    padding: 8px 4px;
    opacity: 0.8;
    text-align: center;
    cursor: pointer;
  }
  .nav-item.active {
    opacity: 1;
    font-weight: 600;
    border-bottom: 2px solid var(--active-color);
    color: var(--active-color);
  }

  :global(.Nav.nav-size-small) .nav-item {
    font-size: 18px;
    padding: 4px 0;
  }

  @media screen and (max-width: 767px) {
    .nav-item {
      font-size: 16px;
      padding: 0;
    }
    .nav-item.active {
      border-bottom: 1px solid var(--active-color);
    }
  }
</style>
