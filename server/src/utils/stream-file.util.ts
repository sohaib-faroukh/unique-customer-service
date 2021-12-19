const fs = require( 'fs' );
const { streamArray } = require( 'stream-json/streamers/StreamArray' );
const { chain } = require( 'stream-chain' );
const pick = require( 'stream-json/filters/Pick' );

/**
 * read json file content and parse it into array
 * use this method for large files instead of JSON.parse is more efficient
 * @param filePath the file location
 * @param listener callback to execute it while read and parse the json objects
 * @param path json array path in the file
 */
export const readDataFromFile = <T> ( filePath: string, listener: ( chunk: T ) => void, path?: string ): Promise<any> => {

	return new Promise<any>( ( resolve, reject ) => {
		try {
			const fileStream = fs.createReadStream( filePath );

			// chain of file stream reader, json array locator, json array parser
			const streamChain = [ fileStream ];
			if ( path ) streamChain.push( pick.withParser( { filter: path } ) );
			streamChain.push( streamArray() );

			const pipeline = chain( streamChain );
			pipeline.on( 'data', listener );
			pipeline.on( 'end', () => resolve( true ) );

		} catch ( error ) {
			reject( error );
		}
	} );

};
