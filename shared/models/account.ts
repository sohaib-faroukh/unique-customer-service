import { ID } from './generics/id';

export type AccountType = 'client' | 'agent';

export interface IAccount {
	id?: ID;
	name?: string;
	email?: string;
	password?: string;
	status?: 'active' | 'busy' | 'inactive';
	type?: AccountType;
	token?: string;
	createdAt?: string;
}

export interface IPermissionsSet {
	permissions?: Set<string>;
}
export interface IRemovable {
	isRemovable?: boolean;
}
export interface IAccountVM extends IAccount, IPermissionsSet, IRemovable { }
export const getDefaultAccount = (): IAccountVM => {
	return {
		id: '',
		name: '',
		phone: '',
		distance: 0,
		username: '',
		language: 'AR',
		email: '',
		password: '',
		token: '',
		type: 'client',
		lastLoginAt: '',
		isCorporate: false,
	} as IAccountVM;
};
