import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationsListComponent } from './components/conversations-list/conversations-list.component';
import { ConversationModule } from '../conversation/conversation.module';
import { RouterModule } from '@angular/router';
import { ROUTES_MAP } from '../../routes.map';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SharedModule } from '../../shared/shared.module';



@NgModule( {
	declarations: [ ConversationsListComponent ],
	imports: [
		CommonModule,
		RouterModule.forChild( [
			{
				// canActivate: [ AuthGuard ], 
				path: ROUTES_MAP.empty, canActivate: [ AuthGuard ], children: [
					{ path: ROUTES_MAP.empty, pathMatch: 'full', component: ConversationsListComponent },
				],
			},
		] ),
		ConversationModule,
		SharedModule,
	],
} )
export class ConversationsListModule { }
