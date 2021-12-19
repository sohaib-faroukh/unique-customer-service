import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HttpInterceptorProviders } from './interceptors';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { ConversationService } from './services/conversation.service';
import { MessageService } from './services/message.service';
import { ModalService } from './services/modal.service';
import { RoutingService } from './services/routing.service';
import { SocketService } from './services/socket.service';
import { SystemService } from './services/system.service';
import { UsersService } from './services/users.service';

@NgModule( {
	imports: [
		CommonModule,
		RouterModule,
		HttpClientModule,
	],
	providers: [
		HttpInterceptorProviders,
		RoutingService,
		AuthGuard,
		SystemService,
		SocketService,
		AlertService,
		AuthService,
		ModalService,
		UsersService,
		MessageService,
		ConversationService,
	],
} )
/**
 * The CoreModule contains application-wide singleton services
 */
export class CoreModule {
	constructor ( @Optional() @SkipSelf() core: CoreModule ) {
		if ( core ) {
			throw new Error( 'You should import core module only in the root module' );
		}
	}
}
