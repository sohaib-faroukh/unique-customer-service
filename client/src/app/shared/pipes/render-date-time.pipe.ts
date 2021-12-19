import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, formatDateShort } from 'shared/utils/date.util';

@Pipe( {
	name: 'renderDateTime', pure: true,
} )
export class RenderDateTimePipe implements PipeTransform {

	transform ( value: string, format: 'short' | 'long' = 'long' ): string {
		return format === 'long' ? formatDate( value ) : formatDateShort( value );
	}

}
