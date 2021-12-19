import * as  dotenv from 'dotenv';
dotenv.config();

export const environment = {
	production: false,
	PORT: process.env.PORT || 8080,
	ANGULAR_DIST_FILES: {
		path: 'dist/chat-app',
		rootFile: 'index.html',
	},
	auth: {
		secret: process.env.JWT_SECRET,
		jwtTokenLifeTime: '100',
	},
};
