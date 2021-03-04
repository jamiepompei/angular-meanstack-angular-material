import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from './student';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endpoint: string = 'http://localhost:8000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  //add student
  addStudent(data: Student): Observable<any>{
    let API_URL = `${this.endpoint}/add-student`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // get all students
  getAllStudents(){
    return this.http.get(`${this.endpoint}`);
  } 

  //get a student
  getStudentById(id: string): Observable<any>{
    let API_URL = `${this.endpoint}/read-student/${id}`;
    return this.http.get(API_URL, {headers: this.headers})
      .pipe(
        map((Response) =>{
          return Response || {}
        }),
        catchError(this.errorMgmt)
      )
  }

  //update student
  updateStudent(id: string, data: any): Observable<any> {
    let API_URL = `${this.endpoint}/update-student/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //delete student
  deleteStudent(id: string): Observable<any>{
    var API_URL = `${this.endpoint}/delete-student/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }


  //Error Handling
  errorMgmt(error: HttpErrorResponse){
    let errorMessage = '';
    if (error.error instanceof ErrorEvent){
      //get client side error
      errorMessage = error.error.message;
    } else {
      //get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
