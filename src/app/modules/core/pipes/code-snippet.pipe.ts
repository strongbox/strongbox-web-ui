import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'codeSnippet',
    pure: false
})
export class CodeSnippet implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value) {
        return this.sanitizer.sanitize(SecurityContext.NONE, value);
    }

}
