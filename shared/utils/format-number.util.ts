export const formatBigNumbers = ( num: number | string ): string => {
	return num.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' );
};
