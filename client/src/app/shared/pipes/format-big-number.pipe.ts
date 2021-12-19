import { Pipe, PipeTransform } from '@angular/core';
import { formatBigNumbers } from 'shared/utils/format-number.util';

@Pipe( {
	name: 'formatBigNumber',
	pure: true,
} )
export class FormatBigNumberPipe implements PipeTransform {

	transform ( value: number | string ): string {
		return formatBigNumbers( value );
	}

}
