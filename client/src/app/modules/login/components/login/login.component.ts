import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'client/src/app/core/services/alert.service';
import { AuthService } from 'client/src/app/core/services/auth.service';
import { ROUTES_MAP } from 'client/src/app/routes.map';
import { Subscription } from 'rxjs';
import { IAccountVM } from 'shared/models/account';

enum Status { initial = 1, submitting = 4, done = 5 }
@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ],
} )
export class LoginComponent implements OnInit, OnDestroy {

	form: FormGroup | undefined;
	subs: Subscription = new Subscription();
	status: Status = Status.initial;

	constructor (
		private fb: FormBuilder,
		public auth: AuthService,
		public router: Router,
		private alert: AlertService,
	) { }

	ngOnInit (): void {
		this.subs.add( this.auth.isLoggedIn$.subscribe( res => {
			if ( res ) this.router.navigate( [ '/' + this.routerMap?.home || '/' ] );
		} ) );
		this.form = this.buildFrom();
	}

	ngOnDestroy (): void {

		this.subs.unsubscribe();
	}

	get routerMap (): any {
		return { ...ROUTES_MAP };
	}
	get fromValue (): Partial<IAccountVM> {
		return this.form?.value as Partial<IAccountVM>;
	}
	private buildFrom = ( user?: IAccountVM ) => {
		return this.fb.group( {
			email: [ user?.email || '', [ Validators.required, Validators.email ] ],
			password: [ '', [ Validators.required /*Validators.pattern( PasswordRegexMap.strong.pattern )*/ ] ],
		} );
	}


	getControl = ( name: string ): FormControl => {
		return this.form?.get( name ) as FormControl || null;
	}


	onSubmit = async () => {
		try {
			this.status = Status.submitting;
			const object = this.fromValue;
			if ( !object?.email || !object.password ) throw new Error( 'Please enter email and password' );
			await this.auth.login( this.fromValue ).toPromise();
			this.alert.success( 'logged in successfully' );
		} catch ( error: any ) {
			this.alert.danger( error?.error?.error || 'failed to login' );
		}
		finally {
			this.status = Status.done;
		}
	}

}
