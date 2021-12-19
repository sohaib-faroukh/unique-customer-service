import { IAccountVM } from '../../../shared/models/account';
import { CrudBaseRepository } from './generics/crud-base.repo';

class AccountRepo extends CrudBaseRepository<IAccountVM, string> {
}

export class AccountRepoFactory {
	static instance: AccountRepo;

	static getInstance = (): AccountRepo => {
		if ( !AccountRepoFactory.instance ) {
			AccountRepoFactory.instance = new AccountRepo( 'accounts' );
		}
		return AccountRepoFactory.instance;
	}
}

