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
    border: 2px solid var(--gray-3);
    border-bottom: none;
    background: var(--gray-2);
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
