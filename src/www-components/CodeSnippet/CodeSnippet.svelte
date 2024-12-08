<script lang="ts">
  import { codeToHtml } from "shiki";
  import { onMount } from "svelte";
  import {
    removeStyleTags,
    replaceTabsBySpaces
  } from "../../www-lib/string.helpers.js";

  type Props = {
    code: string;
    language?: string;
  };

  let { code, language = "svelte" }: Props = $props();

  let codeFormatted = $derived.by(() => {
    let s = replaceTabsBySpaces(code);
    s = s.trim();
    s = s.replace(
      `"$lib/CollectionState.svelte.js"`,
      `"svelte-firebase-state"`
    );
    s = removeStyleTags(s);
    return s;
  });

  let html: string | undefined = $state(undefined);

  onMount(async () => {
    html = await codeToHtml(codeFormatted, {
      lang: language,
      theme: "github-dark-default"
    });
  });
</script>

{#if html}
  <div class="code-snippet">
    {@html html}
  </div>
{/if}

<style>
  .code-snippet :global(pre) {
    padding: 30px;
    overflow-x: auto;
  }
  .code-snippet :global(pre code *) {
    font-family: "JetBrains Mono", monospace;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
  }
</style>
