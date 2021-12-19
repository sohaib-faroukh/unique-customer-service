import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from './components/input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';



@NgModule( {
	declarations: [ InputFieldComponent ],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MaterialModule,
	],
	exports: [ InputFieldComponent ],

} )
export class InputFieldModule { }
