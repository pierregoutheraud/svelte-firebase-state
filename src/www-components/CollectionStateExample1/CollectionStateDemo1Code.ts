import DemoCode from "./CollectionStateDemo1.svelte?raw";

// Replace tabs with spaces
const code = DemoCode.replace(/\t/g, "  ").replace(
	`"$lib/CollectionState.svelte.js"`,
	`"svelte-firebase-state"`
);

export default code;
