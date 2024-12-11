<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { page } from "$app/stores";
  import Nav from "@/www-components/Nav/Nav.svelte";
  import NavItem from "@/www-components/Nav/NavItem.svelte";
  import GithubIcon from "@/www-components/GithubIcon/GithubIcon.svelte";

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
  let stars = $state(0);

  async function fetchStars() {
    const res = await fetch(
      "https://api.github.com/repos/pierregoutheraud/svelte-firebase-state"
    );
    const data = await res.json();
    stars = data.stargazers_count;
  }

  onMount(() => {
    fetchStars();
  });
</script>

<main>
  <header>
    <div class="title">
      <h1>svelte-firebase-state</h1>
    </div>

    <h2>Firebase utilities for Svelte 5.</h2>

    <div class="install">
      <div class="console">npm install svelte-firebase-state</div>
      <a
        href="https://github.com/pierregoutheraud/svelte-firebase-state"
        target="_blank"
        class="github"
        ><GithubIcon /> Github
      </a>
      <div class="version">Version {PKG.version}</div>
    </div>

    <a
      class="playground"
      target="_blank"
      href="https://svelte.dev/playground/1f0b1740c9a94f2586e3f29a3f6d321e?version=5.10.0"
    >
      Svelte Playground ->
    </a>
  </header>

  <section class="content">
    <Nav>
      <NavItem href={"/"} active={$page.url.pathname === "/"}>
        What is it?
      </NavItem>
      <NavItem
        href="/firestore/collection-state"
        active={$page.url.pathname.includes("/firestore")}
      >
        Firestore
      </NavItem>
      <NavItem
        href="/realtime/node-list-state"
        active={$page.url.pathname.includes("/realtime")}
      >
        Realtime Database
      </NavItem>
    </Nav>

    <div class="children">
      {@render children()}
    </div>
  </section>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    background-color: var(--gray);
    padding: 60px 0;
    width: 100%;
  }
  header h2 {
    font-size: 30px;
    font-weight: 400;
  }
  .playground {
    font-size: 14px;
    color: var(--red-1);
    position: absolute;
    top: 14px;
    right: 20px;
    text-decoration: none;
  }
  .playground:hover {
    text-decoration: underline;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  .install {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .version {
    font-size: 14px;
    padding: 4px 9px 4px 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    color: rgba(0, 0, 0, 0.5);
  }

  .github {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: black;
  }
  .github:hover {
    text-decoration: none;
  }
  .github :global(svg) {
    width: 24px;
  }

  .console {
    background: #24242e;
    color: white;
    padding: 20px 24px;
    font-weight: 600;
    word-spacing: 6px;
  }

  main h1 {
    text-align: center;
    margin: 0px;
    font-weight: 800;
    background-color: var(--red-1);
    color: white;
    display: inline-flex;
    padding: 16px 20px;
    align-self: center;
    font-size: 40px;
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 30px;
  }

  .content :global(.Nav) {
    align-self: center;
  }

  .children {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 0 500px;
    width: 1000px;
    position: relative;
  }
</style>
