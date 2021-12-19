import { Component, OnInit } from '@angular/core';
import { AuthService } from 'client/src/app/core/services/auth.service';
import { SystemService } from 'client/src/app/core/services/system.service';
import { ROUTES_MAP } from '../../../../routes.map';
@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: [ './navbar.component.scss' ],
} )
export class NavbarComponent implements OnInit {

	loggedInAccount$ = this.auth.loggedInAccount$;
	constructor ( private systemService: SystemService, public auth: AuthService ) { }
	ngOnInit (): void {

	}

	get routerMap (): any {
		return { ...ROUTES_MAP };
	}

	onLogout = () => {
		this.systemService.logout();
	}


}
