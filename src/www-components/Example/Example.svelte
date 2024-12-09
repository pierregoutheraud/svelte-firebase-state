<script lang="ts">
  import type { Snippet } from "svelte";
  import CodeSnippet from "../CodeSnippet/CodeSnippet.svelte";

  type Props = {
    text?: string;
    code: string;
    children: Snippet;
  };

  let { text, code, children }: Props = $props();
</script>

<div class="container">
  {#if text}<h4>{text}</h4>{/if}
  <div class="content">
    <div class="demo">{@render children()}</div>
    <CodeSnippet {code} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .demo {
    border: 2px solid rgba(0, 0, 0, 0.02);
    background: rgba(0, 0, 0, 0.03);

    /* border: 2px solid var(--cyan-light-2); */
    /* background: var(--cyan-light-1); */

    border-bottom: none;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
