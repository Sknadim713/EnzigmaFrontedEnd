import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  constructor(private _http: HttpClient) { }
  private Base_Url = environment.apiUrl


  AddTask(data: any): Observable<any> {
    return this._http.post(`${this.Base_Url}/task/createTask`, data)
  }


  GetAllTask(): Observable<any> {
    return this._http.get(`${this.Base_Url}/task/getAll`)
  }


  GetById(id: any): Observable<any> {
    return this._http.get(`${this.Base_Url}/task/getById/${id}`)
  }


  GetUpdateTaskyId(id: any, data: any): Observable<any> {
    return this._http.put(`${this.Base_Url}/task/updateTask/${id}`, data)
  }


  DeleteTaskyId(id: any,): Observable<any> {
    return this._http.delete(`${this.Base_Url}/task/deleteById/${id}`)
  }
}
