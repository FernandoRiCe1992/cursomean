import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { GLOBAL } from "./global";
import { Artist } from "../models/artist";

@Injectable()
export class UploadService{
  public url: string;

  constructor(private _http: HttpClient){
    this.url = GLOBAL.url;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){
    return new Promise(function(resolve, reject){
      let formData:any = new FormData();
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);

      for(let i = 0; i < files.length; i++){
        formData.append(name, files[i], files[i].name);
      }


      xhr.send(formData);

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          };
        };
      };

    });
  }

}
