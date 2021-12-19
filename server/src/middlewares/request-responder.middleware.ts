import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const requestResponder = ( fn: any ) => {
	return async ( req: Request, res: Response, next: NextFunction ) => {
		try {
			return await fn( req, res, next ).then( ( result: any ) => {
				try {
					if ( !result ) {
						return res.status( StatusCodes.NO_CONTENT ).json( {
							code: StatusCodes.NO_CONTENT,
							message: result.message || 'success',
							data: null,
						} );
					}
					return res.status( StatusCodes.OK ).json( {
						code: StatusCodes.OK,
						message: result.message || 'success',
						data: result?.onlyDataToBeSent || result,
					} );
				}
				catch ( e: any ) {
					throw e;
				}
			} ).catch( ( e: any ) => {
				throw e;
			} );
		} catch ( error: any ) {
			console.error( '**** ERROR: ', error );
			return res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				error: error?.message || 'Failure',
				message: '',
				data: null,
			} );

		}
	};
};
