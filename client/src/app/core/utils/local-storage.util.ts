import { environment } from 'client/src/environments/environment';

const prefix = environment.storagePrefix || '';

const getKey = ( key: string ) => {
	return `${ prefix }_${ key }`.trim().toUpperCase();
};

const transformStorageValue = ( value: any, reverse: boolean = false ): any => {
	if ( !reverse ) return JSON.stringify( value || {} );
	return JSON.parse( String( value ) );
};

export const saveToStorage = ( key: string, value: any ): void => {
	localStorage.setItem( getKey( key ), transformStorageValue( value ) );
};

export const deleteFromStorage = ( key: string ): void => {
	localStorage.removeItem( getKey( key ) );
};


export const getItemFromStorage = <T> ( key: string ): T => {
	return transformStorageValue( localStorage.getItem( getKey( key ) ), true ) as T;
};

export const clearAllStorage = () => {
	return localStorage.clear();
};
