import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonDirective } from './directives/loading-button.directive';
import { SpinnerModule } from '../spinner/spinner.module';



@NgModule( {
	declarations: [ LoadingButtonDirective ],
	imports: [
		CommonModule,
		SpinnerModule,
	],
	exports: [ LoadingButtonDirective ],

} )
export class LoadingButtonModule { }
