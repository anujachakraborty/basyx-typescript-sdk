/* tslint:disable */
/* eslint-disable */
/**
 * DotAAS Part 2 | HTTP/REST | Concept Description Repository Service Specification
 * The ConceptDescription Repository Service Specification as part of [Specification of the Asset Administration Shell: Part 2](https://industrialdigitaltwin.org/en/content-hub/aasspecifications).   Copyright: Industrial Digital Twin Association (IDTA) March 2023
 *
 * The version of the OpenAPI document: V3.1.0_SSP-001
 * Contact: info@idtwin.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ConceptDescription,
  GetConceptDescriptionsResult,
  Result,
} from '../models/index';

export interface DeleteConceptDescriptionByIdRequest {
    cdIdentifier: string;
}

export interface GetAllConceptDescriptionsRequest {
    idShort?: string;
    isCaseOf?: string;
    dataSpecificationRef?: string;
    limit?: number;
    cursor?: string;
}

export interface GetConceptDescriptionByIdRequest {
    cdIdentifier: string;
}

export interface PostConceptDescriptionRequest {
    conceptDescription: ConceptDescription;
}

export interface PutConceptDescriptionByIdRequest {
    cdIdentifier: string;
    conceptDescription: ConceptDescription;
}

/**
 * 
 */
export class ConceptDescriptionRepositoryAPIApi extends runtime.BaseAPI {

    /**
     * Deletes a Concept Description
     */
    async deleteConceptDescriptionByIdRaw(requestParameters: DeleteConceptDescriptionByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['cdIdentifier'] == null) {
            throw new runtime.RequiredError(
                'cdIdentifier',
                'Required parameter "cdIdentifier" was null or undefined when calling deleteConceptDescriptionById().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/concept-descriptions/{cdIdentifier}`.replace(`{${"cdIdentifier"}}`, encodeURIComponent(String(requestParameters['cdIdentifier']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a Concept Description
     */
    async deleteConceptDescriptionById(requestParameters: DeleteConceptDescriptionByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteConceptDescriptionByIdRaw(requestParameters, initOverrides);
    }

    /**
     * Returns all Concept Descriptions
     */
    async getAllConceptDescriptionsRaw(requestParameters: GetAllConceptDescriptionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetConceptDescriptionsResult>> {
        const queryParameters: any = {};

        if (requestParameters['idShort'] != null) {
            queryParameters['idShort'] = requestParameters['idShort'];
        }

        if (requestParameters['isCaseOf'] != null) {
            queryParameters['isCaseOf'] = requestParameters['isCaseOf'];
        }

        if (requestParameters['dataSpecificationRef'] != null) {
            queryParameters['dataSpecificationRef'] = requestParameters['dataSpecificationRef'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/concept-descriptions`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Returns all Concept Descriptions
     */
    async getAllConceptDescriptions(requestParameters: GetAllConceptDescriptionsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetConceptDescriptionsResult> {
        const response = await this.getAllConceptDescriptionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Returns a specific Concept Description
     */
    async getConceptDescriptionByIdRaw(requestParameters: GetConceptDescriptionByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConceptDescription>> {
        if (requestParameters['cdIdentifier'] == null) {
            throw new runtime.RequiredError(
                'cdIdentifier',
                'Required parameter "cdIdentifier" was null or undefined when calling getConceptDescriptionById().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/concept-descriptions/{cdIdentifier}`.replace(`{${"cdIdentifier"}}`, encodeURIComponent(String(requestParameters['cdIdentifier']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Returns a specific Concept Description
     */
    async getConceptDescriptionById(requestParameters: GetConceptDescriptionByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConceptDescription> {
        const response = await this.getConceptDescriptionByIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a new Concept Description
     */
    async postConceptDescriptionRaw(requestParameters: PostConceptDescriptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConceptDescription>> {
        if (requestParameters['conceptDescription'] == null) {
            throw new runtime.RequiredError(
                'conceptDescription',
                'Required parameter "conceptDescription" was null or undefined when calling postConceptDescription().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/concept-descriptions`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['conceptDescription'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Creates a new Concept Description
     */
    async postConceptDescription(requestParameters: PostConceptDescriptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConceptDescription> {
        const response = await this.postConceptDescriptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates or updates an existing Concept Description
     */
    async putConceptDescriptionByIdRaw(requestParameters: PutConceptDescriptionByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConceptDescription>> {
        if (requestParameters['cdIdentifier'] == null) {
            throw new runtime.RequiredError(
                'cdIdentifier',
                'Required parameter "cdIdentifier" was null or undefined when calling putConceptDescriptionById().'
            );
        }

        if (requestParameters['conceptDescription'] == null) {
            throw new runtime.RequiredError(
                'conceptDescription',
                'Required parameter "conceptDescription" was null or undefined when calling putConceptDescriptionById().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/concept-descriptions/{cdIdentifier}`.replace(`{${"cdIdentifier"}}`, encodeURIComponent(String(requestParameters['cdIdentifier']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['conceptDescription'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response);
    }

    /**
     * Creates or updates an existing Concept Description
     */
    async putConceptDescriptionById(requestParameters: PutConceptDescriptionByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConceptDescription | null | undefined > {
        const response = await this.putConceptDescriptionByIdRaw(requestParameters, initOverrides);
        switch (response.raw.status) {
            case 201:
                return await response.value();
            case 204:
                return null;
            default:
                return await response.value();
        }
    }

}
