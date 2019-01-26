import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {CodeSnippet, SearchResponse, SearchResult} from './search-result-interfaces';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-repository-search-results',
    templateUrl: './repository-search-results.component.html',
    styleUrls: ['./repository-search-results.component.scss']
})
export class RepositorySearchResultsComponent implements OnInit {

    results$: BehaviorSubject<SearchResponse> = new BehaviorSubject(null);

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    breadcrumbs: Breadcrumb[] = [];

    constructor(private route: ActivatedRoute) {
    }

    /**
     * @param {MouseEvent} $event
     */
    selectAll($event) {
        window.getSelection().selectAllChildren($event.target);
    }

    link(type = 'share', result: SearchResult): Array<string> | string {
        const coordinates = result.artifactCoordinates;

        let params = ['/search'];

        if (type === 'download') {
            return result.url;
        } else if (type === 'other-versions') {
            params.push('groupId:' + coordinates.groupId + ' artifactId:' + coordinates.artifactId);
        } else if (type === 'artifact') {
            params.push('artifactId:' + coordinates.artifactId);
        } else if (type === 'group') {
            params.push('groupId:' + coordinates.groupId);
        } else {
            params.push(
                'groupId:' + coordinates.groupId +
                ' artifactId:' + coordinates.artifactId +
                ' extension:' + coordinates.extension +
                ' version:' + coordinates.version
            );
        }

        return params;
    }

    findMavenSnippetIndex(result: SearchResult) {
        let returnIndex = null;

        result.snippets.forEach((codeSnippet: CodeSnippet, index) => {
            if (codeSnippet.name === 'Maven 2') {
                returnIndex = index;
            }
        });

        return returnIndex;
    }

    ngOnInit(): void {
        this.route.data.subscribe((data: any) => {
            const query = this.route.snapshot.paramMap.get('query');

            this.breadcrumbs = [
                {label: 'Search results', url: []},
                {label: query, url: [], active: true}
            ];

            this.results$.next(data.searchResponse);
            this.loading$.next(false);
        });
    }
}
