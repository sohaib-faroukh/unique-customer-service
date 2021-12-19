import { NextFunction, Request, RequestHandler, Response } from 'express';
import { body } from 'express-validator';
import { IAccount } from '../../../shared/models/account';
import { getCurrent } from '../../../shared/utils/date.util';
import { uuid } from '../../../shared/utils/uuid.util';
import { requestResponder } from '../middlewares/request-responder.middleware';
import { requestValidator } from '../middlewares/request-validator.middleware';
import { AccountRepoFactory } from '../repositories/account.repo';
import { getToken } from '../utils/auth.util';
import { compare, encode } from '../utils/bcrypt.util';
import { generateAuthToken, verifyAuthToken } from '../utils/jwt.util';

export const getAccounts: RequestHandler[] = [

	requestResponder( async ( req: Request, res: Response, next: NextFunction ) => {
		const repo = await AccountRepoFactory.getInstance().find();
		const accounts: IAccount[] = repo || [];
		return accounts;
	} ),

];


export const isAccountAuth: RequestHandler[] = [
	requestValidator,
	requestResponder( async ( req: Request, res: Response, next: NextFunction ) => {

		const token = req?.headers?.authorization;
		if ( !token ) throw new Error( 'Not authenticated, the token is not exist' );
		const account = verifyAuthToken( token ) as IAccount;
		if ( !account || !account?.email ) throw new Error( 'The account is not found' );
		const result = ( await AccountRepoFactory.getInstance().findOne( { email: account?.email } ) );
		if ( !result ) throw new Error( 'The token account is not found' );

		return result as IAccount;

	} ),

];

/**
 * sign up new account - add new account
 */
export const postAccount: RequestHandler[] = [
	body( 'email' ).exists().isEmail(),
	body( 'name' ).optional().isString(),
	body( 'password' ).exists().isString(),
	body( 'type' ).custom( ( e: string ) => [ 'agent', 'client' ].includes( e ) ),
	requestValidator,
	requestResponder( async ( req: Request, res: Response, next: NextFunction ) => {

		const payload = req?.body as Partial<IAccount>;
		const current = getCurrent();
		payload.createdAt = current;
		payload.type ||= 'client';
		payload.id = uuid();

		if ( !payload?.password ) throw new Error( 'no password is provided' );
		payload.password = encode( payload.password );
		const newAccount: IAccount = payload as IAccount;
		newAccount.token = generateAuthToken( newAccount );

		const result = ( await AccountRepoFactory.getInstance().add( newAccount ) ) || null;

		return secure( result );

	} ),

];


/**
 * login account - find and return the account specified by email and password
 */
export const postLoginAccount: RequestHandler[] = [
	body( 'email' ).exists().isEmail(),
	body( 'password' ).exists().isString(),
	requestValidator,
	requestResponder( async ( req: Request, res: Response, next: NextFunction ) => {
		const { email, password } = req?.body as Pick<IAccount, 'email' | 'password'>;
		const account = ( await AccountRepoFactory.getInstance().findOne( { email } ) ) as IAccount | null;
		if ( !account ) throw new Error( 'email is not found' );
		if ( !account?.password ) throw new Error( 'no password attached with the account' );
		const isPasswordMatch = compare( password || '', account?.password );
		if ( !isPasswordMatch ) throw new Error( 'wrong password' );
		return secure( account );
	} ),

];


export const getLoggedInAccount = async ( token: string | undefined ): Promise<IAccount | null> => {
	if ( !token ) return null;
	token = getToken( token );
	const account = verifyAuthToken( token );
	if ( account ) {
		return await AccountRepoFactory.getInstance().findOne( { email: account.email } ) || null;
	}
	else return null;

};

const secure = ( input: any ): any => {
	const result: any = { ...input };
	if ( 'password' in result ) delete result.password;
	return result;
};
