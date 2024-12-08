import { SubscriberState } from "./SubscriberState.svelte.js";

export class ParentState {
  value = $state(1);
}

// export class ChildState extends ParentState {
// 	derived = $derived(this.value * 2);
// }
//
export class ChildState extends SubscriberState<number> {
  derived = $derived(this.value ? this.value * 2 : 0);

  constructor() {
    super(0);
  }

  start() {
    // this.value = 9;
  }

  stop() {}
}
