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
}
