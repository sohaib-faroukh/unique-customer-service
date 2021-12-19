import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAuthorizedComponent } from './not-authorized.component';



@NgModule( {
	declarations: [ NotAuthorizedComponent ],
	imports: [
		CommonModule,
	],
	exports: [ NotAuthorizedComponent ],
} )
export class NotAuthorizedModule { }
