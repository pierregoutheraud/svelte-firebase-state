<script lang="ts">
  import "./global.css";
  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

{@render children()}
