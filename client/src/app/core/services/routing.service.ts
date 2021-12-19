import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ROUTES_MAP } from '../../routes.map';
import { AuthService } from './auth.service';

@Injectable()
export class RoutingService {

	public loading$ = new BehaviorSubject<boolean>( false );
	private subs: Subscription = new Subscription();

	constructor ( private router: Router, private auth: AuthService ) {

		const obs = combineLatest( [
			this.router.events
				.pipe(
					filter( e => e instanceof NavigationEnd ),
					map( e => e as NavigationEnd ),
				),
			this.auth.isLoggedIn$,
		] ).pipe(
			filter( ( [ e ] ) => [ ROUTES_MAP?.login, ROUTES_MAP.signUp ].includes( e.url?.replace( '/', '' ) ) ),
			tap( ( [ e, isLoggedIn ] ) => {
				console.log( '**** RoutingService => isLoggedIn: ', isLoggedIn );
				if ( isLoggedIn ) this.router.navigateByUrl( '/' );
			} ),
		);
		const sub = obs.subscribe();
		this.subs.add( sub );
	}
}
