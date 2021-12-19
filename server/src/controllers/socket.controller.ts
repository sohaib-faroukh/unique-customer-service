import { Server } from 'http';
import { tryCatch } from '../../../shared/utils/error-catcher.util';
import { Server as SocketServer, Socket } from 'socket.io';
import { SocketEvents } from '../../../shared/configurations/socket-events';
import { IConversation } from '../../../shared/models/conversation';
import { ID } from '../../../shared/models/generics/id';
import { IMessage, IMessageVM } from '../../../shared/models/message';
import { getCurrent } from '../../../shared/utils/date.util';
import { uuid } from '../../../shared/utils/uuid.util';
import { AccountRepoFactory } from '../repositories/account.repo';
import { ConversationRepoFactory } from '../repositories/conversation.repo';
import { MessageRepoFactory } from '../repositories/message.repo';
import { IMap } from '../../../shared/models/generics/map';
import { IAccountVM } from '../../../shared/models/account';


const log = ( event: string, message: string = '' ): void => {
	// console.log( `**** SERVER - ${ event.toLowerCase() }: ${ message }` );
	console.log( `**** SERVER - ${ event.toLowerCase() }` );
};

const selectAgent = async (): Promise<IAccountVM> => {

	const agents = ( await AccountRepoFactory.getInstance().find() ).filter( acc => acc.type === 'agent' && acc.status === 'active' );
	if ( agents.length === 0 ) throw new Error( 'no available agent, sorry!' );

	const randomIndex = Math.floor( Math.random() * agents.length );
	const selectedAgentAccount = agents[ randomIndex ];
	return selectedAgentAccount;
};

const createNewMessage = ( data: IMessageVM<unknown> ): IMessageVM<unknown> => {

	if ( !data.conversation ) throw new Error( 'no conversation' );
	if ( !data.sender ) throw new Error( 'no sender info' );
	if ( !data.content ) throw new Error( 'no content' );
	data.id ||= uuid();
	data.content ||= 'No content';
	data.serverTime = getCurrent();
	return data;
};

const createNewConversation = async ( data: IConversation ) => {

	const clientAccount = await AccountRepoFactory.getInstance().findOne( { email: data.client } );
	if ( !clientAccount ) throw new Error( 'client account is not provided, sorry!' );


	data.id ||= uuid();
	data.topic ||= `Topic-[${ data.createdAt }]`;
	data.agent = ( await selectAgent() ).email || '';
	data.client = clientAccount.email || '';
	data.createdAt = getCurrent();

	await ConversationRepoFactory.getInstance().add( data );
	return data;
};

export const createSocketFromServer = ( server: Server ): SocketServer => {
	return new SocketServer( server, {
		cors: {
			origin: true,
			methods: [ 'GET', 'POST' ],
		},
	} );
};


export const listenToSocketEvents = ( io: SocketServer ): void => {
	try {
		io.on( 'connection', ( socket: Socket ) => {

			// handler methods definition

			const onClientSendMessage = ( data: IMessage<string> ) => {
				tryCatch( async () => {
					if ( !data.content ) return;
					if ( !data.conversation ) throw new Error( 'no selected conversation' );
					log( SocketEvents.ClientSendMessage, JSON.stringify( data ) );

					const senderAccount = await AccountRepoFactory.getInstance().findOne( { email: data.sender } );
					const room = String( data.conversation || '' );
					socket.join( room );
					const fullMessage = createNewMessage( { ...data, senderName: senderAccount?.name || '' } as IMessage<string> );
					io.to( room ).emit( SocketEvents.ServerSendMessage, fullMessage );
					await MessageRepoFactory.getInstance().add( fullMessage );
				} );
			};

			const onClientInitialize = async ( data: string ) => {
				tryCatch( async () => {
					log( SocketEvents.ClientInitialize, JSON.stringify( data ) );
				} );
			};

			const onClientJoinConversation = async ( data: { conversation: ID, account: string } ) => {
				tryCatch( async () => {

					const { conversation, account } = data;
					if ( !conversation ) throw new Error( 'conversation is not specified' );
					if ( !account ) throw new Error( 'account is not specified' );

					const joinedAccount = await AccountRepoFactory.getInstance().findOne( { email: account } );
					const room = String( conversation );
					socket.join( room );
					io.to( room ).emit( SocketEvents.ClientJoinConversation, joinedAccount );
				} );
			};

			const onClientLeaveConversation = async ( data: { conversation: ID, account: string } ) => {
				tryCatch( async () => {
					const { conversation, account } = data;
					const room = String( conversation );
					const leftAccount = await AccountRepoFactory.getInstance().findOne( { email: account } );
					socket.leave( room );
					socket.rooms.delete( room );
					io.to( room ).emit( SocketEvents.ClientLeaveConversation, leftAccount );
				} );
			};

			const onClientCreateNewConversation = async ( data: IConversation ) => {
				tryCatch( async () => {
					log( SocketEvents.ClientCreateNewConversation, JSON.stringify( data ) );
					const newConversation = await createNewConversation( data );
					io.emit( SocketEvents.ServerSendUserConversations, [ newConversation ] );
					log( SocketEvents.ServerSendUserConversations, JSON.stringify( newConversation ) );

					sendWelcomeMessage( newConversation );

				} );
			};

			const sendWelcomeMessage = ( newConversation: IConversation ) => {
				onClientSendMessage( {
					content: 'Welcome, please wait',
					clientTime: getCurrent(),
					conversation: newConversation.id,
					sender: newConversation.agent,
				} );
			};

			const onClientRemoveConversation = async ( conversation: ID ) => {
				tryCatch( async () => {
					if ( !conversation ) return;
					log( SocketEvents.ClientRemoveConversation, String( conversation || '' ) );
					const removedConversation = await ConversationRepoFactory.getInstance().findOne( { id: ( conversation || '' ).toString() } as any );
					await ConversationRepoFactory.getInstance().deleteConversationWithMessages( String( conversation || '' ) );
					io.emit( SocketEvents.ClientRemoveConversation, [ removedConversation ] );
				} );
			};





			// handler methods usage in events

			const EVENTS_MAP: IMap<( ...args: any[] ) => void> = {
				[ SocketEvents.ClientInitialize ]: onClientInitialize,
				[ SocketEvents.ClientSendMessage ]: onClientSendMessage,
				[ SocketEvents.ClientJoinConversation ]: onClientJoinConversation,
				[ SocketEvents.ClientLeaveConversation ]: onClientLeaveConversation,
				[ SocketEvents.ClientCreateNewConversation ]: onClientCreateNewConversation,
				[ SocketEvents.ClientRemoveConversation ]: onClientRemoveConversation,
			};

			for ( const event in EVENTS_MAP ) {
				if ( EVENTS_MAP[ event ] ) {
					socket.on( event, EVENTS_MAP[ event ] );
				}
			}



		} );
	} catch ( error ) {
		console.error( error );
	}
};
