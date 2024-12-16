<script lang="ts">
  import Example from "@/www-components/Example/Example.svelte";
  import Param from "@/www-components/Param/Param.svelte";
  import CurrentUserStateDemo1Code from "./CurrentUserStateDemo1.svelte?raw";
  import CurrentUserStateDemo2 from "./CurrentUserStateDemo2.svelte";
  import CurrentUserStateDemo2Code from "./CurrentUserStateDemo2.svelte?raw";
</script>

<div class="title">
  <p>
    <span>CurrentUserState</span> manages the currently authenticated user.
  </p>
</div>

<h2>Quick example:</h2>

<Example code={CurrentUserStateDemo1Code} demoPosition="bottom" />

<h2>Parameters:</h2>

<Param
  name="auth"
  type="Auth"
  description="The firebase auth instance."
  isRequired
/>

<h2>Properties:</h2>

<Param
  name="data"
  type="User | null | undefined"
  description={`Reactive state that holds the authenticated user.`}
  backgroundColor="var(--green-light-2)"
  borderColor="var(--green-light-1)"
  code={`$inspect(user.data);`}
/>

<Param
  name="loading"
  type="boolean"
  description="Reactive state indicating if the user data is loading."
  backgroundColor="var(--green-light-1)"
  borderColor="var(--green-light-2)"
  code={`$inspect(user.loading);`}
/>

<h2>More examples:</h2>

<Example
  text="Listen to the authenticated user"
  code={CurrentUserStateDemo2Code}
>
  <CurrentUserStateDemo2 />
</Example>

<style>
  .title {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
