import {inject, TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';

import {CodeSnippet} from './code-snippet.pipe';

describe('CodeSnippet', () => {
    let pipe: CodeSnippet;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [CodeSnippet],
            providers: [CodeSnippet]
        });
    });

    beforeEach(inject([CodeSnippet], p => {
        pipe = p;
    }));

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('return raw code', () => {
        const code = '<dependency><name>testing</name></dependency>';
        expect(pipe.transform(code)).toEqual(code);
    });
});
