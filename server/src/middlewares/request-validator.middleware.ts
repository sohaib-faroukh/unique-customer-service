import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const requestValidator = ( req: Request, res: Response, next: NextFunction ) => {
	const errors = validationResult( req );
	if ( errors.isEmpty() ) {
		next();
	} else {
		throw res.status( StatusCodes.BAD_REQUEST ).send( {
			code: StatusCodes.BAD_REQUEST,
			message: 'Bad Request',
			errors: errors.array(),
		} );
	}
};
