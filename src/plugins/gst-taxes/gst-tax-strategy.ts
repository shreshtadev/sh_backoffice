import { TaxLine } from "@vendure/common/lib/generated-types";
import {
  TaxLineCalculationStrategy,
  CalculateTaxLinesArgs,
  Injector,
  TaxCategory,
  TransactionalConnection,
} from "@vendure/core"; // Import the TypeORM Connection

export class GstTaxStrategy implements TaxLineCalculationStrategy {
  private connection: TransactionalConnection;

  init(injector: Injector) {
    // Inject the Connection object
    this.connection = injector.get(TransactionalConnection);
  }

  async calculate(args: CalculateTaxLinesArgs): Promise<TaxLine[]> {
    const { orderLine, applicableTaxRate } = args;

    // 1. Get the ID from the incomplete category entity
    const taxCategoryId = applicableTaxRate.category.id;

    // 2. Use the Connection to get the repository and find the entity with relations
    const fullTaxCategory = await this.connection
      .getRepository(TaxCategory)
      .findOne({
        where: { id: taxCategoryId },
        // CRITICAL: Explicitly specify the relation here
        relations: ["taxRates"],
      });

    if (!fullTaxCategory || fullTaxCategory.taxRates.length < 2) {
      console.error("GST Tax configuration missing rates.");
      return [];
    }

    // 3. You can now reliably access taxRates
    const allTaxRates = fullTaxCategory.taxRates;

    // ... (rest of the logic remains the same) ...
    const rateCGST = allTaxRates.find((rate) =>
      rate.name.toUpperCase().includes("CGST")
    );
    const rateSGST = allTaxRates.find((rate) =>
      rate.name.toUpperCase().includes("SGST")
    );

    if (!rateCGST || !rateSGST) {
      console.error("CGST or SGST rate not found in the TaxCategory.");
      return [];
    }

    return [
      {
        description: rateCGST.name,
        taxRate: rateCGST.value,
      },
      {
        description: rateSGST.name,
        taxRate: rateSGST.value,
      },
    ];
  }
}
