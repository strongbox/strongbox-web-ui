import {inject, TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';

import {CodeSnippetPipePipe} from './code-snippet.pipe';

describe('CodeSnippet', () => {
    let pipe: CodeSnippetPipePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [CodeSnippetPipePipe],
            providers: [CodeSnippetPipePipe]
        });
    });

    beforeEach(inject([CodeSnippetPipePipe], p => {
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
