import { environment } from './environment';
import { environment as prodEnvironment } from './environment.prod';

export const getEnvironment = ( env?: 'dev' | 'prod' ) => {
	if ( process.env.NODE_ENV === 'production' || env === 'prod' ) {
		console.log( '***** PRODUCTION *****' );
		return prodEnvironment;
	}
	return environment;

};
