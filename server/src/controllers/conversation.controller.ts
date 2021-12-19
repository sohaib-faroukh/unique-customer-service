import { NextFunction, Request, RequestHandler, Response } from 'express';
import { query } from 'express-validator';
import { IConversation } from '../../../shared/models/conversation';
import { requestResponder } from '../middlewares/request-responder.middleware';
import { requestValidator } from '../middlewares/request-validator.middleware';
import { AccountRepoFactory } from '../repositories/account.repo';
import { ConversationRepoFactory } from '../repositories/conversation.repo';
import { getToken } from '../utils/auth.util';
import { getLoggedInAccount } from './account.controller';



export const getConversationByAccount: RequestHandler[] = [
	query( 'email' ).exists().bail().isEmail(),
	requestValidator,
	requestResponder( async ( req: Request, res: Response, next: NextFunction ) => {

		const { email } = req.query;
		if ( !req.headers.authorization ) throw new Error( 'Not authorized' );
		const token = getToken( req.headers.authorization || '' );

		const loggedInAccount = ( await getLoggedInAccount( token ) ) || undefined;

		if ( !loggedInAccount ) throw new Error( 'Not authorized' );

		if ( loggedInAccount.email !== email ) throw new Error( 'Access denied, you can only access your own conversations' );

		const account = ( await AccountRepoFactory.getInstance().findOne( { email } ) ) || undefined;
		if ( !account ) throw new Error( 'Not found, you email is not exist' );

		let result: IConversation[] = [];
		if ( account.type === 'agent' ) {
			result = ( await ConversationRepoFactory.getInstance().find() )
				.filter( m => m.agent === email );
		}
		else {
			result = ( await ConversationRepoFactory.getInstance().find() )
				.filter( m => m.client === email );
		}
		return result;
	} ),

];
