import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IAccountVM } from 'shared/models/account';
import { errorCatcher } from 'shared/utils/error-catcher.util';
import { BaseCrudService } from '../models/base-crud-service';
import { HttpSearchOptions } from '../models/http-search-options';

@Injectable()
export class UsersService extends BaseCrudService<IAccountVM, HttpSearchOptions>{


	public status: 'initial' | 'loading' | 'done' = 'initial';
	public currentPage = 1;
	public total = 0;
	public perPage = 10;
	public pagesCount = 0;

	constructor ( public http: HttpClient ) {
		super( http );
		this.apiUrl = 'accounts';

		// console.log( '**** UsersService - fetch ' );

		this.fetch().toPromise();
	}

	protected fetch = ( configs?: HttpSearchOptions ): Observable<IAccountVM[]> => {

		// console.log( '**** base-crud-service - get', this.apiUrl );
		return this.pipes(
			this.http.get<any>( this.apiUrl, { params: { ...configs } as any } ).
				pipe(
					tap( data => {
						this.total = data?.total || 100;
						this.perPage = data?.per_page || 10;
						this.pagesCount = Math.floor( this.total / this.perPage );
					} ),
					map( data => ( data.data ? data.data : data ) ),
					map( data => ( data || [] ) as IAccountVM[] ),
				),
			true,
			false );
	}

	public getById = ( id: string ): Observable<IAccountVM> => {
		if ( id === undefined ) throw new Error( 'id should be provided' );
		const localData = this.data$.getValue();


		const ix = localData.findIndex( ele => ele.id === id ) || -1;

		// search and get the aimed item from local data
		if ( ix >= 0 ) return of( localData[ ix ] );

		// else (if not found locally) try to fetch the item from server
		else {
			return this.http.get<any>( `${ this.apiUrl }/${ id }` )
				.pipe(
					map( data => ( data.data ? data.data : data ) ),
					map( data => data as IAccountVM ),
					catchError( errorCatcher )
				);
		}
	}


	onMovePage = async ( shift: number ) => {
		this.status = 'loading';

		let next = this.currentPage + shift;
		if ( next > this.pagesCount ) next = this.pagesCount;
		if ( next < 1 ) next = 1;

		this.data$.next( [] );
		await this.get( { page: next } ).toPromise();
		this.currentPage = next;

		setTimeout( () => {
			this.status = 'done';
		}, 500 );
	}



}
