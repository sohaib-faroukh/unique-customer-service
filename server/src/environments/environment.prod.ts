import * as  dotenv from 'dotenv';
dotenv.config();

export const environment = {
	production: true,
	PORT: process.env.PORT || 8080,
	ANGULAR_DIST_FILES: {
		path: 'chat-app',
		rootFile: 'index.html',
	},
	auth: {
		secret: process.env.JWT_SECRET,
		jwtTokenLifeTime: '100',
	},
};
