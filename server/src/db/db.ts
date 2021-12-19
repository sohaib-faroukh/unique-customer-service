

import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { resolve } from 'path';

export class DB {
	private static readonly file: string = resolve( 'db.json' );
	private static instance: JsonDB;
	private static initialize = async () => {
		console.log( '***** start initializing DB from file : ', DB.file );
		const db = new JsonDB( new Config( DB.file, true, true, '/' ) );
		DB.fillRootDocuments( db );
		return db;
	}

	private static fillRootDocuments = ( db: JsonDB ): void => {
		db.push( '/data/accounts', [], true );
		db.push( '/data/messages', [], true );
		db.push( '/data/conversations', [], true );
	}

	public static getInstance = async (): Promise<JsonDB> => {
		if ( !DB.instance ) DB.instance = await DB.initialize();
		return DB.instance;
	}
}


