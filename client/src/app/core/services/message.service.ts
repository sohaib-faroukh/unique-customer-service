import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocketEvents } from 'shared/configurations/socket-events';
import { IAccountVM } from 'shared/models/account';
import { ID } from 'shared/models/generics/id';
import { IMessage, IMessageVM } from 'shared/models/message';
import { getCurrent } from 'shared/utils/date.util';
import { uuid } from 'shared/utils/uuid.util';
import { ROUTES_MAP } from '../../routes.map';
import { BaseCrudService } from '../models/base-crud-service';
import { HttpSearchOptions } from '../models/http-search-options';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';

@Injectable()
export class MessageService extends BaseCrudService<IMessageVM<unknown>, HttpSearchOptions> {

	constructor (
		public http: HttpClient,
		public auth: AuthService,
		public router: Router,
		public socketService: SocketService,
	) {
		super( http );
		this.apiUrl = 'api/messages';
		this.socketService.addListener( SocketEvents.ServerSendMessage, this.onReceiveMessage );

	}

	public updateMessagesToService = ( messages: IMessageVM<unknown>[] ): void => {
		let toUpdateLocalData = this.data$.getValue();
		for ( const message of messages ) {
			const index = toUpdateLocalData.findIndex( m => !!m.id && m.id === message.id );
			if ( index >= 0 ) {
				toUpdateLocalData[ index ] = { ...toUpdateLocalData[ index ], ...message };
			}
			else {
				toUpdateLocalData.push( message );
			}
		}
		toUpdateLocalData = this.resolveMessageType( this.makeMessagesUnique( toUpdateLocalData ) );
		// this.messages$.next( toUpdateLocalData );
		this.sync( toUpdateLocalData, false );

	}


	public makeMessagesUnique = ( messages: IMessageVM<unknown>[] ) => {
		return messages.filter( ( d1, index ) => !!d1.id && index === messages.findIndex( d2 => d2.id === d1.id ) );
	}

	public resolveMessageType = ( messages: IMessageVM<unknown>[] ) => {
		const myAccount = this.auth.loggedInAccount$.getValue();
		return messages.map( msg => {
			if ( [ myAccount?.email, myAccount?.id ].includes( msg.sender ) ) {
				return { ...msg, type: 'mine' } as IMessageVM<unknown>;
			}
			else return { ...msg, type: 'others' } as IMessageVM<unknown>;
		}
		);
	}

	public onReceiveMessage = ( message: IMessageVM<unknown> ): void => {
		console.log( '***** SocketService => onReceiveMessage', message );
		this.updateMessagesToService( [ message ] );
	}


	public sendMessage = ( message: Omit<IMessageVM<unknown>, 'sender' | 'type' | 'senderName' | 'id' | 'clientTime' | 'serverTime'> ): void => {
		console.log( '***** SocketService => sendMessage', message );

		const loggedInAccount: IAccountVM | undefined = this.auth.loggedInAccount$.getValue();
		if ( !loggedInAccount ) {
			this.router.navigate( [ '/', ROUTES_MAP.login ] );
			throw new Error( 'please login first' );
		}

		const fullMessage = {
			...message,
			id: uuid(),
			sender: loggedInAccount.email,
			clientTime: getCurrent(),
		} as IMessage<unknown>;

		this.updateMessagesToService( [ fullMessage ] );
		this.socketService.socket.emit( SocketEvents.ClientSendMessage, fullMessage );
	}

	public getMessagesByConversation = async ( conversation: ID ) => {
		return await this.fetch( { conversation } ).toPromise();
	}

	public removeConversationMessages = ( conversationId: ID ): void => {
		if ( !conversationId ) return;
		const messagesToRemove = this.data$.getValue().filter( message => message.conversation === conversationId );
		this.sync( messagesToRemove, true );
	}

}
