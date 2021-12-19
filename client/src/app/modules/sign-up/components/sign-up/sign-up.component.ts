import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'client/src/app/core/services/alert.service';
import { AuthService } from 'client/src/app/core/services/auth.service';
import { ROUTES_MAP } from 'client/src/app/routes.map';
import { PasswordRegexMap } from 'client/src/app/shared/input-field/password-regexps';
import { IAccountVM } from 'shared/models/account';

enum Status { initial = 1, submitting = 4, done = 5 }

@Component( {
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: [ './sign-up.component.scss' ],
} )
export class SignUpComponent implements OnInit {

	public form: FormGroup | undefined;
	public passwordFormControl: FormControl = new FormControl( '', [ Validators.required ] );
	public agreeOnTerms: FormControl = new FormControl( false );
	public status: Status = Status.initial;

	constructor (
		private fb: FormBuilder,
		public auth: AuthService,
		public router: Router,
		private alert: AlertService,
	) { }

	ngOnInit (): void {
		this.form = this.buildFrom();
	}
	get routerMap (): any {
		return { ...ROUTES_MAP };
	}
	get formValue (): IAccountVM {
		return this.form?.value as IAccountVM;
	}

	private buildFrom = ( user?: IAccountVM ) => {
		return this.fb.group( {
			name: [ user?.name || '', [ Validators.required, Validators.maxLength( 50 ), Validators.minLength( 2 ) ] ],
			email: [ user?.email || '', [ Validators.required, Validators.email ] ],
			password: [ user?.password || '', [ Validators.required, Validators.pattern( PasswordRegexMap.strong.pattern ) ] ],
		} );
	}

	public getControl = ( name: string ): FormControl => {
		return this.form?.get( name ) as FormControl || null;
	}

	public onSubmit = async () => {
		try {
			this.status = Status.submitting;
			const toSubmitValue = { ...this.formValue } as IAccountVM;
			toSubmitValue.type ||= 'client';

			await ( this.auth.signUp( toSubmitValue ).toPromise() );

			this.router.navigate( [ '/home' ] );
			this.alert.success( 'Registered successfully' );


		} catch ( error: any ) {
			this.alert.danger( error?.error?.error || 'failed to login' );
		}
		finally {
			this.status = Status.done;
		}
	}

}
