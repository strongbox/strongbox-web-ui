import {FormGroup} from '@angular/forms';

export class ServerSettings {
    instanceName = null;
    port = 48080;
    url = 'http://localhost:48080';
    cors: Array<string> = [];
}

export class ServerSettingsForm {
    private form: FormGroup;

    constructor(settings: ServerSettings = new ServerSettings()) {

    }

    getForm() {
        return this.form;
    }

}
