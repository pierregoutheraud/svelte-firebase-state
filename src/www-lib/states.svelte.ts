import { MediaQuery } from "svelte/reactivity";

export const isMobile = new MediaQuery("max-width: 767px", false);
export const isDesktop = new MediaQuery("min-width: 768px", true);
