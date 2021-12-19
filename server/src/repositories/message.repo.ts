import { IAccountVM } from '../../../shared/models/account';
import { ID } from '../../../shared/models/generics/id';
import { IMessage } from '../../../shared/models/message';
import { arrayToMap } from '../../../shared/utils/map.util';
import { DB } from '../db/db';
import { AccountRepoFactory } from './account.repo';
import { CrudBaseRepository } from './generics/crud-base.repo';

class MessageRepo extends CrudBaseRepository<IMessage<unknown>, ID> {


	public find = async (): Promise<IMessage<unknown>[]> => {

		const accountsMap = await AccountRepoFactory.getInstance().find().then( accountsArray => {
			return arrayToMap<IAccountVM>( ( accountsArray || [] ) as any, 'email' );
		} );

		const result = ( await DB.getInstance() ).getData( this.collectionName ) as IMessage<unknown>[];

		return result.map( m => ( {
			...m,
			senderName: accountsMap[ m.sender || '' ]?.name || '',
		} as IMessage<unknown> ) );
	}
}

export class MessageRepoFactory {
	static instance: MessageRepo;

	static getInstance = (): MessageRepo => {
		if ( !MessageRepoFactory.instance ) {
			MessageRepoFactory.instance = new MessageRepo( 'messages' );
		}
		return MessageRepoFactory.instance;
	}
}

