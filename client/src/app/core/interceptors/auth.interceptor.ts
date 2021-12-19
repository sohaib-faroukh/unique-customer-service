import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { getItemFromStorage } from '../utils/local-storage.util';
import { environment } from 'client/src/environments/environment';
import { IAccountVM } from 'shared/models/account';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor () { }

	intercept ( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
		try {
			const token = ( JSON.parse( getItemFromStorage( environment.ACCOUNT_STORAGE_KEY ) ) as IAccountVM ).token || null;
			const prefix = ( environment as any ).PREFIX || 'Bearer';
			if ( token ) {
				const authReq = request.clone( { setHeaders: { authorization: `${ prefix } ${ token }` } } );
				return next.handle( authReq );
			} else {
				return next.handle( request );
			}
		} catch ( error ) {
			return next.handle( request );
		}
	}
}
