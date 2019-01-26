import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Navigate} from '@ngxs/router-plugin';
import {BehaviorSubject} from 'rxjs';
import {plainToClass} from 'class-transformer';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {StorageManagerService} from '../../services/storage-manager.service';
import {
    RemoteRepositoryChecksumPolicyEnum,
    RemoteRepositoryConfiguration,
    Repository,
    RepositoryLayoutEnum,
    RepositoryPolicyEnum,
    RepositoryStatusEnum,
    RepositoryTypeEnum
} from '../../repository.model';
import {ApiResponse, handleFormError} from '../../../core/core.model';
import {ProxyConfiguration, ProxyConfigurationTypeEnum} from '../../proxyConfiguration.model';
import {StorageEntity} from '../../storage.model';

@Component({
    selector: 'app-storage-manage',
    templateUrl: './manage-repository.component.html',
    styleUrls: ['./manage-repository.component.scss']
})
export class ManageRepositoryComponent implements OnInit {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    breadcrumbs: Breadcrumb[] = [];

    storageId$: BehaviorSubject<string> = new BehaviorSubject(null);
    type$: BehaviorSubject<RepositoryTypeEnum> = new BehaviorSubject(null);
    repository$: BehaviorSubject<Repository> = new BehaviorSubject(new Repository());

    activeGroupRepositories: string[] = [];
    availableGroupRepositories: string[] = [];

    form: FormGroup;

    constructor(private notify: ToastrService,
                private route: ActivatedRoute,
                private router: Router,
                private store: Store,
                private service: StorageManagerService) {
    }

    generateCommonFormFields(type: RepositoryTypeEnum, repo: Repository) {
        let fields = {
            type: new FormControl(type, [Validators.required]),
            id: new FormControl(repo.id),
            basedir: new FormControl(repo.basedir),
            policy: new FormControl(repo.policy, [Validators.required]),
            status: new FormControl(repo.status, [Validators.required]),
            secured: new FormControl(repo.secured),
            layout: new FormControl(repo.layout, [Validators.required]),
            implementation: new FormControl({value: repo.implementation, disabled: true}, [Validators.required]),
            artifactMaxSize: new FormControl(repo.artifactMaxSize),
            trashEnabled: new FormControl(repo.trashEnabled),
            allowsForceDeletion: new FormControl(repo.allowsForceDeletion),
            allowsDeployment: new FormControl(repo.allowsDeployment),
            allowsRedeployment: new FormControl(repo.allowsRedeployment),
            allowsDelete: new FormControl(repo.allowsDelete),
            allowsDirectoryBrowsing: new FormControl(repo.allowsDirectoryBrowsing),
            checksumHeadersEnabled: new FormControl(repo.checksumHeadersEnabled),
            proxyConfiguration: new FormControl(null),
            remoteRepository: new FormControl(null),
            httpConnectionPool: new FormControl(null),
            repositoryConfiguration: new FormControl(null),
            groupRepositories: new FormControl(null),
            artifactCoordinateValidators: new FormControl(null),
        };

        if (repo.id !== null) {
            fields.id.disable();
            fields.layout.disable();
        } else {
            fields.id.setValidators([Validators.required]);
        }

        return fields;
    }

    isHostedRepository() {
        return this.type$.getValue() === RepositoryTypeEnum.HOSTED;
    }

    isGroupRepository() {
        return this.type$.getValue() === RepositoryTypeEnum.GROUP;
    }

    isProxyRepository() {
        return this.type$.getValue() === RepositoryTypeEnum.PROXY;
    }

    getPolicies() {
        return Object.values(RepositoryPolicyEnum);
    }

    getChecksumPolicies() {
        return Object.values(RemoteRepositoryChecksumPolicyEnum);
    }

    getRepositoryStatuses() {
        return Object.values(RepositoryStatusEnum);
    }

    getLayouts() {
        return Object.values(RepositoryLayoutEnum);
    }

    getProxyConfigurationTypes() {
        return Object.values(ProxyConfigurationTypeEnum);
    }

    getUrlForStorageBrowsing() {
        return ['/admin/storages/', this.storageId$.getValue()];
    }

    generateForm(type: RepositoryTypeEnum, repository: Repository = null): FormGroup {
        let form;

        if (repository === null) {
            repository = new Repository(type);
        }

        if (type === RepositoryTypeEnum.HOSTED || type === RepositoryTypeEnum.GROUP) {
            form = new FormGroup({
                ...this.generateCommonFormFields(type, repository)
            });
        } else if (type === RepositoryTypeEnum.PROXY) {
            form = new FormGroup({
                ...this.generateCommonFormFields(type, repository),
                ...this.generateProxyFormFields(repository)
            });
        } else {
            throw Error('Failed to generate form, because "' + type + '" is unknown repository type.');
        }

        return form;
    }

    generateProxyFormFields(repository: Repository) {
        if (repository.remoteRepository === null) {
            repository.remoteRepository = new RemoteRepositoryConfiguration();
        }

        if (repository.proxyConfiguration === null) {
            repository.proxyConfiguration = new ProxyConfiguration();
        }

        return {
            remoteRepository: new FormGroup({
                url: new FormControl(repository.remoteRepository.url, [Validators.required]),
                username: new FormControl(repository.remoteRepository.username),
                password: new FormControl(null),
                allowsDirectoryBrowsing: new FormControl(repository.remoteRepository.allowsDirectoryBrowsing),
                autoImportRemoteSSLCertificate: new FormControl(repository.remoteRepository.autoImportRemoteSSLCertificate),
                autoBlocking: new FormControl(repository.remoteRepository.autoBlocking),
                checkIntervalSeconds: new FormControl(repository.remoteRepository.checkIntervalSeconds),
                checksumPolicy: new FormControl(repository.remoteRepository.checksumPolicy),
                checksumValidation: new FormControl(repository.remoteRepository.checksumValidation),
                // TODO: Figure out customConfiguration part.
                // customConfiguration: new FormControl(repository.remoteRepository.customConfiguration),
                downloadRemoteIndexes: new FormControl(repository.remoteRepository.downloadRemoteIndexes)
            }),
            proxyConfiguration: new FormGroup({
                host: new FormControl(repository.proxyConfiguration.host),
                port: new FormControl(repository.proxyConfiguration.port),
                type: new FormControl(repository.proxyConfiguration.type),
                username: new FormControl(repository.proxyConfiguration.username),
                password: new FormControl(repository.proxyConfiguration.password),
                nonProxyHosts: new FormControl([]),
            })
        };
    }

    submit() {
        if (this.form.valid) {
            this.loading$.next(true);

            const repository: Repository = plainToClass(Repository, this.form.getRawValue()) as any;

            if (this.isGroupRepository()) {
                repository.groupRepositories = this.activeGroupRepositories;
            }

            this.service
                .saveRepository(this.storageId$.getValue(), repository)
                .pipe(catchError(err => handleFormError(err, this.form)))
                .subscribe((response: ApiResponse) => {
                    if (response.isValid()) {
                        this.notify.success(response.message);
                        this.store.dispatch(new Navigate(this.getUrlForStorageBrowsing()));
                    } else {
                        this.notify.error(response.message);
                        this.loading$.next(false);
                    }
                });
        }
    }

    /* start d'n'd group repositories */
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    /* end d'n'd group repositories */

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const storageId = params.get('storageId');
            const repositoryType = params.get('type');
            const repositoryId = params.get('repositoryId');

            if ((repositoryType === null && repositoryId === null) || (repositoryType && !this.isValidRepositoryType(repositoryType))) {
                this.store.dispatch(new Navigate(['/admin/storages']));
            }

            this.storageId$.next(storageId);

            this.breadcrumbs = [{label: 'Storages', url: ['/admin/storages']}];
            this.breadcrumbs.push({label: storageId, url: ['/admin/storages/', storageId]});

            if (repositoryId) {
                // Get repository (update)
                this.breadcrumbs.push({label: repositoryId, url: ['/admin/storages', storageId, repositoryId], active: true});
                this.service
                    .getRepository(storageId, repositoryId)
                    .subscribe((repository: Repository) => {
                        this.type$.next(this.getRepositoryEnumType(repository));
                        this.repository$.next(repository);

                        if (this.isGroupRepository()) {
                            this.activeGroupRepositories = repository.groupRepositories;

                            this.service
                                .getStorage(storageId)
                                .subscribe((storage: StorageEntity) => {
                                    this.availableGroupRepositories = storage.repositories
                                        .map(r => r.id)
                                        .filter((id) => {
                                            return id !== repository.id && repository.groupRepositories.indexOf(id) === -1;
                                        })
                                        .sort((a, b) => a.localeCompare(b));

                                    this.form = this.generateForm(this.getRepositoryEnumType(repository.type), repository);
                                    this.loading$.next(false);
                                });
                        } else {
                            this.form = this.generateForm(this.getRepositoryEnumType(repository.type), repository);
                            this.loading$.next(false);
                        }
                    });
            } else {
                // Create a new repository
                const repositoryTypeEnum = this.getRepositoryEnumType(repositoryType);
                this.type$.next(this.getRepositoryEnumType(repositoryType));
                this.breadcrumbs.push({label: 'New ' + repositoryType + ' repository', url: [], active: true});
                this.form = this.generateForm(repositoryTypeEnum);

                if (this.isGroupRepository()) {
                    this.service
                        .getStorage(storageId)
                        .subscribe((storage: StorageEntity) => {
                            this.availableGroupRepositories = storage.repositories.map(r => r.id);
                            this.loading$.next(false);
                        });
                } else {
                    this.loading$.next(false);
                }
            }
        });
    }

    getRepositoryEnumType(repository: Repository | string): RepositoryTypeEnum {
        if (repository instanceof Repository) {
            return RepositoryTypeEnum[repository.type.toLocaleUpperCase()];
        } else if (typeof repository === 'string') {
            return RepositoryTypeEnum[repository.toLocaleUpperCase()];
        } else {
            return null;
        }
    }

    isValidRepositoryType(repositoryType) {
        return repositoryType !== null
            && Object.values(RepositoryTypeEnum).map(v => v.toLocaleUpperCase()).includes(repositoryType.toLocaleUpperCase());
    }

}
