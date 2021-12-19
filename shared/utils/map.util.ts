import { IMap } from '../models/generics/map';

export const arrayToMap = <T> ( arr: T[], key: string = 'id' ): IMap<T> => {

	if ( !arr || arr?.length === 0 ) return {} as IMap<T>;

	return arr.reduce( ( map: IMap<T>, item: T ) => ( {
		...map,
		[ ( item as any )[ key ] || '' ]: item,
	} ), {} as IMap<T> );
};


export const mapToArray = <T extends { id: string }> ( map: IMap<T> ): T[] => {
	if ( !map || map === {} ) return [];
	return Object.values( map ) || [];
};
