
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseDataInterceptor implements HttpInterceptor {
	intercept ( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
		return next.handle( req ).pipe( map( event => {
			if ( event instanceof HttpResponse && event.body ) {
				if ( 'data' in event.body && 'code' in event.body && 'message' in event.body ) {
					if ( 'error' in event.body ) {
						console.error( event.body );
						return event;
					} else {
						return event.clone<any>( { body: event.body.data } );
					}
				}
			}
			return event;
		} ) );
	}
}
