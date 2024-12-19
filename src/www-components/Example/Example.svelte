<script lang="ts">
  import type { Snippet } from "svelte";
  import CodeSnippet from "../CodeSnippet/CodeSnippet.svelte";
  import Tag from "../Tag/Tag.svelte";

  type Props = {
    text?: string;
    code: string;
    children?: Snippet;
    demoPosition?: "top" | "bottom";
  };

  let { text, code, children, demoPosition = "top" }: Props = $props();
</script>

{#snippet demo()}
  {#if children}
    <div class="demo">
      <Tag backgroundColor="var(--teal)">demo</Tag>
      <div class="demo-content">
        {@render children()}
      </div>
    </div>
  {/if}
{/snippet}

<div class="container">
  {#if text}<h4>{text}</h4>{/if}
  <div
    class="content"
    class:demoTop={demoPosition === "top"}
    class:demoBottom={demoPosition === "bottom"}
  >
    {#if demoPosition === "top"}
      {@render demo()}
      <CodeSnippet {code} />
    {:else}
      <CodeSnippet {code} />
      {@render demo()}
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .demo {
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.02);
    background: rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .demo-content {
    overflow-x: auto;
    padding: 30px;
  }

  .content.demoTop .demo {
    border-bottom: none;
  }
  .content.demoBottom .demo {
    border-top: none;
  }

  .demo :global(.Tag) {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
