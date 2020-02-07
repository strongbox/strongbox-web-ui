import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LdapConfigurationService {

    constructor(private http: HttpClient) {
    }

    private static copyToAuthorities(config: any) {
        config['authorities'] = {
            groupSearchBase: config.groupSearchBase,
            groupSearchFilter: config.groupSearchFilter,
            groupRoleAttribute: config.groupRoleAttribute,
            searchSubtree: true,
            rolePrefix: '',
            convertToUpperCase: false
        };
        return config;
    }

    getConfiguration(): Observable<any> {
        return this.http.get('/api/configuration/ldap');
    }

    saveConfiguration(config: any): Observable<any> {
        return this.http.put('/api/configuration/ldap', LdapConfigurationService.copyToAuthorities(config));
    }

    testConfiguration(config: any, user: string, password: string): Observable<any> {
        return this.http.put('/api/configuration/ldap/test', {
            configuration: LdapConfigurationService.copyToAuthorities(config),
            username: user,
            password: password
        });
    }
}
