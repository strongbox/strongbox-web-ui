export class SearchResponse {
    constructor(public artifact: SearchResult[]) {
    }
}

export class SearchResult {
    constructor(public artifactCoordinates: ArtifactCoordinates = null,
                public storageId: string = null,
                public repositoryId: string = null,
                public url: string = null,
                public snippets: CodeSnippet[] = null,
                public path: string = null) {
    }
}

export class ArtifactCoordinates {
    constructor(public groupId: string = null,
                public artifactId: string = null,
                public version: string = null,
                public classifier: string = null,
                public extension: string = null) {
    }
}

export class CodeSnippet {
    constructor(public name: string = null, public code: string = null) {
    }
}
