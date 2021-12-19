import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { ParamString } from '../params-string';
import { PasswordRegexMap } from '../password-regexps';



type FieldTypes = 'text' | 'textarea' | 'email' | 'number' | 'password' | 'time' | 'select' | 'file';
const ErrorMessagesMap: { [ key: string ]: string } = {
	required: 'required value',
	pattern: 'invalid value',
	email: 'email is invalid',
	maxlength: 'the count should be lesser than $1',
	minlength: 'the count should be larger than $1',
	max: 'the value $2 should be smaller than $1',
	min: 'the value $2 should be larger than $1',
	notMatchedPassword: 'the password is not matched',
	smallerThanMinDate: 'the date $2 should be larger than $1',
	largerThanMaxDate: 'the date $2 should be smaller than $1',
};
@Component( {
	selector: 'app-input-field',
	templateUrl: './input-field.component.html',
	styleUrls: [ './input-field.component.scss' ],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef( () => InputFieldComponent ),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class InputFieldComponent implements OnInit, ControlValueAccessor {

	@Input() isWithLabel = false;
	@Input() placeholder = '';
	@Input() type: FieldTypes = 'text';
	@Input() label = '';
	@Input() id = '';
	@Input() name = '';
	@Input() isWithErrorMessage = true;
	@Input() formControl: FormControl | null = null;

	@Input() errors: ValidationErrors | undefined | null;
	@Input() appearance: MatFormFieldAppearance = 'outline' as MatFormFieldAppearance;
	@Input() isFloatLabel: FloatLabelType = 'auto';
	@Input() disabled = false;
	@Input() isMultipleSelect = false;
	@Input() textareaRows = 5;

	@Input() selectOptions: any[] = [];
	@Input() selectOptionKey = '';
	@Input() selectOptionTitle = '';

	@Output() uploadedFilesChange = new EventEmitter<File[]>();


	@Input() required = false;
	isPassword = false;
	val: any;

	constructor () { }


	ngOnInit (): void {
		this.isPassword = ( this.type === 'password' );
		// this.required = (this.control.)
		if ( this.type === 'select' && ( !this.selectOptions || !this.selectOptionKey ) ) throw new Error( 'Invalid inputs for the select' );
	}


	get control (): FormControl {
		return this.formControl as FormControl;
	}


	get fieldName (): string {
		return this.name || this.label || '';
	}


	get fieldErrors (): ValidationErrors | undefined {
		let result: ValidationErrors = {};
		if ( this.control?.errors ) result = { ...this.control.errors };
		if ( this.errors ) result = { ...result, ...this.errors };
		return Object.keys( result )?.length > 0 ? result : undefined;
	}


	set value ( val: any ) {  // this value is updated by programmatic changes
		if ( val !== undefined && this.val !== val ) {
			this.val = val;
			this.control.setValue( val );
			this.onChange( val );
			this.onTouch( val );

			this.getErrorMessage();
		}
	}


	togglePassword = () => {
		this.type = this.type === 'password' ? 'text' : 'password';
	}


	getErrorMessage = (): string => {
		const errorsArray: string[] = [];
		const wildcardMessage = 'invalid value';
		const errorMessagesMap = Object.assign( {}, ErrorMessagesMap );
		const errors = this.fieldErrors;
		const _isPassword = this.isPassword;


		if ( !errors ) return '';
		Object.keys( errors )?.forEach( key => {
			if ( key === 'pattern' && _isPassword ) {
				errorsArray.push(
					PasswordRegexMap?.strong?.message
						? ( PasswordRegexMap?.strong?.message )
						: ( errorMessagesMap[ key ] ? errorMessagesMap[ key ] : wildcardMessage )
				);
			}
			else {
				let message = errorMessagesMap[ key ] ? errorMessagesMap[ key ] : wildcardMessage;
				// convert the error object/array to array of strings to inject them in the parametrized string
				const errorParam: string[] =
					(
						!Array.isArray( errors[ key ] ) ?
							Object.values( errors[ key ] )
							: ( errors[ key ] || [] )
					).map( ( e: any ) => e.toString() );

				// console.log( '**** input-field - errorParam : ', errorParam );
				message = ParamString.injectParamsValuesInString( message, errorParam );
				errorsArray.push( message );
			}
		} );

		return ( errorsArray || [] )?.map( e => ( e?.toString() ) )?.join( ', ' ) || '';
	}


	onFileUploadChange = ( value: Event ) => {
		// console.log( '**** **** **** **** onFileUploadChange...' );

		if ( !value ) throw new Error( 'Invalid event parameter for uploading file method' );
		const myFile: File | null = ( ( ( value.target as any )?.files || [] ) as FileList ).item( 0 );
		if ( !myFile ) throw new Error( 'No uploaded file' );
		this.uploadedFilesChange.emit( [ myFile ] );
		this.control.setValue( myFile?.name || '' );
	}


	onChange = ( value: any ) => { };
	onTouch = ( value: any ) => { };

	writeValue ( value: any ): void {
		this.value = value;
	}


	registerOnChange ( fn: any ): void {
		this.onChange = fn;
	}


	registerOnTouched ( fn: any ): void {
		this.onTouch = fn;
	}


}
