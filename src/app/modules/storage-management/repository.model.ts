import {Type} from 'class-transformer';
import {ProxyConfiguration} from './proxyConfiguration.model';

// Check org.carlspring.strongbox.storage.repository.RepositoryTypeEnum
// tslint:disable-next-line:max-line-length
// https://github.com/strongbox/strongbox/blob/master/strongbox-storage/strongbox-storage-core/src/main/java/org/carlspring/strongbox/storage/repository/RepositoryTypeEnum.java
export enum RepositoryTypeEnum {
    HOSTED = 'hosted',
    PROXY = 'proxy',
    GROUP = 'group',
    // VIRTUAL = 'virtual' // currently unsupported and unused.
}

// Check org.carlspring.strongbox.storage.repository.RepositoryStatusEnum
// tslint:disable-next-line:max-line-length
// https://github.com/strongbox/strongbox/blob/master/strongbox-storage/strongbox-storage-core/src/main/java/org/carlspring/strongbox/storage/repository/RepositoryStatusEnum.java
export enum RepositoryStatusEnum {
    IN_SERVICE = 'In Service',
    OUT_OF_SERVICE = 'Out of Service'
}

export enum RepositoryPolicyEnum {
    RELEASE = 'release',
    SNAPSHOT = 'snapshot',
    MIXED = 'mixed'
}

export enum RepositoryLayoutEnum {
    MAVEN2 = 'Maven 2',
    NUGET = 'NuGet',
    NPM = 'npm',
    RAW = 'Raw'
}

export class Repository {
    // this is used only internally to store the "owning" storage id - not actually received from the api.
    public storageId: string = null;
    public id: string = null;
    public basedir: string = null;
    public policy: RepositoryPolicyEnum = RepositoryPolicyEnum.RELEASE;
    public implementation = 'file-system';
    public layout = 'Maven 2'; // These are dynamic.
    public type: RepositoryTypeEnum = null;
    public secured = false;
    public status: RepositoryStatusEnum = RepositoryStatusEnum.IN_SERVICE;

    public artifactMaxSize = 0; // unlimited
    public trashEnabled = true;
    public allowsForceDeletion = false;
    public allowsDeployment = true;
    public allowsRedeployment = false;
    public allowsDelete = true;
    public allowsDirectoryBrowsing = false;
    public checksumHeadersEnabled = true;

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
