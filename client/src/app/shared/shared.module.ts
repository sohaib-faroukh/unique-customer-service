import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { InputFieldModule } from './input-field/input-field.module';
import { LoadingButtonModule } from './loading-button/loading-button.module';
import { MaterialModule } from './material.module';
import { NotAuthorizedModule } from './not-authorized/not-authorized.module';
import { PipesModule } from './pipes/pipes.module';
import { SpinnerModule } from './spinner/spinner.module';



@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		// NgbDropdownModule,
		InputFieldModule,
		SpinnerModule,
		LoadingButtonModule,
		NotAuthorizedModule,
		PipesModule,
	],
	exports: [
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		// NgbDropdownModule,
		InputFieldModule,
		SpinnerModule,
		LoadingButtonModule,
		NotAuthorizedModule,
		PipesModule,
	],
} )
export class SharedModule { }
