import { Pipe, PipeTransform } from "@angular/core";
import { Http } from '@angular/http';

@Pipe({
    name: 'userLevel'
})

export class userLevelPipe implements PipeTransform {

    constructor(private http: Http){}
    transform(role: number){
        return this.http.get('https://localhost:3000/users/role/'+role).map((data: any) => data.json()).subscribe((data) => {return data[0].NAME});
    }
}
