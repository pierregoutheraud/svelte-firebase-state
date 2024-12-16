<script lang="ts">
  import { codeToHtml } from "shiki";
  import { onMount } from "svelte";
  import {
    removeStyleTags,
    replaceTabsBySpaces
  } from "@/www-lib/string.helpers.js";

  type Props = {
    code: string;
    language?: string;
  };

  let { code, language = "svelte" }: Props = $props();

  const PACKAGE_REPLACEMENTS = [
    {
      from: [
        '"$lib/firestore/CollectionState.svelte.js"',
        '"$lib/firestore/DocumentState.svelte.js"',
        '"$lib/realtime-database/NodeState.svelte.js"',
        '"$lib/realtime-database/NodeListState.svelte.js"',
        '"@/lib/auth/CurrentUserState.svelte.js"'
      ],
      to: '"svelte-firebase-state"'
    },
    {
      from: "@/www-lib/",
      to: "./"
    }
  ];

  let codeFormatted = $derived.by(() => {
    return PACKAGE_REPLACEMENTS.reduce(
      (formattedCode, { from, to }) => {
        // Handle arrays of strings to replace
        if (Array.isArray(from)) {
          return from.reduce(
            (code, fromPath) => code.replace(fromPath, to),
            formattedCode
          );
        }
        // Handle single string replacement
        return formattedCode.replace(from, to);
      },
      removeStyleTags(replaceTabsBySpaces(code).trim())
    );
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
