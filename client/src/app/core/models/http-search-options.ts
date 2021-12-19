export interface HttpSearchOptions {
	page?: number;
	take?: number;
	[ key: string ]: string | string[] | number | undefined;
}
