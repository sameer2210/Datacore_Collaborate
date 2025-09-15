import { IndustryResponseDto } from "../industry/dto.js";
import { EmployeeCountResponseDto } from "../employeeCount/dto.js";
import { CountryResponseDto } from "../country/dto.js";
import { SectorResponseDto } from "../sector/dto.js";
import { AnnualRevenueResponseDto } from "../annualRevenue/dto.js";

export const validateAndSanitizeOrganization = (orgData) => {
    const {
        organization_name,
        organization_employeeCount,
        organization_country,
        organization_averageRevenue,
        organization_sector,
        organization_industry,
        organization_logo
    } = orgData;

    if (!organization_name || organization_name.trim().length < 2 || organization_name.trim().length > 100) {
        throw new Error('Organization name must be between 2 and 100 characters');
    }

    if (!organization_employeeCount) {
        throw new Error('Employee count is required');
    }

    if (!organization_country) {
        throw new Error('Country is required');
    }

    if (!organization_averageRevenue) {
        throw new Error('Average revenue Require');
    }

    if (!organization_sector) {
        throw new Error('Sector is required');
    }

    if (!organization_industry) {
        throw new Error('Industry is required');
    }

    if (organization_logo && organization_logo.trim().length === 0) {
        throw new Error('Logo cannot be empty');
    }

    return {
        name: organization_name.trim(),
        employeeCount: organization_employeeCount,
        country: organization_country,
        averageRevenue: organization_averageRevenue,
        sector: organization_sector,
        industry: organization_industry,
        logo: organization_logo
    };
};


export const validateAndSanitizeOrganizationUpdate = (data) => {
    const {
        organization_name,
        organization_logo,
        organization_address,
        organization_employeeCount,
        organization_country,
        organization_averageRevenue,
        organization_sector,
        organization_industry,
        organization_registration_number

    } = data;

    const sanitizedData = {};

    if (organization_name) {
        if (organization_name.trim().length < 2 || organization_name.trim().length > 100) {
            throw new Error('Organization name must be between 2 and 100 characters');
        }
        sanitizedData.name = organization_name.trim();
    }

    if (organization_address) {
        if (typeof organization_address !== 'string' || organization_address.trim().length === 0) {
            throw new Error('Organization address must be a non-empty string');
        }
        sanitizedData.address = organization_address.trim();
    }

    if (organization_registration_number) {
        if (typeof organization_registration_number !== 'string' || organization_registration_number.trim().length === 0) {
            throw new Error('Organization registration number must be a non-empty string');
        }
        sanitizedData.registrationNumber = organization_registration_number.trim();
    }

    if (organization_logo) {
        sanitizedData.logo = organization_logo;
    }

    if (organization_employeeCount) {
        sanitizedData.employeeCount = organization_employeeCount;
    }

    if (organization_country) {
        sanitizedData.country = organization_country;
    }

    if (organization_averageRevenue) {
        sanitizedData.averageRevenue = organization_averageRevenue;
    }

    if (organization_sector) {
        sanitizedData.sector = organization_sector;
    }

    if (organization_industry) {
        sanitizedData.industry = organization_industry;
    }

    return sanitizedData;
};


export const responseOrganizationDTO = (organization) => {
    return {
        id: organization._id,
        name: organization.name,
        address: organization.address,
        admin: organization.admin,
        employeeCount: typeof organization.employeeCount === 'object' ? new EmployeeCountResponseDto(organization.employeeCount) : organization.employeeCount,
        country: typeof organization.country === 'object' ? new CountryResponseDto(organization.country) : organization.country,
        averageRevenue: typeof organization.averageRevenue === 'object' ? new AnnualRevenueResponseDto(organization.averageRevenue) : organization.averageRevenue,
        sector: typeof organization.sector === 'object' ? new SectorResponseDto(organization.sector) : organization.sector,
        industry: typeof organization.industry === 'object' ? new IndustryResponseDto(organization.industry) : organization.industry,
        logo: organization.logo,
        registrationNumber: organization.registrationNumber,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        status: organization.status
    };
};

