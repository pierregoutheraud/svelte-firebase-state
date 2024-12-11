<script lang="ts">
  import CodeSnippet from "../CodeSnippet/CodeSnippet.svelte";
  import Tag from "../Tag/Tag.svelte";

  type Props = {
    code?: string;
    description: string;
    isRequired?: boolean;
    isOptional?: boolean;
    name: string;
    type: string;
    default?: string;
    backgroundColor?: string;
    borderColor?: string;
  };

  let {
    code,
    description,
    isRequired = false,
    isOptional = false,
    name,
    type,
    default: defaultProp,
    backgroundColor = "var(--gray-2)",
    borderColor = "var(--gray-3)"
  }: Props = $props();
</script>

<div
  class="param"
  style:border-color={borderColor}
  style:background-color={backgroundColor}
>
  {#if isRequired}
    <Tag backgroundColor="var(--red-1)">required</Tag>
  {:else if isOptional}
    <Tag backgroundColor="var(--blue-muted)">optional</Tag>
  {/if}

  <p>
    <span class="name">{name}</span>
    <span class="type">{type}</span>
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
    padding: 30px;
    border: 2px solid;
  }

  .name {
    font-weight: 700;
  }
</style>
