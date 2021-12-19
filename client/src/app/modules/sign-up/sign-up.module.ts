import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
	{ path: '', component: SignUpComponent },
];


@NgModule( {
	declarations: [ SignUpComponent ],
	imports: [
		CommonModule,
		RouterModule.forChild( routes ),
		SharedModule,
	],
} )
export class SignUpModule { }
