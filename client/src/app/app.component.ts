import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { RoutingService } from './core/services/routing.service';
import { SocketService } from './core/services/socket.service';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ],
} )
export class AppComponent implements OnInit {
	title = 'Unique Customer Service';
	constructor ( public auth: AuthService, public routingService: RoutingService ) { }
	async ngOnInit (): Promise<void> {
		// await this.auth.isAuth();
	}
}
