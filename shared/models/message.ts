import { ID } from './generics/id';

export type MessageContact = string | '*' | undefined;

export interface IMessage<T> {
	id?: ID;
	content: T;
	conversation?: ID;
	clientTime?: string;
	serverTime?: string;
	sender?: MessageContact;
	senderName?: string;
	receiver?: MessageContact;
}

export interface IMessageVM<T> extends IMessage<T> {
	type?: 'mine' | 'others';
	// receiverName?: string;
}

