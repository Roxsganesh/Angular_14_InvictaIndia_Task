import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsModel } from '../products/products.modal';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiEndPointUrl = "http://localhost:3000/products";
  private baseUrl = 'https://fakestoreapi.com/';

  constructor(private http:HttpClient, private toastr: ToastrService) { }

  getAllProductsList() {
    return this.http.get<ProductsModel>(this.apiEndPointUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: any) {
    return this.http.get(this.apiEndPointUrl + '/' + id).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(productData: any) {
    return this.http.post<ProductsModel>(this.apiEndPointUrl, productData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: any, productData: any) {
    return this.http.put<ProductsModel>(this.apiEndPointUrl + '/' + id, productData).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: any) {
    return this.http.delete<ProductsModel>(this.apiEndPointUrl + '/' + id).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errMessage = ""
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      errMessage = error.error
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
        errMessage = `Backend returned code ${error.status}, body was: `, error.error
    }
    errMessage += ' Something bad happened; please try again later.'
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errMessage));
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/img`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/img`);
  }
}
