import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'client/src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IAccountVM } from 'shared/models/account';
import { ROUTES_MAP } from '../../routes.map';
import { BaseCrudService } from '../models/base-crud-service';
import { HttpSearchOptions } from '../models/http-search-options';
import { deleteFromStorage, getItemFromStorage, saveToStorage } from '../utils/local-storage.util';

@Injectable()
export class AuthService extends BaseCrudService<IAccountVM, HttpSearchOptions> {

	// apiUrl = 'api/accounts';
	private storageKey = environment.ACCOUNT_STORAGE_KEY;
	private counterOfUsage = 0;

	public auth$ = new BehaviorSubject<string>( '' );

	public isLoggedIn$ = new BehaviorSubject<boolean>( false );
	public loggedInAccount$ = new BehaviorSubject<IAccountVM | undefined>( undefined );
	public permissions$ = new BehaviorSubject<Set<string>>( new Set() );



	constructor ( public http: HttpClient, public router: Router ) {
		super( http );
		this.apiUrl = 'api/auth';
		this.counterOfUsage++;
		this.isAuth();
	}

	get isLoggedIn (): boolean {
		return this.isLoggedIn$.getValue() || false;
	}


	public isAuth = (): boolean => {
		let result: IAccountVM | undefined;
		try {
			result = JSON.parse( getItemFromStorage<string>( this.storageKey ) );
			if ( !result?.token ) throw new Error( 'Not logged in' );
			else {
				this.loggedInAccount$.next( result );
				this.isLoggedIn$.next( true );
				return true;
			}
		} catch ( error ) {
			result = undefined;
			console.error( '**** Not logged-in', error );
			this.isLoggedIn$.next( false );
			return false;
		}
	}

	public login = ( account: Partial<IAccountVM> ): Observable<any> => {
		deleteFromStorage( this.storageKey );
		return this.http.post<IAccountVM>( `${ this.apiUrl }/login`, account )
			.pipe(
				tap( loggedInAccount => {
					this.saveToStorage( loggedInAccount );
					this.loggedInAccount$.next( loggedInAccount );
					this.isLoggedIn$.next( true );
					this.router.navigate( [ '/' ] );
				} )
			);
	}

	public signUp = ( user: IAccountVM ): Observable<IAccountVM> => {
		this.deleteFromStorage();
		return this.pipes( this.http.post<IAccountVM>( this.apiUrl + '/new', user ), true, false ).pipe(
			tap( _ => this.isLoggedIn$.next( true ) ),
			tap( newAccount => this.saveToStorage( ( newAccount as any ) ) ),
			tap( newAccount => this.loggedInAccount$.next( newAccount ) ),
		);
	}

	public logout = (): void => {
		this.deleteFromStorage();
		this.isLoggedIn$.next( false );
		this.loggedInAccount$.next( undefined );
		this.router.navigate( [ '/' + ROUTES_MAP.login ] );
	}

	private saveToStorage = ( value: IAccountVM ) => {
		saveToStorage( this.storageKey, JSON.stringify( value ) || '' );
		this.auth$.next( value?.token || '' );
	}

	private deleteFromStorage = () => {
		deleteFromStorage( this.storageKey );
		this.auth$.next( '' );
	}

	public hasAnyPermissions ( ...permissions: string[] ): Observable<boolean> {
		return this.permissions$.pipe( map( ps => {
			const myPermissions: string[] = [ ...ps ];
			return permissions.some( p => myPermissions.includes( p ) );
		} ) );
	}

	public hasAllPermissions ( ...permissions: string[] ): Observable<boolean> {
		return this.permissions$.pipe( map( ps => {
			const myPermissions: string[] = [ ...ps ];
			return permissions.every( p => myPermissions.includes( p ) );
		} ) );
	}

}
