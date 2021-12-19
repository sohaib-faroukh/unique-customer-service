import * as express from 'express';
import { NextFunction, Router } from 'express';
import { Server } from 'http';
import * as logger from 'morgan';
import { isAccountAuth, postAccount, postLoginAccount } from './controllers/account.controller';
import { getConversationByAccount } from './controllers/conversation.controller';
import { getMessagesByConversation } from './controllers/message.controller';
import { seedAgentsAccounts, seedClientsAccounts, seedConversations } from './db/seed.db';
import { getEnvironment } from './environments/env.util';
import { cors } from './middlewares/cors.middleware';
import { requestResponder } from './middlewares/request-responder.middleware';
import { authorize } from './utils/auth.util';
import { createSocketFromServer, listenToSocketEvents } from './controllers/socket.controller';

const env = process.argv?.includes( '--production' ) ? getEnvironment( 'prod' ) : getEnvironment();
const ANGULAR_DIST_FILES = env?.ANGULAR_DIST_FILES;
const PORT = env.PORT || 8081;
const PREFIX = '/api';


const apiRoutes: Router = Router();


// Routes don not need authorization

//  Login & sign-up endpoints
apiRoutes.route( PREFIX + '/auth/new' ).post( postAccount );
apiRoutes.route( PREFIX + '/auth/login' ).post( postLoginAccount );
apiRoutes.route( PREFIX + '/auth/is-auth' ).get( isAccountAuth );



// Routes needs authorization

// Conversations endpoints
apiRoutes.route( PREFIX + '/conversations' ).get( authorize, getConversationByAccount );


// Messages endpoints
apiRoutes.route( PREFIX + '/messages' ).get( authorize, getMessagesByConversation );



// Static files routes - don not needs authorization
//  Frontend application files -static files-
apiRoutes.route( '/*' ).get( ( req, res ) =>
	res.sendFile( ANGULAR_DIST_FILES.rootFile, { root: ANGULAR_DIST_FILES.path } )
);




// Bootstrapping the application
const expressApp = express();

expressApp.use( express.static( ANGULAR_DIST_FILES.path ) );
expressApp.use( express.json() );
expressApp.use( express.urlencoded( { limit: '200mb', extended: true } ) );

expressApp.use( cors );
expressApp.use( logger( 'short' ) );
expressApp.use( apiRoutes );

expressApp.use( '', requestResponder( ( req: Request, res: Response, next: NextFunction ) => {
	throw new Error( 'Route is not implemented' );
} ) );


export const bootstrapTheApp = async () => {
	const server: Server = expressApp.listen( PORT, async () => {
		console.log( `\n***** THE APP IS RUNNING ON PORT #${ PORT } *****\n` );

		console.log( `\n***** SEEDING DATABASE\n` );
		await seedAgentsAccounts();
		await seedClientsAccounts();
		await seedConversations();
		console.log( `\n***** END SEEDING\n` );

	} );
	listenToSocketEvents( createSocketFromServer( server ) );
};


