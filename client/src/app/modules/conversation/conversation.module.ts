import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './components/conversation/conversation.component';
import { SharedModule } from '../../shared/shared.module';
import { MessageComponent } from './components/message/message.component';



@NgModule( {
	declarations: [ ConversationComponent, MessageComponent ],
	imports: [
		CommonModule,
		SharedModule,
	],
	exports: [ ConversationComponent ],
} )
export class ConversationModule { }
