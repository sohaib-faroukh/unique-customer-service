import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';

@Injectable()
export class SystemService {

	constructor ( private auth: AuthService, private messageService: MessageService, private conversationService: ConversationService ) { }

	logout = () => {
		this.auth.logout();
		this.messageService.data$.next( [] );
		this.conversationService.data$.next( [] );
	}
}
