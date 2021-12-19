import { AfterViewChecked, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertService } from 'client/src/app/core/services/alert.service';
import { AuthService } from 'client/src/app/core/services/auth.service';
import { ConversationService } from 'client/src/app/core/services/conversation.service';
import { MessageService } from 'client/src/app/core/services/message.service';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { IConversationVM } from 'shared/models/conversation';
import { ID } from 'shared/models/generics/id';
import { IMessageVM } from 'shared/models/message';

@Component( {
	selector: 'app-conversation',
	templateUrl: './conversation.component.html',
	styleUrls: [ './conversation.component.scss' ],
} )
export class ConversationComponent implements OnChanges, AfterViewChecked {

	@Input() id: ID = '';
	public messages$: Observable<IMessageVM<unknown>[]> = new Observable<IMessageVM<unknown>[]>();
	public messageControl: FormControl;
	public sending = false;
	public conversation$?: Observable<IConversationVM | undefined>;
	@ViewChild( 'chatBoxRef' ) public chatBoxDomElement?: ElementRef;

	constructor (
		public auth: AuthService,
		public messageService: MessageService,
		public alert: AlertService,
		private conversationService: ConversationService
	) {
		this.messageControl = new FormControl( '' );

	}


	async ngOnChanges ( changes: SimpleChanges ): Promise<void> {
		console.log( '***** ConversationComponent ngOnChanges: ', this.id );

		if ( this.id ) {
			this.conversation$ = this.conversationService.data$.pipe( map( cs => cs.find( c => c.id === this.id ) ) );

			await this.messageService.getMessagesByConversation( this.id );
			this.messages$ = this.messageService.data$.pipe(
				map( messages => messages.filter( m => m.conversation && m.conversation === this.id ) ),
			);
			this.conversationService.joinConversation( this.id );
		}
	}



	ngAfterViewChecked (): void {
		this.scrollChatBoxBottom();
	}


	private scrollChatBoxBottom = (): void => {
		if ( !this.chatBoxDomElement ) return;
		const height = this.chatBoxDomElement.nativeElement.scrollHeight;
		this.chatBoxDomElement.nativeElement.scrollTo( { top: height, behavior: 'smooth' } );
	}

	public reset = (): void => {
		this.messageControl.reset();
	}

	public onSubmit = async (): Promise<void> => {
		this.sending = true;
		await this.conversation$?.pipe(
			switchMap( async ( conversation ) => {
				if ( conversation?.id && String( this.messageControl.value || '' ).trim().length > 0 ) {
					await this.messageService.sendMessage( { content: this.messageControl.value, conversation: conversation?.id } );
					this.scrollChatBoxBottom();
				}
				else return;
			} ),
			delay( 200 ),
			tap( _ => {
				this.reset();
				this.sending = false;
			} )
		).toPromise();
	}

	public onRemoveConversationClick = async () => {
		await this.conversationService.removeConversation( this.id );
		this.id = '';
		this.messages$ = of( [] );
		this.conversation$ = of( undefined );
		this.reset();
		this.conversationService.currentConversation$.next( undefined );
		this.alert.info( 'deleted successfully' );
	}
}
