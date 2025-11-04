import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject } from '@vendure/common/lib/shared-types';
import {
    Allow,
    Ctx,
    ID,
    ListQueryOptions,
    PaginatedList,
    RelationPaths,
    Relations,
    RequestContext,
    Transaction
} from '@vendure/core';
import { ManualPaymentConfig } from '../entities/manual-payment-config.entity';
import { ManualPaymentConfigService } from '../services/manual-payment-config.service';

// These can be replaced by generated types if you set up code generation
interface CreateManualPaymentConfigInput {
    code: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    upiId: string;
    phone: string;
    instructionsExtra: string;
    enabled: boolean;
    // Define the input fields here
    customFields?: CustomFieldsObject;
}
interface UpdateManualPaymentConfigInput {
    id: ID;
    code?: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    ifsc?: string;
    upiId?: string;
    phone?: string;
    instructionsExtra?: string;
    enabled?: boolean;
    // Define the input fields here
    customFields?: CustomFieldsObject;
}

@Resolver()
export class ManualPaymentConfigAdminResolver {
    constructor(private manualPaymentConfigService: ManualPaymentConfigService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async manualPaymentConfig(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
        @Relations(ManualPaymentConfig) relations: RelationPaths<ManualPaymentConfig>,
    ): Promise<ManualPaymentConfig | null> {
        return this.manualPaymentConfigService.findOne(ctx, args.id, relations);
    }

    @Query()
    @Allow(Permission.SuperAdmin)
    async manualPaymentConfigs(
        @Ctx() ctx: RequestContext,
        @Args() args: { options: ListQueryOptions<ManualPaymentConfig> },
        @Relations(ManualPaymentConfig) relations: RelationPaths<ManualPaymentConfig>,
    ): Promise<PaginatedList<ManualPaymentConfig>> {
        return this.manualPaymentConfigService.findAll(ctx, args.options || undefined, relations);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async createManualPaymentConfig(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: CreateManualPaymentConfigInput },
    ): Promise<ManualPaymentConfig> {
        return this.manualPaymentConfigService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async updateManualPaymentConfig(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: UpdateManualPaymentConfigInput },
    ): Promise<ManualPaymentConfig> {
        return this.manualPaymentConfigService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async deleteManualPaymentConfig(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
        return this.manualPaymentConfigService.delete(ctx, args.id);
    }
}
