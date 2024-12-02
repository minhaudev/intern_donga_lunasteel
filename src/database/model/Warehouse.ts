import { model, Schema, Types } from 'mongoose';

// Interfaces for nested objects
interface Dimensions {
  thickness: number;
  width: number;
  lengthA: number;
  lengthB: number | null;
  lengthC: number;
}

interface SupplierInfo {
  supplierCoilId: number;
  supplierName: string;
  inputInterpretation: string | null;
}

interface StorageInfo {
  storageLocation: string;
  ageInventory: string;
  reportClc: string;
}

interface WeightInfo {
  netWeight: number;
  grossWeight: number;
  actualDensity: number;
  fixedDensity: number;
}

interface OrderInfo {
  order: string;
  orderId: string | null;
  orderStatus: number;
  customer: string;
  warehouseCode: string;
  tpBtp: string;
}

interface PackageInfo {
  amount: number;
  receiptNumber: string | null;
  standardPacking: string | null;
}

// Interface for Warehouse
export default interface Warehouse {
  _id: Types.ObjectId;
  itemId: number;
  coilId: string;
  itemName: string;
  prime: string;
  itemType: string;
  dimensions: Dimensions;
  supplierInfo: SupplierInfo;
  storageInfo: StorageInfo;
  weightInfo: WeightInfo;
  orderInfo: OrderInfo;
  packageInfo: PackageInfo;
  plating: string | null;
  status: boolean;
  receiptDate: Date;
}

const warehouseSchema = new Schema<Warehouse>(
  {
    itemId: {
      type: Schema.Types.Number,
      required: true,
    },
    coilId: {
      type: Schema.Types.String,
      required: true,
    },
    itemName: {
      type: Schema.Types.String,
      required: true,
    },
    prime: {
      type: Schema.Types.String,
      required: true,
    },
    itemType: {
      type: Schema.Types.String,
      required: true,
    },
    dimensions: {
      type: {
        thickness: { type: Schema.Types.Number, required: true },
        width: { type: Schema.Types.Number, required: true },
        lengthA: { type: Schema.Types.Number, required: true },
        lengthB: { type: Schema.Types.Number, default: null },
        lengthC: { type: Schema.Types.Number, required: true },
      },
      required: true,
    },
    supplierInfo: {
      type: {
        supplierCoilId: { type: Schema.Types.Number, required: true },
        supplierName: { type: Schema.Types.String, required: true },
        inputInterpretation: { type: Schema.Types.String, default: null },
      },
      required: true,
    },
    storageInfo: {
      type: {
        storageLocation: { type: Schema.Types.String, required: true },
        ageInventory: { type: Schema.Types.String, required: true },
        reportClc: { type: Schema.Types.String, required: true },
      },
      required: true,
    },
    weightInfo: {
      type: {
        netWeight: { type: Schema.Types.Number, required: true },
        grossWeight: { type: Schema.Types.Number, required: true },
        actualDensity: { type: Schema.Types.Number, required: true },
        fixedDensity: { type: Schema.Types.Number, required: true },
      },
      required: true,
    },
    orderInfo: {
      type: {
        order: { type: Schema.Types.String, required: true },
        orderId: { type: Schema.Types.String, default: null },
        orderStatus: { type: Schema.Types.Number, required: true },
        customer: { type: Schema.Types.String, required: true },
        warehouseCode: { type: Schema.Types.String, required: true },
        tpBtp: { type: Schema.Types.String, required: true },
      },
      required: true,
    },
    packageInfo: {
      type: {
        amount: { type: Schema.Types.Number, required: true },
        receiptNumber: { type: Schema.Types.String, default: null },
        standardPacking: { type: Schema.Types.String, default: null },
      },
      required: true,
    },
    plating: {
      type: Schema.Types.String,
      default: null,
    },
    status: {
      type: Schema.Types.Boolean,
      required: true,
    },
    receiptDate: {
      type: Schema.Types.Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

// Create indexes if needed
warehouseSchema.index({ itemId: 1 });
warehouseSchema.index({ coilId: 1 });
warehouseSchema.index({ status: 1 });

// Export the Warehouse model
export const WarehouseModel = model<Warehouse>(
  'Warehouse',
  warehouseSchema,
  'warehouse',
);
