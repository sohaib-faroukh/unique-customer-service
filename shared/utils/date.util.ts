import * as moment from 'moment';
import { Moment } from 'moment';
import { updateFor } from 'typescript';
const DATE_FORMAT_SHORT = 'YYYY-MM-DD';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss A';
const CLEAN_DATE_FORMAT = 'YYYYMMDDHHmmssA';

export const stringToDate = ( date: string ): Moment => {
	return moment( date, DATE_FORMAT );
};


export const cleanDateFormat = ( date: Moment | Date ): string => {
	return moment( date ).format( CLEAN_DATE_FORMAT );
};


export const formatDate = ( date: Moment | Date | string | number ): string => {
	return moment( date )?.format( DATE_FORMAT );
};

export const formatDateShort = ( date: Moment | Date | string ): string => {

	return moment( date ).isValid() ? moment( date )?.format( DATE_FORMAT_SHORT ) : '';
};


export const getCurrent = (): string => {
	return formatDate( moment() );
};


export const getCurrentDate = (): Moment => {
	return moment();
};

export const momentToDate = ( date: Moment ): Date => {
	return new Date( date.year(), date.month(), date.date() );
};
