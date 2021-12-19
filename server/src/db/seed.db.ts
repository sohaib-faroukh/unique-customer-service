import { IConversation } from '../../../shared/models/conversation';
import { IAccount } from '../../../shared/models/account';
import { getCurrent } from '../../../shared/utils/date.util';
import { uuid } from '../../../shared/utils/uuid.util';
import { AccountRepoFactory } from '../repositories/account.repo';
import { ConversationRepoFactory } from '../repositories/conversation.repo';
import { encode } from '../utils/bcrypt.util';
import { generateAuthToken } from '../utils/jwt.util';

const AGENT_SIZE = 2;
const CLIENT_SIZE = 2;

export const seedAgentsAccounts = async () => {
	const agents = ( ( await AccountRepoFactory.getInstance().find() ) || [] ).filter( ac => ac.type === 'agent' );
	if ( agents.length > 0 ) return;
	else {
		const current = getCurrent();
		for ( let i = 1; i <= AGENT_SIZE; i++ ) {
			const account = {
				id: uuid(),
				email: `agent${ i }@email.com`,
				name: `Agent ${ i }`,
				password: encode( `agent${ i }@email.com` ),
				type: 'agent',
				status: 'active',
				createdAt: current,
			} as IAccount;
			account.token = generateAuthToken( account );
			await AccountRepoFactory.getInstance().add( account );
		}
	}
};


export const seedClientsAccounts = async () => {
	const agents = ( ( await AccountRepoFactory.getInstance().find() ) || [] ).filter( ac => ac.type === 'client' );
	if ( agents.length > 0 ) return;
	else {
		const current = getCurrent();
		for ( let i = 1; i <= CLIENT_SIZE; i++ ) {
			const account = {
				id: uuid(),
				email: `client${ i }@email.com`,
				name: `Client ${ i }`,
				password: encode( `client${ i }@email.com` ),
				type: 'client',
				status: 'active',
				createdAt: current,
			} as IAccount;
			account.token = generateAuthToken( account );
			await AccountRepoFactory.getInstance().add( account );
		}
	}
};


export const seedConversations = async () => {
	const data: IConversation[] = [ {
		topic: 'Topic1',
		client: 'client1@email.com',
		createdAt: '2021-12-18 08:28:11 AM',
		id: 'c0de4f92-d9d8-442c-b846-feb8ab98246c',
		agent: 'agent1@email.com',
	},
	{
		topic: 'Topic2',
		client: 'client1@email.com',
		createdAt: '2021-12-18 08:36:12 AM',
		id: 'fe44a8e8-fb09-464e-a8da-87cb22bee58b',
		agent: 'agent1@email.com',
	} ];

	for ( const c of data ) {
		await ConversationRepoFactory.getInstance().add( c );
	}


};
