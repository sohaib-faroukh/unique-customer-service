import { IConversation } from '../../../shared/models/conversation';
import { CrudBaseRepository } from './generics/crud-base.repo';
import { MessageRepoFactory } from './message.repo';

class ConversationRepo extends CrudBaseRepository<IConversation, string> {

	public deleteConversationWithMessages = async ( id: string ): Promise<void> => {
		try {
			if ( !id ) return;
			const conversationMessages = await MessageRepoFactory.getInstance().find().then( messages => messages.filter( m => m.conversation === id ) );
			for ( const msg of conversationMessages ) {
				try {
					if ( !msg.id ) continue;
					await MessageRepoFactory.getInstance().delete( msg.id );
				} catch ( error ) {
					console.error( error );
					continue;
				}
			}
			await this.delete( id );
		} catch ( error ) {
			console.error( error );
		}
	}

}

export class ConversationRepoFactory {
	static instance: ConversationRepo;

	static getInstance = (): ConversationRepo => {
		if ( !ConversationRepoFactory.instance ) {
			ConversationRepoFactory.instance = new ConversationRepo( 'conversations' );
		}
		return ConversationRepoFactory.instance;
	}
}

