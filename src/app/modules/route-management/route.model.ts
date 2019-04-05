import { Repository } from '../storage-management/repository.model';
import { ApiResponse } from '../core/core.model';

export class Route {
    pattern: string;
    type: string;
    uuid: string;
    storageId: string;
    repositoryId: string;
    repository: Repository
}

export class RouteListResponse extends ApiResponse {
    routingRule: Route[];
}