
export const filterBy = <T> ( data: T[], key: keyof T, filterValue: string ): unknown => {
	return data.filter( item => String( ( ( item as any )[ key ] ) === String( filterValue ) ) );
};
