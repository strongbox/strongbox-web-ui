import {Type} from 'class-transformer';
import {ProxyConfiguration} from './proxyConfiguration.model';

export class Repository {
    // this is used only internally to store the "owning" storage id - not actually received from the api.
    public storageId: string;
    public id: string;
    public basedir: string;
    public policy: string;
    public implementation = 'file-system';
    public layout: string;
    public type: string;
    public secured = false;
    public status: string;

    public artifactMaxSize: number;
    public trashEnabled: boolean;
    public allowsForceDeletion: boolean;
    public allowsDeployment: boolean;
    public allowsRedeployment: boolean;
    public allowsDelete: boolean;
    public allowsDirectoryBrowsing: boolean;
    public checksumHeadersEnabled: boolean;

    @Type(() => ProxyConfiguration)
    public proxyConfiguration: ProxyConfiguration;

    @Type(() => RemoteRepositoryConfiguration)
    public remoteRepository: RemoteRepositoryConfiguration;

    @Type(() => HttpConnectionPoolConfiguration)
    public httpConnectionPool: HttpConnectionPoolConfiguration;

    @Type(() => CustomStorageConfiguration)
    public customConfigurations: CustomStorageConfiguration[];

    @Type(() => CustomRepositoryConfiguration)
    public repositoryConfiguration: CustomRepositoryConfiguration;

    public groupRepositories: string[];
}

export class RemoteRepositoryConfiguration {
    public downloadRemoteIndexes: boolean;
    public autoBlocking: boolean;
    public checksumValidation: boolean;
    public username: string;
    public password: string;
    public checksumPolicy: string;
    public checkIntervalSeconds: number;
    public allowsDirectoryBrowsing: boolean;
    public autoImportRemoteSSLCertificate: boolean;
    public customConfiguration: any = null; // what does this do exactly?
    public url: string;
}

export class HttpConnectionPoolConfiguration {
    public allocatedConnections: number;
}

export class CustomStorageConfiguration {
    [key: string]: any;
}

export class CustomRepositoryConfiguration {
    [key: string]: any;
}
