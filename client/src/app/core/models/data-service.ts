import { BehaviorSubject } from 'rxjs';

export interface IDataService<T> {
	data$: BehaviorSubject<T[]>;
	count$: BehaviorSubject<number>;
}
