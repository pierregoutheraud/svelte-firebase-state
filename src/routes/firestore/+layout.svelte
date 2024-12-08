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
      href="/firestore/collection-state"
      active={$page.url.pathname === "/firestore/collection-state"}
    >
      CollectionState
    </NavItem>
    <NavItem
      href="/firestore/document-state"
      active={$page.url.pathname === "/firestore/document-state"}
    >
      DocumentState
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
