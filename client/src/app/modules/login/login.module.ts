import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
];

@NgModule( {
	declarations: [ LoginComponent ],
	imports: [
		CommonModule,
		RouterModule.forChild( routes ),
		SharedModule,
	],
} )
export class LoginModule { }
