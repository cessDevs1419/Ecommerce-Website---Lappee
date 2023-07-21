import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
	handleError(error: HttpErrorResponse, customErrorMessages?: any) {
		if (customErrorMessages) {
		    return customErrorMessages;
		}
	
		switch (error.status) {
			case 400:
				return {
				    errorMessage: 'Invalid input',
				    suberrorMessage: 'There is something wrong with your input',
				};
			case 401:
				return {
				    errorMessage: 'Unauthorized Access',
				    suberrorMessage: 'Please login with valid credentials.',
				};
			case 422:
				return {
				    errorMessage: 'Unprocessable Entity',
				    suberrorMessage: 'The data already exists.',
				};
			default:
				return {
				    errorMessage: 'Unexpected Error',
				    suberrorMessage: 'An unexpected error occurred.',
				};
		}
	}
}
