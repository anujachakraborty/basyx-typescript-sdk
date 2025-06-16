// Import necessary types
//import { AssetKind } from '@aas-core-works/aas-core3.0-typescript/types';
import { AasRegistryClient } from '../../clients/AasRegistryClient';
import { AasRegistryService } from '../../generated';
import { base64Encode } from '../../lib/base64Url';
import {
    convertApiAasDescriptorToCoreAasDescriptor,
    //convertApiSubmodelDescriptorToCoreSubmodelDescriptor,
    convertCoreAasDescriptorToApiAasDescriptor,
} from '../../lib/convertAasDescriptorTypes';
import { handleApiError } from '../../lib/errorHandler';
import {
    AssetAdministrationShellDescriptor as CoreAssetAdministrationShellDescriptor,
    //SubmodelDescriptor as CoreSubmodelDescriptor,
} from '../../models/Descriptors';

// Mock the dependencies
jest.mock('../../generated');
jest.mock('../../lib/convertAasDescriptorTypes');
jest.mock('../../lib/base64Url');
jest.mock('../../lib/errorHandler');
// Define mock constants
//const ID_SHORT = 'shellDescriptorIdShort';
const LIMIT = 10;
const CURSOR = 'cursor123';
const ASSET_TYPE = 'https://example.com/asset-types/sample';
const ASSET_KIND = AasRegistryService.AssetKind.Instance;
const API_AAS_DESCRIPTOR1: AasRegistryService.AssetAdministrationShellDescriptor = {
    id: 'https://example.com/ids/aas-desc/1234',
    //assetInformation: { assetKind: 'Instance' },
};
const API_AAS_DESCRIPTOR2: AasRegistryService.AssetAdministrationShellDescriptor = {
    id: 'https://example.com/ids/aas-desc/5678',
    //assetInformation: { assetKind: 'Instance' },
};
const CORE_AAS_DESCRIPTOR1: CoreAssetAdministrationShellDescriptor = new CoreAssetAdministrationShellDescriptor(
    'https://example.com/ids/aas-desc/1234'
    // new CoreAssetInformation(AssetKind.Instance)
);
const CORE_AAS_DESCRIPTOR2: CoreAssetAdministrationShellDescriptor = new CoreAssetAdministrationShellDescriptor(
    'https://example.com/ids/aas-desc/5678'
    //new CoreAssetInformation(AssetKind.Instance)
);
// const API_ASSET_INFO: AasRepositoryService.AssetInformation = {
//     assetKind: 'Instance',
// };
// const CORE_ASSET_INFO: CoreAssetInformation = new CoreAssetInformation(AssetKind.Instance);

const TEST_CONFIGURATION = new AasRegistryService.Configuration({
    basePath: 'http://localhost:8084',
    fetchApi: globalThis.fetch,
});

describe('AasRegistryClient', () => {
    // Create mock for AssetAdministrationShellRegistryAPIApi
    const mockApiInstance = {
        getAllAssetAdministrationShellDescriptors: jest.fn(),
        postAssetAdministrationShellDescriptor: jest.fn(),
        deleteAssetAdministrationShellDescriptorById: jest.fn(),
        getAssetAdministrationShellDescriptorById: jest.fn(),
        putAssetAdministrationShellDescriptorById: jest.fn(),
    };

    // Mock constructor
    const MockAasRegistry = jest.fn(() => mockApiInstance);

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup mock for base64Encode
        (base64Encode as jest.Mock).mockImplementation((input) => `encoded_${input}`);
        // Setup mock for constructor
        (
            jest.requireMock('../../generated').AasRegistryService.AssetAdministrationShellRegistryAPIApi as jest.Mock
        ).mockImplementation(MockAasRegistry);
        // Setup mocks for conversion functions
        (convertApiAasDescriptorToCoreAasDescriptor as jest.Mock).mockImplementation((aasDescriptor) => {
            if (aasDescriptor.id === API_AAS_DESCRIPTOR1.id) return CORE_AAS_DESCRIPTOR1;
            if (aasDescriptor.id === API_AAS_DESCRIPTOR2.id) return CORE_AAS_DESCRIPTOR2;
            return null;
        });
        (convertCoreAasDescriptorToApiAasDescriptor as jest.Mock).mockImplementation((aasDescriptor) => {
            if (aasDescriptor.id === CORE_AAS_DESCRIPTOR1.id) return API_AAS_DESCRIPTOR1;
            if (aasDescriptor.id === CORE_AAS_DESCRIPTOR2.id) return API_AAS_DESCRIPTOR2;
            return null;
        });

        // Mock the error handler to return a standardized Result
        (handleApiError as jest.Mock).mockImplementation(async (err) => {
            // If the error already has messages, return it as is
            if (err?.messages) return err;

            // Create a standard Result with messages
            const timestamp = (1744752054.63186).toString();
            const message: AasRegistryService.Message = {
                code: '400',
                messageType: 'Exception',
                text: err.message || 'Error occurred',
                timestamp: timestamp,
            };

            return { messages: [message] };
        });
    });

    // Mock console.error to prevent logging during tests
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    it('should return Asset Administration Shell Descriptors on successful response', async () => {
        // Arrange
        const pagedResult: AasRegistryService.PagedResultPagingMetadata = {
            cursor: CURSOR,
        };
        mockApiInstance.getAllAssetAdministrationShellDescriptors.mockResolvedValue({
            pagingMetadata: pagedResult,
            result: [API_AAS_DESCRIPTOR1, API_AAS_DESCRIPTOR2],
        });

        const client = new AasRegistryClient();

        // Act
        const response = await client.getAllAssetAdministrationShellDescriptors({
            configuration: TEST_CONFIGURATION,
            limit: LIMIT,
            cursor: CURSOR,
            assetKind: ASSET_KIND,
            assetType: ASSET_TYPE,
        });

        // Assert
        expect(MockAasRegistry).toHaveBeenCalledWith(TEST_CONFIGURATION);
        expect(mockApiInstance.getAllAssetAdministrationShellDescriptors).toHaveBeenCalledWith({
            limit: LIMIT,
            cursor: CURSOR,
            assetKind: ASSET_KIND,
            assetType: `encoded_${ASSET_TYPE}`,
        });
        expect(convertApiAasDescriptorToCoreAasDescriptor).toHaveBeenCalledTimes(2);
        expect(response.success).toBe(true);

        if (response.success) {
            expect(response.data.pagedResult).toBe(pagedResult);
            expect(response.data.result).toEqual([CORE_AAS_DESCRIPTOR1, CORE_AAS_DESCRIPTOR2]);
        }
    });

    it('should handle errors when fetching Asset Administration Shell Descriptors', async () => {
        // Arrange
        const errorResult: AasRegistryService.Result = {
            messages: [
                {
                    code: '400',
                    messageType: 'Exception',
                    text: 'Required parameter missing',
                    timestamp: '1744752054.63186',
                },
            ],
        };
        mockApiInstance.getAllAssetAdministrationShellDescriptors.mockRejectedValue(
            new Error('Required parameter missing')
        );
        (handleApiError as jest.Mock).mockResolvedValue(errorResult);

        const client = new AasRegistryClient();

        // Act
        const response = await client.getAllAssetAdministrationShellDescriptors({
            configuration: TEST_CONFIGURATION,
        });

        // Assert
        expect(response.success).toBe(false);
        if (!response.success) {
            expect(response.error).toEqual(errorResult);
        }
    });

    it('should create a new Asset Administration Shell Descriptor', async () => {
        // Arrange
        mockApiInstance.postAssetAdministrationShellDescriptor.mockResolvedValue(API_AAS_DESCRIPTOR1);

        const client = new AasRegistryClient();

        // Act
        const response = await client.postAssetAdministrationShellDescriptor({
            configuration: TEST_CONFIGURATION,
            assetAdministrationShellDescriptor: CORE_AAS_DESCRIPTOR1,
        });

        // Assert
        expect(MockAasRegistry).toHaveBeenCalledWith(TEST_CONFIGURATION);
        expect(mockApiInstance.postAssetAdministrationShellDescriptor).toHaveBeenCalledWith({
            assetAdministrationShellDescriptor: API_AAS_DESCRIPTOR1,
        });
        expect(convertCoreAasDescriptorToApiAasDescriptor).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1);
        expect(convertApiAasDescriptorToCoreAasDescriptor).toHaveBeenCalledWith(API_AAS_DESCRIPTOR1);
        expect(response.success).toBe(true);
        if (response.success) {
            expect(response.data).toEqual(CORE_AAS_DESCRIPTOR1);
        }
    });

    it('should handle errors when creating an Asset Administration Shell Descriptor', async () => {
        // Arrange
        const errorResult: AasRegistryService.Result = {
            messages: [
                {
                    code: '400',
                    messageType: 'Exception',
                    text: 'Required parameter missing',
                    timestamp: '1744752054.63186',
                },
            ],
        };
        mockApiInstance.postAssetAdministrationShellDescriptor.mockRejectedValue(
            new Error('Required parameter missing')
        );
        (handleApiError as jest.Mock).mockResolvedValue(errorResult);

        const client = new AasRegistryClient();

        // Act
        const response = await client.postAssetAdministrationShellDescriptor({
            configuration: TEST_CONFIGURATION,
            assetAdministrationShellDescriptor: CORE_AAS_DESCRIPTOR1,
        });

        // Assert
        expect(response.success).toBe(false);
        if (!response.success) {
            expect(response.error).toEqual(errorResult);
        }
    });

    it('should delete an Asset Administration Shell Descriptor', async () => {
        // Arrange
        mockApiInstance.deleteAssetAdministrationShellDescriptorById.mockResolvedValue(undefined);

        const client = new AasRegistryClient();

        // Act
        const response = await client.deleteAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
        });

        // Assert
        expect(MockAasRegistry).toHaveBeenCalledWith(TEST_CONFIGURATION);
        expect(base64Encode).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1.id);
        expect(mockApiInstance.deleteAssetAdministrationShellDescriptorById).toHaveBeenCalledWith({
            aasIdentifier: `encoded_${CORE_AAS_DESCRIPTOR1.id}`,
        });
        expect(response.success).toBe(true);
    });

    it('should handle errors when deleting an Asset Administration Shell Descrriptor', async () => {
        // Arrange
        const errorResult: AasRegistryService.Result = {
            messages: [
                {
                    code: '400',
                    messageType: 'Exception',
                    text: 'Required parameter missing',
                    timestamp: '1744752054.63186',
                },
            ],
        };
        mockApiInstance.deleteAssetAdministrationShellDescriptorById.mockRejectedValue(
            new Error('Required parameter missing')
        );
        (handleApiError as jest.Mock).mockResolvedValue(errorResult);

        const client = new AasRegistryClient();

        // Act
        const response = await client.deleteAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
        });

        // Assert
        expect(response.success).toBe(false);
        if (!response.success) {
            expect(response.error).toEqual(errorResult);
        }
    });

    it('should get an Asset Administration Shell Descriptor by ID', async () => {
        // Arrange
        mockApiInstance.getAssetAdministrationShellDescriptorById.mockResolvedValue(API_AAS_DESCRIPTOR1);

        const client = new AasRegistryClient();

        // Act
        const response = await client.getAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
        });

        // Assert
        expect(MockAasRegistry).toHaveBeenCalledWith(TEST_CONFIGURATION);
        expect(base64Encode).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1.id);
        expect(mockApiInstance.getAssetAdministrationShellDescriptorById).toHaveBeenCalledWith({
            aasIdentifier: `encoded_${CORE_AAS_DESCRIPTOR1.id}`,
        });
        expect(convertApiAasDescriptorToCoreAasDescriptor).toHaveBeenCalledWith(API_AAS_DESCRIPTOR1);
        expect(response.success).toBe(true);
        if (response.success) {
            expect(response.data).toEqual(CORE_AAS_DESCRIPTOR1);
        }
    });

    it('should handle errors when getting an Asset Administration Shell Descriptor by ID', async () => {
        // Arrange
        const errorResult: AasRegistryService.Result = {
            messages: [
                {
                    code: '400',
                    messageType: 'Exception',
                    text: 'Required parameter missing',
                    timestamp: '1744752054.63186',
                },
            ],
        };
        mockApiInstance.getAssetAdministrationShellDescriptorById.mockRejectedValue(
            new Error('Required parameter missing')
        );
        (handleApiError as jest.Mock).mockResolvedValue(errorResult);

        const client = new AasRegistryClient();

        // Act
        const response = await client.getAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
        });

        // Assert
        expect(response.success).toBe(false);
        if (!response.success) {
            expect(response.error).toEqual(errorResult);
        }
    });

    it('should update an Asset Administration Shell Descriptor', async () => {
        // Arrange
        mockApiInstance.putAssetAdministrationShellDescriptorById.mockResolvedValue(undefined);

        const client = new AasRegistryClient();

        // Act
        const response = await client.putAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
            assetAdministrationShellDescriptor: CORE_AAS_DESCRIPTOR1,
        });

        // Assert
        expect(MockAasRegistry).toHaveBeenCalledWith(TEST_CONFIGURATION);
        expect(base64Encode).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1.id);
        expect(mockApiInstance.putAssetAdministrationShellDescriptorById).toHaveBeenCalledWith({
            aasIdentifier: `encoded_${CORE_AAS_DESCRIPTOR1.id}`,
            assetAdministrationShellDescriptor: API_AAS_DESCRIPTOR1,
        });
        expect(convertCoreAasDescriptorToApiAasDescriptor).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1);
        expect(response.success).toBe(true);
    });

    it('should create a new Asset Administration Shell Descriptor', async () => {
        // Arrange
        mockApiInstance.putAssetAdministrationShellDescriptorById.mockResolvedValue(API_AAS_DESCRIPTOR1);

        const client = new AasRegistryClient();

        // Act
        const response = await client.putAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
            assetAdministrationShellDescriptor: CORE_AAS_DESCRIPTOR1,
        });

        // Assert
        expect(MockAasRegistry).toHaveBeenCalledWith(TEST_CONFIGURATION);
        expect(base64Encode).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1.id);
        expect(mockApiInstance.putAssetAdministrationShellDescriptorById).toHaveBeenCalledWith({
            aasIdentifier: `encoded_${CORE_AAS_DESCRIPTOR1.id}`,
            assetAdministrationShellDescriptor: API_AAS_DESCRIPTOR1,
        });
        expect(convertCoreAasDescriptorToApiAasDescriptor).toHaveBeenCalledWith(CORE_AAS_DESCRIPTOR1);
        expect(convertApiAasDescriptorToCoreAasDescriptor).toHaveBeenCalledWith(API_AAS_DESCRIPTOR1);
        expect(response.success).toBe(true);
        if (response.success) {
            expect(response.data).toEqual(CORE_AAS_DESCRIPTOR1); // After conversion
        }
    });
    it('should handle errors when updating an Asset Administration Shell Descriptor', async () => {
        // Arrange
        const errorResult: AasRegistryService.Result = {
            messages: [
                {
                    code: '400',
                    messageType: 'Exception',
                    text: 'Required parameter missing',
                    timestamp: '1744752054.63186',
                },
            ],
        };
        mockApiInstance.putAssetAdministrationShellDescriptorById.mockRejectedValue(
            new Error('Required parameter missing')
        );
        (handleApiError as jest.Mock).mockResolvedValue(errorResult);

        const client = new AasRegistryClient();

        // Act
        const response = await client.putAssetAdministrationShellDescriptorById({
            configuration: TEST_CONFIGURATION,
            aasIdentifier: CORE_AAS_DESCRIPTOR1.id,
            assetAdministrationShellDescriptor: CORE_AAS_DESCRIPTOR1,
        });

        // Assert
        expect(response.success).toBe(false);
        if (!response.success) {
            expect(response.error).toEqual(errorResult);
        }
    });
});
