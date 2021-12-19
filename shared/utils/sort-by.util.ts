export const sortBy = <T> ( list: T[], key: keyof T ): T[] => {
	return list.sort( ( a, b ) => a[ key ] <= b[ key ] ? -1 : 1 );
};
