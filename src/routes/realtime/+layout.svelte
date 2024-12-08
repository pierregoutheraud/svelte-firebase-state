<script lang="ts">
  import { page } from "$app/stores";
  import type { Snippet } from "svelte";
  import Nav from "../../www-components/Nav/Nav.svelte";
  import NavItem from "../../www-components/Nav/NavItem.svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();
</script>

<div class="container">
  <Nav>
    <NavItem
      href="/realtime/node-list-state"
      active={$page.url.pathname === "/realtime/node-list-state"}
    >
      NodeListState
    </NavItem>
    <NavItem
      href="/realtime/node-state"
      active={$page.url.pathname === "/realtime/node-state"}
    >
      NodeState
    </NavItem>
  </Nav>

  <div class="content">
    {@render children()}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 40px 0;
  }
</style>
