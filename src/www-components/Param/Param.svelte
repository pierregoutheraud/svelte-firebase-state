<script lang="ts">
  import CodeSnippet from "../CodeSnippet/CodeSnippet.svelte";

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

  let isOptional = $derived(!isRequired);
</script>

<div class="param">
  <span class="tag" class:isRequired class:isOptional>
    {isRequired ? "required" : "optional"}
  </span>

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

  .tag {
    padding: 0px 3px;
    font-size: 14px;
    font-weight: 400;
    color: white;

    position: absolute;
    top: 10px;
    right: 10px;
  }
  .isOptional {
    background: var(--blue-muted);
  }
  .isRequired {
    background: var(--red-1);
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
