
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ResponseDataInterceptor } from './response-data-interceptor';


export const HttpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: ResponseDataInterceptor, multi: true },
];
