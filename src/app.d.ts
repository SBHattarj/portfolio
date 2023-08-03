// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	let J: JQueryStatic;
    interface Object {
        entries<T extends {[key: any]: any}>(obj: T): [keyof T, T[keyof T]][];
    }
}
