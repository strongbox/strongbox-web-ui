import {CamelCaseToSpacePipe} from './camel-case-to-space.pipe';
import {inject, TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';

describe('CamelCaseToSpace', () => {
    let pipe: CamelCaseToSpacePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [CamelCaseToSpacePipe],
            providers: [CamelCaseToSpacePipe]
        });
    });

    beforeEach(inject([CamelCaseToSpacePipe], p => {
        pipe = p;
    }));

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('return raw code', () => {
        const code = 'camelCaseSpacer';
        const expected = 'camel Case Spacer';
        expect(pipe.transform(code)).toEqual(expected);
    });
});
