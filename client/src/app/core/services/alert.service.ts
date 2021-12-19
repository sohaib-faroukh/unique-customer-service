import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

interface AlertConfig {
	state?: 'danger' | 'warn' | 'info' | 'success';
	panelClass?: string, actionStyle?: string;
	horizontalPosition?: string;
	verticalPosition?: string;
}


@Injectable()
export class AlertService {
	duration: number | undefined = undefined;
	defaultMessage = 'no message';
	defaultPanelClass = '';
	defaultActionStyle = 'dismiss';
	defaultHorizontalPosition: MatSnackBarHorizontalPosition = 'end';
	defaultVerticalPosition: MatSnackBarVerticalPosition = 'bottom';

	cssClassesMap: { [ key: string ]: string } = {
		info: 'snack-bar-info',
		success: 'snack-bar-success',
		danger: 'snack-bar-danger',
		warn: 'snack-bar-warn',
	};


	constructor ( private _snackBar: MatSnackBar ) { }

	open = ( message: string, config?: AlertConfig ) => {

		const state = config?.state || 'info';
		const actionStyle = config?.actionStyle || this.defaultActionStyle;
		const horizontalPosition: MatSnackBarHorizontalPosition = config?.horizontalPosition as MatSnackBarHorizontalPosition || this.defaultHorizontalPosition;
		const verticalPosition: MatSnackBarVerticalPosition = config?.verticalPosition as MatSnackBarVerticalPosition || this.defaultVerticalPosition;
		const paramPanelClass = config?.panelClass || this.defaultPanelClass;

		const cssClasses: string[] = [];
		if ( paramPanelClass ) cssClasses.push( paramPanelClass );
		if ( this.cssClassesMap[ state ] ) {
			cssClasses.push( this.cssClassesMap[ state ] );
		}
		const panelClass = cssClasses;

		const _message = message || this.defaultMessage;

		this._snackBar.open( _message, actionStyle, {
			horizontalPosition,
			verticalPosition,
			panelClass,
			duration: this.duration,
		} as MatSnackBarConfig );


	}

	dismiss = () => {
		this._snackBar.dismiss();
	}

	success = ( message: string, config?: AlertConfig ) => {
		const _config: AlertConfig = { ...config || {}, state: 'success' };
		this.open( message, _config );
	}


	danger = ( message: string, config?: AlertConfig ) => {
		const _config: AlertConfig = { ...config || {}, state: 'danger' };
		this.open( message, _config );
	}

	warn = ( message: string, config?: AlertConfig ) => {
		const _config: AlertConfig = { ...config || {}, state: 'warn' };
		this.open( message, _config );
	}



	info = ( message: string, config?: AlertConfig ) => {
		const _config: AlertConfig = { ...config || {}, state: 'info' };
		this.open( message, _config );
	}


}
