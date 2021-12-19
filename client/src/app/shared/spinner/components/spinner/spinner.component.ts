import { Component, ElementRef, Input, OnInit } from '@angular/core';

type Sizes = 'small' | 'large';
type Aligns = 'center' | 'right' | 'left';

@Component( {
	selector: 'app-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: [ './spinner.component.scss' ],
} )
export class SpinnerComponent implements OnInit {

	@Input() data: { size: Sizes, align?: Aligns } = { size: 'large', align: 'center' };

	constructor ( public _elementRef: ElementRef ) { }

	ngOnInit (): void {
	}

}
