import { NextFunction, Request, RequestHandler, Response } from 'express';
import { query } from 'express-validator';
import { IMessage } from '../../../shared/models/message';
import { requestResponder } from '../middlewares/request-responder.middleware';
import { requestValidator } from '../middlewares/request-validator.middleware';
import { MessageRepoFactory } from '../repositories/message.repo';


export const getMessagesByConversation: RequestHandler[] = [
	query( 'conversation' ).exists().bail().isString(),
	requestValidator,
	requestResponder( async ( req: Request, res: Response, next: NextFunction ) => {

		const { conversation } = req.query;
		const result: IMessage<unknown>[] = ( await MessageRepoFactory.getInstance().find() )
			.filter( m => m.conversation === conversation );
		return result;
	} ),
];

