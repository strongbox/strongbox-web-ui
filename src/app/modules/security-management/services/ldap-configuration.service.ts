import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LdapConfigurationService {

    constructor(private http: HttpClient) {
    }

    getConfiguration(): Observable<any> {
        return this.http.get('/api/configuration/ldap');
    }

    saveConfiguration(config: any): Observable<any> {
        return this.http.put('/api/configuration/ldap', config);
    }

    testConfiguration(config: any, user: string, password: string): Observable<any> {
        return this.http.put('/api/configuration/ldap/test', {
            configuration: config,
            username: user,
            password: password
        });
    }
}
