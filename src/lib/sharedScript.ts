// In-memory only. Lets script text survive client-side navigation between tool pages.
// Never persisted (no localStorage, cookies, URL or network). Cleared on refresh or tab close.
let current = "";
export const getSharedScript = () => current;
export const setSharedScript = (t: string) => { current = t; };
