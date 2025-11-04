import { Inject, Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import {
  CustomFieldsObject,
  ID,
  PaginatedList,
} from "@vendure/common/lib/shared-types";
import {
  CustomFieldRelationService,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  RequestContext,
  TransactionalConnection,
  assertFound,
  patchEntity,
} from "@vendure/core";
import { MANUAL_PAYMENT_PLUGIN_OPTIONS } from "../constants";
import { ManualPaymentConfig } from "../entities/manual-payment-config.entity";
import { PluginInitOptions } from "../types";
import QRCode from "qrcode";

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

@Injectable()
export class ManualPaymentConfigService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService,
    @Inject(MANUAL_PAYMENT_PLUGIN_OPTIONS) private options: PluginInitOptions
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ManualPaymentConfig>,
    relations?: RelationPaths<ManualPaymentConfig>
  ): Promise<PaginatedList<ManualPaymentConfig>> {
    const [items, totalItems] = await this.listQueryBuilder
      .build(ManualPaymentConfig, options, {
        relations,
        ctx,
      })
      .getManyAndCount();
    return {
      items,
      totalItems,
    };
  }

  async findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<ManualPaymentConfig>
  ): Promise<ManualPaymentConfig | null> {
    return this.connection.getRepository(ctx, ManualPaymentConfig).findOne({
      where: { id },
      relations,
    });
  }

  async findByCode(
    ctx: RequestContext,
    code: string
  ): Promise<ManualPaymentConfig | null> {
    return this.connection
      .getRepository(ctx, ManualPaymentConfig)
      .findOneByOrFail({ code: code });
  }

  async create(
    ctx: RequestContext,
    input: CreateManualPaymentConfigInput
  ): Promise<ManualPaymentConfig> {
    const newEntityInstance = new ManualPaymentConfig(input);
    const newEntity = await this.connection
      .getRepository(ctx, ManualPaymentConfig)
      .save(newEntityInstance);
    await this.customFieldRelationService.updateRelations(
      ctx,
      ManualPaymentConfig,
      input,
      newEntity
    );
    return assertFound(this.findOne(ctx, newEntity.id));
  }

  async update(
    ctx: RequestContext,
    input: UpdateManualPaymentConfigInput
  ): Promise<ManualPaymentConfig> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      ManualPaymentConfig,
      input.id
    );
    const updatedEntity = patchEntity(entity, input);
    await this.connection
      .getRepository(ctx, ManualPaymentConfig)
      .save(updatedEntity, { reload: false });
    await this.customFieldRelationService.updateRelations(
      ctx,
      ManualPaymentConfig,
      input,
      updatedEntity
    );
    return assertFound(this.findOne(ctx, updatedEntity.id));
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      ManualPaymentConfig,
      id
    );
    try {
      await this.connection
        .getRepository(ctx, ManualPaymentConfig)
        .remove(entity);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e: any) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
  async generateQr(data: string): Promise<string> {
    return await QRCode.toDataURL(data);
  }
}
