import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { errorCatcher } from 'shared/utils/error-catcher.util';
import { environment } from '../../../environments/environment';
import { IDataService } from './data-service';
import { HttpSearchOptions } from './http-search-options';

/**
 * Include all crud functionalities, In order to use it, you should extend it and call its constructor
 * and you need to set apiUrl value before constructor declaration
 */
export abstract class BaseCrudService<T, Options extends HttpSearchOptions> implements IDataService<T> {
	protected _apiUrl = '';
	idKey = 'id';
	public data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>( [] );
	public count$: BehaviorSubject<number> = new BehaviorSubject<number>( 0 );

	constructor ( public http: HttpClient ) {
	}

	public get apiUrl (): string {
		return environment.apiBaseUrl + this._apiUrl;
	}
	public set apiUrl ( value: string ) {
		this._apiUrl = value;
	}

	protected sync = ( data: T[], isRemove: boolean = false ) => {
		console.log( '**** base-crud-service - syncing...' );

		const dataToUpdate = this.data$.getValue() || [];
		for ( const toSyncItem of data ) {
			const ix = dataToUpdate?.findIndex( e => ( e as any )[ this.idKey ] === ( toSyncItem as any )[ this.idKey ] );
			if ( ix >= 0 ) {
				if ( isRemove === true ) dataToUpdate?.splice( ix, 1 );
				else dataToUpdate[ ix ] = { ...toSyncItem };
			}
			else {
				if ( !isRemove ) dataToUpdate.push( toSyncItem );
			}
		}
		this.data$.next( dataToUpdate );
	}

	protected pipes = <Some extends T | T[]> ( input: Observable<Some>, withDataSync = true, isRemove = false ): Observable<Some> => {
		return input.pipe(
			tap( _ => console.log( '**** base-crud-service - start pipe' ) ),
			tap( e => withDataSync ? ( Array.isArray( e ) ? this.sync( e as T[], isRemove ) : this.sync( [ e as T ], isRemove ) ) : true ),
			catchError( errorCatcher )
		);
	}

	protected fetch = ( configs?: Options ): Observable<T[]> => {

		console.log( '**** base-crud-service - get', this.apiUrl );
		return this.pipes(
			this.http.get<T[]>( this.apiUrl, { params: { ...configs } as any } ).
				pipe( map( data => ( data || [] ) ) ),
			true,
			false );
	}


	public get = ( options?: Options ): Observable<T[]> => {
		if ( !options && this.data$.getValue()?.length > 0 ) return this.data$.asObservable();
		else return this.fetch( options );
	}

	public post = ( payload: T ): Observable<T> => {
		console.log( '**** base-crud-service - post', this.apiUrl );
		if ( !payload ) throw new Error( 'The payload of http post is not provided' );
		return this.pipes( this.http.post<T>( this.apiUrl, payload ), true, false );
	}

	public put = ( id: string | number, payload: T ): Observable<T> => {
		if ( !payload ) throw new Error( 'The payload of http post is not provided' );
		if ( !id ) throw new Error( 'The id of http request is not provided' );

		const url = `${ this.apiUrl }/${ id }`;
		console.log( '**** base-crud-service - put', url );
		return this.pipes( this.http.put<T>( url, payload ), true, false );
	}

	public delete = ( id: string | number ): Observable<T> => {
		if ( !id ) throw new Error( 'The id of http request is not provided' );
		const url = `${ this.apiUrl }/${ id }`;
		console.log( '**** base-crud-service - delete', url );
		return this.pipes( this.http.delete<T>( url ), true, true );
	}


}

