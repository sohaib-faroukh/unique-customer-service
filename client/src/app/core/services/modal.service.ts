import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { uuid } from 'shared/utils/uuid.util';

interface ModalMap<D> {
	[ key: string ]: MatDialogRef<D>;
}
class MatDialogRefId<T> extends MatDialogRef<T>{
	public id: string = '';
}
@Injectable()
export class ModalService {

	public modalRef: MatDialogRefId<any> | null = null;
	private _config = new MatDialogConfig();
	public modals: ModalMap<any> = {};
	public modals$ = new BehaviorSubject<ModalMap<any>>( {} );

	constructor ( public matDialog: MatDialog ) { }

	open = <T, D = any, R = any> ( component: ComponentType<T>, config?: MatDialogConfig<D> ): MatDialogRef<T, R> => {

		const dialogConfig = {
			...config,
			closeOnNavigation: true,
			margin: '0',
			maxHeight: '80vh',
			disableClose: true,
			hasBackdrop: true,
		} as MatDialogConfig;
		dialogConfig.position = { top: '5%' };


		const newId = uuid();
		dialogConfig.id = newId;
		// console.log( '**** dialog -  dialogConfig: ', dialogConfig );

		const modalDialogRef = this.matDialog.open( component, dialogConfig );
		this.modals[ newId ] = modalDialogRef;
		this.modals$.next( this.modals );
		this.modalRef = modalDialogRef as MatDialogRef<T> & { id: string };
		this.modalRef.id = newId;
		return modalDialogRef;
	}


	close = ( paramModalRef?: MatDialog ) => {

		if ( paramModalRef ) {
			// console.log( '**** dialog -  closing all ...' );
			paramModalRef.closeAll();
		}
		else {
			// console.log( '**** dialog -  closing...' );
		}
		if ( !this.modalRef ) return;
		const id = this.modalRef.id;
		delete this.modals[ id ];
		this.modals$.next( this.modals );
		this.modalRef.close();
		this.modalRef = null;
	}

}
