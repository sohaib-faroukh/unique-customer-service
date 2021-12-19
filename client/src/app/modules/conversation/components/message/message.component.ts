import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'client/src/app/core/services/auth.service';
import { IMessageVM } from 'shared/models/message';

@Component( {
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: [ './message.component.scss' ],
} )
export class MessageComponent implements OnInit {

	@Input() message?: IMessageVM<unknown>;

	constructor ( public auth: AuthService ) { }

	ngOnInit (): void {
	}

}
