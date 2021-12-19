import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AlertService } from 'client/src/app/core/services/alert.service';
import { AuthService } from 'client/src/app/core/services/auth.service';
import { ConversationService } from 'client/src/app/core/services/conversation.service';
import { IConversationVM } from 'shared/models/conversation';
import { ID } from 'shared/models/generics/id';

@Component( {
	selector: 'app-conversations-list',
	templateUrl: './conversations-list.component.html',
	styleUrls: [ './conversations-list.component.scss' ],
} )
export class ConversationsListComponent implements OnInit {
	selectedConversation?: ID = '';
	topicNameControl: FormControl;
	constructor (
		public auth: AuthService,
		public conversationService: ConversationService,
		private alert: AlertService,
	) {
		this.topicNameControl = new FormControl( '', [ Validators.required, Validators.minLength( 2 ) ] );
	}

	ngOnInit (): void {
	}

	onNewTopicClick = async () => {
		try {
			await this.conversationService.createNewConversation( { topic: this.topicNameControl.value } );
			this.topicNameControl.reset();
			this.alert.success( 'created' );
		} catch ( error: any ) {
			console.error( 'ERROR: ', error );
			this.alert.danger( 'something went wrong, ' + error.error || '' );
		}
	}

	onSelectConversation = ( conversation: IConversationVM ) => {
		this.selectedConversation = conversation.id;
		this.conversationService.currentConversation$.next( conversation );
	}

}
