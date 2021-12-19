import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterPipe } from './filter.pipe';
import { FormatBigNumberPipe } from './format-big-number.pipe';
import { ListAsStringPipe } from './list-as-string.pipe';
import { RenderDateTimePipe } from './render-date-time.pipe';

const pipes = [
	FilterPipe,
	FormatBigNumberPipe,
	ListAsStringPipe,
	RenderDateTimePipe,
];

@NgModule( {
	declarations: [ ...pipes ],
	imports: [
		CommonModule,
	],
	exports: [ ...pipes ],
} )
export class PipesModule { }
