<script lang="ts">
  import CodeSnippet from "../CodeSnippet/CodeSnippet.svelte";
  import Tag from "../Tag/Tag.svelte";

  type Props = {
    code?: string;
    description: string;
    isRequired?: boolean;
    name: string;
    type: string;
    default?: string;
  };

  let {
    code,
    description,
    isRequired = false,
    name,
    type,
    default: defaultProp
  }: Props = $props();
</script>

<div class="param">
  {#if isRequired}
    <Tag backgroundColor="var(--red-1)">required</Tag>
  {:else}
    <Tag backgroundColor="var(--blue-muted)">optional</Tag>
  {/if}

  <p>
    <span>{name}</span> ({type})
    {#if defaultProp}
      <br />
      <br />
      default = {defaultProp}
    {/if}
    <br />
    <br />
    {description}
  </p>
  {#if code}
    <CodeSnippet language="typescript" {code} />
  {/if}
</div>

<style>
  .param {
    position: relative;
  }

  .param :global(.Tag) {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .param {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 2px solid var(--gray-3);
    padding: 30px;
    background: var(--gray-2);
  }
</style>
