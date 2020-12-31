import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {Actions, Store} from '@ngxs/store';
import {catchError} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';
import {ServerSettingsService} from '../../services/server-settings.service';
import {ApiResponse, handleFormError} from '../../../core/core.model';
import {FormDataService} from '../../../../shared/form/services/form-data.service';

@Component({
    selector: 'app-manage-settings',
    templateUrl: './manage-settings.component.html',
    styleUrls: ['./manage-settings.component.scss']
})
export class ManageSettingsComponent implements OnInit, OnDestroy {

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    settingsForm: FormGroup;
    availableDigestAlgorithmSet = this.formDataService.getAvailableDigestAlgorithmSet();

    breadcrumbs: Breadcrumb[] = [
        {label: 'Global settings', url: ['/admin/server-settings']}
    ];

    private destroy = new Subject();

    constructor(private actions: Actions,
                private cdr: ChangeDetectorRef,
                private service: ServerSettingsService,
                private store: Store,
                private notify: ToastrService,
                private formDataService: FormDataService) {
    }

    ngOnInit() {
        this.settingsForm = new FormGroup({
            instanceName: new FormControl(this.randomName(), [Validators.required, Validators.minLength(3)]),
            baseUrl: new FormControl(this.guessUrl(), [Validators.required]),
            port: new FormControl(48080, [
                Validators.required,
                (control: FormControl) => {
                    const message = {
                        invalidPort: 'Please enter a port between 1-65535'
                    };

                    if (!isNaN(control.value) && (control.value < 1 || control.value > 65535)) {
                        return message;
                    }

                    if (isNaN(control.value)) {
                        return message;
                    }

                    return null;
                }
            ]),
            digestAlgorithmSet: new FormControl(),
            corsConfigurationForm: new FormGroup({
                allowedOrigins: new FormControl(),
                corsAllowAll: new FormControl(),
            }),
            smtpConfigurationForm: new FormGroup({
                host: new FormControl(),
                port: new FormControl(),
                connection: new FormControl(),
                username: new FormControl(),
                password: new FormControl()
            }),
            proxyConfigurationForm: new FormGroup({
                host: new FormControl(),
                port: new FormControl(),
                type: new FormControl(),
                username: new FormControl(),
                password: new FormControl(),
                nonProxyHosts: new FormControl()
            })
        });

        let valueBeforeDisable = '';
        this.getCorsConfigurationGroup('corsAllowAll').valueChanges.subscribe(value => {
            const allowedOrigins = this.getCorsConfigurationGroup('allowedOrigins');
            if (value === true) {
                allowedOrigins.disable();
                valueBeforeDisable = allowedOrigins.value;
                allowedOrigins.setValue('*');
            } else {
                allowedOrigins.setValue(valueBeforeDisable);
                allowedOrigins.enable();
            }
        });

        this.getSmtpConfigurationGroup('connection').valueChanges.subscribe(value => {
            const port = this.getSmtpConfigurationGroup('port');
            if (value === null || value === '' || value === undefined) {
                port.setValue(null);
            } else if (value === 'plain') {
                port.setValue(25);
            } else if (value === 'ssl') {
                port.setValue(465);
            } else {
                port.setValue(587);
            }
        });

        this.loading$.next(true);

        this.service
            .getSettings()
            .pipe(
                catchError(error => {
                    this.notify.error('Could not retrieve server settings from api!');
                    console.log(error);
                    return of(null);
                }),
            )
            .subscribe((settings: any) => {
                if (settings !== null) {
                    settings['corsConfigurationForm']['allowedOrigins'] = settings['corsConfigurationForm']['allowedOrigins'].join('\n');
                    this.settingsForm.patchValue(settings);
                    this.loading$.next(false);
                }
            });
    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    getCorsConfigurationGroup(field = null) {
        const group = this.settingsForm.get('corsConfigurationForm');
        return field === null ? group : group.get(field);
    }

    getSmtpConfigurationGroup(field = null) {
        const group = this.settingsForm.get('smtpConfigurationForm');
        return field === null ? group : group.get(field);
    }

    getProxyConfigurationGroup(field = null) {
        const group = this.settingsForm.get('proxyConfigurationForm');
        return field === null ? group : group.get(field);
    }

    basicSettingsInvalid() {
        return this.settingsForm.get('instanceName').invalid ||
            this.settingsForm.get('baseUrl').invalid ||
            this.settingsForm.get('port').invalid;
    }

    randomName() {
        return 'Strongbox-' + Math.random().toString(36).substring(5);
    }

    guessUrl() {
        return document.location.href.split('/').filter((v, i) => i < 3).join('/');
    }

    applyGuessedUrl() {
        this.settingsForm.get('baseUrl').setValue(this.guessUrl());
    }

    save() {
        if (this.settingsForm.valid) {
            this.loading$.next(true);
            let data: any = this.settingsForm.getRawValue();
            let allowedOrigins = data['corsConfigurationForm']['allowedOrigins'];

            if (allowedOrigins !== null) {
                data['corsConfigurationForm']['allowedOrigins'] = data['corsConfigurationForm']['allowedOrigins'].split(/\r?\n/);
            }

            this.service
                .saveSettings(data)
                .pipe(catchError(err => handleFormError(err, this.settingsForm, this.loading$)))
                .subscribe((response: ApiResponse) => {
                    this.loading$.next(false);
                    if (response.isValid()) {
                        this.notify.success(response.message);
                    } else {
                        this.notify.error(response.message);
                    }
                });
        }
    }

}
