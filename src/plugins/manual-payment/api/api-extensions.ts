import gql from "graphql-tag";

const manualPaymentConfigShopApiExtensions = gql`

  extend type Query {
    manualPaymentConfigByCode(code: String!): PaymentMethod!
    qrCode(data: String!): String!
  }
`;

export const shopApiExtensions = gql`
  ${manualPaymentConfigShopApiExtensions}
`;
