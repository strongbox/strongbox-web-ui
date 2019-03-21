export enum ProxyConfigurationTypeEnum {
    HTTP = 'HTTP',
    SOCKS5 = 'SOCKS5'
}

export class ProxyConfiguration {
    public host: string;
    public port: number;
    public type: ProxyConfigurationTypeEnum = null;
    public username: string;
    public password: string;
    public nonProxyHosts: string[];

    hasData(): boolean {
        const properties = Object.getOwnPropertyNames(this).filter((v) => v !== 'nonProxyHosts');

        if (properties) {
            for (let i = 0; i < properties.length; i++) {
                const value = this[properties[i]];
                if (value !== '' && value !== null) {
                    return true;
                }
            }
        }

        return false;
    }
}
