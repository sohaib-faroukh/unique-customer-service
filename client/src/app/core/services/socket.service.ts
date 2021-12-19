import { Injectable } from '@angular/core';
import { environment } from 'client/src/environments/environment';
import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable()
export class SocketService {

	public readonly socket: Socket;

	constructor ( public auth: AuthService ) {

		this.socket = this.createSocketClient();
		this.connect();
		this.authorize();

	}


	private createSocketClient = (): Socket => {
		return io( `${ environment.apiBaseUrl }` );
	}

	public connect = (): void => {
		this.socket.connect();
	}

	public authorize = (): void => {
		this.auth.loggedInAccount$.pipe(
			tap( account => {
				if ( account ) {
					if ( !account.token ) return;
					this.socket.auth = { token: account.token || '' };
				}
			} ),
		).subscribe();
	}

	public addListener = ( event: string, listener: ( ...args: any[] ) => void ) => {
		this.socket.on( event, listener );
	}






}
