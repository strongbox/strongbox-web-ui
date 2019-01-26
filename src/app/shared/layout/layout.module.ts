import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../material.module';
import {CodeSnippetPipePipe} from './pipes/code-snippet.pipe';
import {CamelCaseToSpacePipe} from './pipes/camel-case-to-space.pipe';
import {PageContainerComponent} from './components/page-container/page-container.component';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {DirectoryListingComponent} from './components/directory-listing/directory-listing.component';
import {DirectoryListingService} from './services/directory-listing.service';
import {FilesizePipe} from './pipes/filesize.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    exports: [
        CodeSnippetPipePipe,
        CamelCaseToSpacePipe,
        FilesizePipe,
        PageContainerComponent,
        BreadcrumbComponent,
        DirectoryListingComponent
    ],
    declarations: [
        CodeSnippetPipePipe,
        CamelCaseToSpacePipe,
        FilesizePipe,
        PageContainerComponent,
        BreadcrumbComponent,
        DirectoryListingComponent
    ],
    providers: [
        DirectoryListingService
    ]
})
export class LayoutModule {
}
