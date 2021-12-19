import { ID } from './generics/id';

export interface IConversation {
	id: ID;
	topic: string;
	client: string; /* client account id */
	agent: string; /* agent account id */
	createdAt: string;
}

export interface IConversationVM extends Partial<IConversation> { }
