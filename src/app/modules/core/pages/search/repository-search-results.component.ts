import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {RepositorySearchService} from './repository-search.service';
import {CodeSnippet, SearchResponse, SearchResult} from './search-result-interfaces';

@Component({
    selector: 'app-repository-search-results',
    templateUrl: './repository-search-results.component.html',
    styleUrls: ['./repository-search-results.component.scss']
})
export class RepositorySearchResultsComponent implements OnInit {

    results$: BehaviorSubject<SearchResponse> = new BehaviorSubject(null);

    constructor(private route: ActivatedRoute,
                private router: Router,
                private searchService: RepositorySearchService
    ) {
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
        }
        else if (type === 'other-versions') {
            params.push('groupId:' + coordinates.groupId + ' artifactId:' + coordinates.artifactId);
        }
        else if (type === 'artifact') {
            params.push('artifactId:' + coordinates.artifactId);
        }
        else if (type === 'group') {
            params.push('groupId:' + coordinates.groupId);
        }
        else {
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
        this.route.paramMap.subscribe((params: ParamMap) => {
            const query = params.get('query');
            if (query) {
                this.searchService.find(query).subscribe((response: SearchResponse) => {
                    this.results$.next(response);
                });
            } else {
                this.results$.next(null);
            }
        });
    }
}
