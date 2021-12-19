import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { SocketEvents } from 'shared/configurations/socket-events';
import { IAccountVM } from 'shared/models/account';
import { IConversationVM } from 'shared/models/conversation';
import { ID } from 'shared/models/generics/id';
import { getCurrent } from 'shared/utils/date.util';
import { uuid } from 'shared/utils/uuid.util';
import { ROUTES_MAP } from '../../routes.map';
import { BaseCrudService } from '../models/base-crud-service';
import { HttpSearchOptions } from '../models/http-search-options';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';
import { SocketService } from './socket.service';

@Injectable()
export class ConversationService extends BaseCrudService<IConversationVM, HttpSearchOptions> {

	currentConversation$ = new BehaviorSubject<IConversationVM | undefined>( undefined );
	loggedInAccount?: IAccountVM;
	constructor (
		public http: HttpClient,
		public auth: AuthService,
		public router: Router,
		public socketService: SocketService,
		public messageService: MessageService,
	) {
		super( http );
		this.apiUrl = 'api/conversations';

		this.auth.loggedInAccount$.pipe(
			tap( async account => {
				if ( account ) {
					this.loggedInAccount = account;
					this.data$.next( [] );
					this.socketService.addListener( SocketEvents.ServerSendUserConversations, this.onReceiveConversations );
					this.socketService.addListener( SocketEvents.ClientJoinConversation, this.onClientJoinConversation );
					this.socketService.addListener( SocketEvents.ClientLeaveConversation, this.onClientLeaveConversation );
					this.socketService.addListener( SocketEvents.ClientRemoveConversation, this.onClientRemoveConversation );
					this.initializeConversations( account );
					await this.fetch( { email: account.email } ).toPromise();
				}
			} ),
		).subscribe();
	}



	// Conversations


	private initializeConversations = ( account: IAccountVM ): void => {
		console.log( '***** SocketService => initializeConversations' );
		// const account = this.loggedInAccount$.getValue();
		if ( !account ) {
			this.router.navigate( [ '/', ROUTES_MAP.login ] );
			throw new Error( 'please login first' );
		}
		this.socketService.socket.emit( SocketEvents.ClientInitialize, account.email );
	}

	private updateConversationsToService = ( conversations: IConversationVM[] ): void => {
		// const toUpdateLocalData = this.data$.getValue();
		// for ( const conversation of conversations ) {
		// 	const index = toUpdateLocalData.findIndex( c => !!c.id && c.id === conversation.id );
		// 	if ( index >= 0 ) {
		// 		toUpdateLocalData[ index ] = { ...toUpdateLocalData[ index ], ...conversation };
		// 	}
		// 	else {
		// 		toUpdateLocalData.push( conversation );
		// 	}
		// }
		// this.data$.next( toUpdateLocalData );
		this.sync( conversations );
	}

	private onReceiveConversations = ( conversations: IConversationVM[] ): void => {
		if ( !this.loggedInAccount || !conversations || conversations.length === 0 ) return;
		conversations = conversations.filter( c =>
			[ c.client, c.agent ].includes( this.loggedInAccount?.email || '' )
			|| [ c.client, c.agent ].includes( String( this.loggedInAccount?.id || '' ) )
		);
		console.log( '***** SocketService => onReceiveConversations', conversations );
		this.updateConversationsToService( conversations );
	}


	public createNewConversation = async ( conversation: Pick<IConversationVM, 'topic'> ): Promise<void> => {
		console.log( '***** SocketService => createNewConversation', conversation );

		const loggedInAccount: IAccountVM | undefined = this.auth.loggedInAccount$.getValue();
		if ( !loggedInAccount ) {
			this.router.navigate( [ '/', ROUTES_MAP.login ] );
			throw new Error( 'please login first' );
		}

		const fullConversation: IConversationVM = {
			...conversation,
			id: uuid(),
			client: loggedInAccount.email,
			createdAt: getCurrent(),
		} as IConversationVM;
		this.socketService.socket.emit( SocketEvents.ClientCreateNewConversation, fullConversation );
		this.sync( [ fullConversation ] );
	}

	public removeConversation = async ( id: ID ): Promise<void> => {
		if ( !id ) return;
		console.log( '***** SocketService => removeConversation', id );
		this.messageService.removeConversationMessages( id );
		this.socketService.socket.emit( SocketEvents.ClientRemoveConversation, id );
	}

	public joinConversation = async ( conversationId: ID ): Promise<void> => {

		if ( this.currentConversation$.getValue()?.id ) {
			this.leaveConversation( this.currentConversation$.getValue()?.id || '' );
		}

		console.log( '***** SocketService => joinConversation', conversationId );
		if ( !conversationId ) throw new Error( 'no id for this conversation' );
		const loggedInAccount: IAccountVM | undefined = this.auth.loggedInAccount$.getValue();
		if ( !loggedInAccount ) {
			this.router.navigate( [ '/', ROUTES_MAP.login ] );
			throw new Error( 'please login first' );
		}

		await this.data$.pipe(
			map( cs => cs.find( c => c.id === conversationId ) ),
			filter( cs => !!cs ),
			tap( cs => {
				this.currentConversation$.next( cs );
				this.socketService.socket.emit( SocketEvents.ClientJoinConversation, { conversation: cs?.id, account: loggedInAccount.email } );
			} ),
		).toPromise();




	}

	private leaveConversation = ( conversationId: ID ) => {
		console.log( '***** SocketService => leaveConversation', conversationId );
		if ( !conversationId ) throw new Error( 'no id for this conversation' );
		const loggedInAccount: IAccountVM | undefined = this.auth.loggedInAccount$.getValue();
		if ( !loggedInAccount ) {
			this.router.navigate( [ '/', ROUTES_MAP.login ] );
			throw new Error( 'please login first' );
		}

		this.socketService.socket.emit( SocketEvents.ClientLeaveConversation, { conversation: conversationId, account: loggedInAccount.email } );
	}

	private onClientJoinConversation = ( account: IAccountVM ) => {
		console.log( '**** SocketService => onClientJoinConversation', account );
	}

	private onClientLeaveConversation = ( account: IAccountVM ) => {
		console.log( '**** SocketService => onClientLeaveConversation', account );
	}

	private onClientRemoveConversation = ( conversations: IConversationVM[] ) => {
		console.log( '**** SocketService => onClientRemoveConversation', conversations );
		if ( !conversations || conversations.length === 0 ) return;
		this.sync( conversations, true );
		conversations.forEach( conversation => {
			if ( !conversation.id ) return;
			this.messageService.removeConversationMessages( conversation.id );
		} );
	}

}
