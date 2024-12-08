<script lang="ts">
  import type { Snippet } from "svelte";
  import CodeSnippet from "../CodeSnippet/CodeSnippet.svelte";

  type Props = {
    text: string;
    code: string;
    children: Snippet;
  };

  let { text, code, children }: Props = $props();
</script>

<div class="container">
  <h4>{text}</h4>
  <div class="content">
    {@render children()}
    <CodeSnippet {code} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
