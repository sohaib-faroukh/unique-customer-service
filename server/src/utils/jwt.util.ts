import * as jwt from 'jsonwebtoken';
import { IAccount } from '../../../shared/models/account';
import { getEnvironment } from '../environments/env.util';

const settings = getEnvironment().auth;
const secret = settings.secret || 'not secure secret';
const jwtTokenLifeTime = settings.jwtTokenLifeTime;

export const generateAuthToken = ( payload: IAccount ) => {
	return jwt.sign( payload, secret, {
		expiresIn: `${ jwtTokenLifeTime }d`,
		subject: 'user-token',
		algorithm: 'HS256',
	} );
};

export const verifyAuthToken = ( idToken: string ): IAccount | null => {
	try {
		return jwt.verify( idToken, secret ) as IAccount;
	} catch ( err ) {
		console.error( err );
		return null;
	}
};
