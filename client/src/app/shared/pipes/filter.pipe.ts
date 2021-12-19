import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
	name: 'filter', pure: true,
} )
export class FilterPipe implements PipeTransform {

	transform ( array: any[], key: string, value: any ): any[] {
		return value ? array.filter( item => item[ key ]?.toString() === value?.toString() ) : array;
	}

}
