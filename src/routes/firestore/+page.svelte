<script lang="ts">
	import Nav from "../../www-components/Nav/Nav.svelte";
	import NavItem from "../../www-components/Nav/NavItem.svelte";
	import CollectionStateDoc from "./CollectionStateDoc/CollectionStateDoc.svelte";
	import DocumentStateDoc from "./DocumentStateDoc/DocumentStateDoc.svelte";

	let sectionDisplayed: 1 | 2 = $state(1);
</script>

<div class="container">
	<Nav>
		<NavItem
			onclick={() => (sectionDisplayed = 1)}
			active={sectionDisplayed === 1}
		>
			CollectionState
		</NavItem>
		<NavItem
			onclick={() => (sectionDisplayed = 2)}
			active={sectionDisplayed === 2}
		>
			DocumentState
		</NavItem>
	</Nav>

	<div class="content">
		{#if sectionDisplayed === 1}
			<CollectionStateDoc />
		{:else}
			<DocumentStateDoc />
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 30px;
		padding: 40px 0;
	}
</style>
