import { compareSync, genSaltSync, hashSync } from 'bcrypt';

const saltRounds = 8;

export const encode = ( text: string ) => {
	const salt = genSaltSync( saltRounds );
	const hash = hashSync( text, salt );
	return hash;
};

export const compare = ( text: string, encoded: string ): boolean => {
	return compareSync( text, encoded );
};
