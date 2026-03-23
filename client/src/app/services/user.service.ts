import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { GLOBAL } from "./global";

@Injectable()
export class UserService{
  public identity:any;
  public token:any;
  public url: string;

  constructor(private _http: HttpClient){
    this.url = GLOBAL.url;
    this.token="";
  }

  singup(user_to_login: any , gethash: boolean | null):Observable<any>{
    if(gethash != null){
      user_to_login.gethash = gethash;
    }

    let json = JSON.stringify(user_to_login);
    let params = json;

    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.post(this.url+'login', params, {headers: headers});
    // .pipe(map((res:any) => {return res.data}));
  }

  register(user_to_register: any):Observable<any>{
    let json = JSON.stringify(user_to_register);
    let params = json;

    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.post(this.url+'register', params, {headers: headers});
    // .pipe(map((res:any) => {return res.data}));
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity')!);

    if(identity != "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;
    }

    return this.identity
  }

  getToken(){
    let token = localStorage.getItem('token');

    if(token != "undefined"){
      this.token = token;
    }else{
      this.token = null;
    }
  }
}