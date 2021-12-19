import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
	name: 'listAsString', pure: true,
} )
export class ListAsStringPipe implements PipeTransform {

	transform ( value: any[], key?: string, delimiter: string = ', ' ): string {
		if ( !key ) return value.map( e => String( e ) ).join( delimiter );
		return value.map( e => String( e[ key ] ).trim() ).join( delimiter );
	}

}
