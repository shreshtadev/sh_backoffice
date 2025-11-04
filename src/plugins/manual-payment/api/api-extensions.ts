import gql from "graphql-tag";

const manualPaymentConfigAdminApiExtensions = gql`
  type ManualPaymentConfig implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    accountName: String!
    accountNumber: String!
    bankName: String!
    ifsc: String!
    upiId: String!
    phone: String!
    instructionsExtra: String!
    enabled: Boolean!
  }

  type ManualPaymentConfigList implements PaginatedList {
    items: [ManualPaymentConfig!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input ManualPaymentConfigListOptions

  extend type Query {
    manualPaymentConfig(id: ID!): ManualPaymentConfig
    manualPaymentConfigs(
      options: ManualPaymentConfigListOptions
    ): ManualPaymentConfigList!
  }

  input CreateManualPaymentConfigInput {
    code: String!
    accountName: String!
    accountNumber: String!
    bankName: String!
    ifsc: String!
    upiId: String!
    phone: String!
    instructionsExtra: String!
    enabled: Boolean!
  }

  input UpdateManualPaymentConfigInput {
    id: ID!
    code: String
    accountName: String
    accountNumber: String
    bankName: String
    ifsc: String
    upiId: String
    phone: String
    instructionsExtra: String
    enabled: Boolean
  }

  extend type Mutation {
    createManualPaymentConfig(
      input: CreateManualPaymentConfigInput!
    ): ManualPaymentConfig!
    updateManualPaymentConfig(
      input: UpdateManualPaymentConfigInput!
    ): ManualPaymentConfig!
    deleteManualPaymentConfig(id: ID!): DeletionResponse!
  }
`;
const manualPaymentConfigShopApiExtensions = gql`
  type ManualPaymentConfig implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    accountName: String!
    accountNumber: String!
    bankName: String!
    ifsc: String!
    upiId: String!
    phone: String!
    instructionsExtra: String!
    enabled: Boolean!
  }
  type ManualPaymentConfigList implements PaginatedList {
    items: [ManualPaymentConfig!]!
    totalItems: Int!
  }
  # Generated at run-time by Vendure
  input ManualPaymentConfigListOptions

  extend type Query {
    manualPaymentConfigByCode(code: String!): ManualPaymentConfig
    manualPaymentConfigs(
      options: ManualPaymentConfigListOptions
    ): ManualPaymentConfigList!
    qrCode(data: String!): String!
  }
`;

export const adminApiExtensions = gql`
  ${manualPaymentConfigAdminApiExtensions}
`;

export const shopApiExtensions = gql`
  ${manualPaymentConfigShopApiExtensions}
`;
