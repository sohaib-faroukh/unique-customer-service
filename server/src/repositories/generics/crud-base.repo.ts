import { ID } from '../../../../shared/models/generics/id';
import { DB } from '../../db/db';



export abstract class CrudBaseRepository<T, IdType extends ID> {


	constructor ( public collectionName: string ) {
		this.collectionName = `/data/${ this.collectionName }`;
	}

	public find = async (): Promise<T[]> => {
		return ( ( await DB.getInstance() ).getData( this.collectionName ) || [] ) as T[];
	}

	public findOne = async ( filters?: { [ k in keyof T ]: any } ): Promise<T> => {
		let result = await this.find();
		for ( const key in filters ) {
			if ( !!filters[ key ] ) {
				result = result.filter( item => item[ key ] && item[ key ] === filters[ key ] );
			}
		}
		return result[ 0 ];
	}

	public add = async ( entity: T ): Promise<T> => {
		( await DB.getInstance() ).push( `${ this.collectionName }[]`, entity );
		return entity;
	}

	public delete = async ( id: IdType ): Promise<T> => {
		const index = ( await DB.getInstance() ).getIndex( `${ this.collectionName }`, id, 'id' );
		if ( index < 0 ) throw new Error( 'requested resource is not found' );

		const itemPath = `${ this.collectionName }[${ index }]`;
		const item = ( await ( await DB.getInstance() ).getData( itemPath ) ) as T;
		( await DB.getInstance() ).delete( itemPath );
		return item;
	}


}
