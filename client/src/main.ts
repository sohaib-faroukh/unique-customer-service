import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if ( environment.production ) {
	enableProdMode();
}
// ------------------------------------------------------- //
//   Inject SVG Sprite -
//   see more here
//   https://css-tricks.com/ajaxing-svg-sprite/
// ------------------------------------------------------ //
// function injectSvgSprite ( path: string ): void {

// 	const ajax = new XMLHttpRequest();
// 	ajax.open( 'GET', path, true );
// 	ajax.send();
// 	ajax.onload = ( e ) => {
// 		const div = document.createElement( 'div' );
// 		div.className = 'd-none';
// 		div.innerHTML = ajax.responseText;
// 		document.body.insertBefore( div, document.body.childNodes[ 0 ] );
// 	};
// }
// this is set to BootstrapTemple website as you cannot
// inject local SVG sprite (using only 'icons/orion-svg-sprite.svg' path)
// while using file:// protocol
// pls don't forget to change to your domain :)
// injectSvgSprite( 'https://bootstraptemple.com/files/icons/orion-svg-sprite.svg' );

platformBrowserDynamic().bootstrapModule( AppModule )
	.catch( err => console.error( err ) );
