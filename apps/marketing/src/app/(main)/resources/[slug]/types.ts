import { RESOURCE_QUERYResult } from '@limelight/shared-sanity';

export type SocialNetwork = NonNullable<RESOURCE_QUERYResult>['socialNetwork'];

export type Author = NonNullable<RESOURCE_QUERYResult>['author'];

export type MainImage = NonNullable<RESOURCE_QUERYResult>['mainImage'];

export type ContentType = NonNullable<RESOURCE_QUERYResult>['content'];
