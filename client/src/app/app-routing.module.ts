import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES_MAP } from './routes.map';

const routes: Routes = [

	{
		path: ROUTES_MAP.empty, loadChildren: () => import( './layouts/client-layout/client-layout.module' ).then( m => m.ClientLayoutModule ),
	},
	{
		path: ROUTES_MAP.signUp, loadChildren: () => import( './modules/sign-up/sign-up.module' ).then( m => m.SignUpModule ),
	},
	{
		path: ROUTES_MAP.login, loadChildren: () => import( './modules/login/login.module' ).then( m => m.LoginModule ),
	},
	{ path: ROUTES_MAP.error, redirectTo: ROUTES_MAP.empty },

];

@NgModule( {
	imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
	exports: [ RouterModule ],
} )
export class AppRoutingModule { }
