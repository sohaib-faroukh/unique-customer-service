import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EmbeddedViewRef, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { SpinnerComponent } from '../../spinner/components/spinner/spinner.component';

@Directive( {
	selector: 'button[appLoadingButton], a[appLoadingButton]',
} )
export class LoadingButtonDirective implements OnInit, OnChanges {

	@Input() appLoadingButton = false;
	originalInnerText: string = '';
	originalState: boolean = true;
	originalInnerHTML: string = '';
	private componentRef: ComponentRef<SpinnerComponent> | null = null;


	spinner: SpinnerComponent | null = null;
	elementBtnRef: HTMLButtonElement = this.elementRef.nativeElement;
	elementBtnRefClone: HTMLButtonElement | null = null;

	constructor (
		public viewContainerRef: ViewContainerRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		public elementRef: ElementRef,
	) {
	}


	ngOnInit (): void { }


	ngOnChanges ( changes: SimpleChanges ): void {
		if ( changes.appLoadingButton.isFirstChange() ) {
			// this backup to read, save and render the first state of the button
			this.backup();
		}
		this.handleLoadingState();
	}


	backup = () => {
		this.originalInnerHTML = ( this.elementRef.nativeElement as HTMLButtonElement ).innerHTML;
		this.originalState = this.elementBtnRef.disabled;
		// console.log( '**** this.originalInnerHTML: ', this.originalInnerHTML );
	}

	resetBackup = () => {
		this.elementBtnRef.disabled = this.originalState;
		this.elementBtnRef.innerHTML = this.originalInnerHTML;
	}


	handleLoadingState = () => {

		if ( this.appLoadingButton ) {

			// we need to backup the button state here too, in order to read its latest state before setting the spinner
			this.backup();
			this.elementBtnRef.disabled = true;
			this.loadSpinnerComponent();
		}
		else {
			this.resetBackup();
			this.destroySpinnerComponent();
		}

	}


	loadSpinnerComponent = () => {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory( SpinnerComponent );
		this.viewContainerRef.clear();
		this.componentRef = this.viewContainerRef.createComponent<SpinnerComponent>( componentFactory );
		this.componentRef.instance.data = { size: 'small' };

		const domElem = ( this.componentRef.hostView as EmbeddedViewRef<any> ).rootNodes[ 0 ] as HTMLElement;
		this.elementBtnRef.textContent = '';
		this.elementBtnRef.appendChild( domElem );
	}


	destroySpinnerComponent = () => {
		if ( this.componentRef ) this.componentRef.destroy();
	}



}
