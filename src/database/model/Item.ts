import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Item';
export const COLLECTION_NAME = 'items';

// Interfaces for nested objects
interface Group {
  level1: string;
  level2: string;
  level3: string;
}

interface Thickness {
  baseSteelThickness: number;
  postGalvanizationThickness: number;
  postPaintThickness: number;
  pipeWallThickness: number;
}

interface Color {
  colorCode: string;
  primaryPaintColorCode: string;
  backPaintColorCode: string;
}

interface Dimensional {
  upper: string;
  lower: string;
}

interface Description {
  shortDescription: string;
  overviewLongDescription: string;
  tradeName: string;
}

interface Revision {
  version: string;
  track: string;
}

interface Code {
  alloyCode: string;
  productCode: string;
  abcCode: string;
}

interface Cost {
  costType: string;
  costMethod: string;
}

interface Other {
  activeForDataIntegration: boolean;
  acceptRequirement: boolean;
  passRequirement: boolean;
  lotTrack: boolean;
  reservable: boolean;
}

// Main Item interface
export default interface Item {
  _id: Types.ObjectId;
  itemId: number;
  group: Group;
  grade: string;
  standart: string;
  thickness: Thickness;
  width: number;
  diameter: number;
  color: Color;
  length: number;
  shape: string;
  surfaceCoatingLayer: string;
  alloyCoating: string;
  glossine: string;
  conversionRatio: number;
  dimensional: Dimensional;
  description: Description;
  revision: Revision;
  stocked: boolean;
  showInDropDownList: number;
  um: string;
  source: string;
  code: Code;
  cost: Cost;
  other: Other;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Item>(
  {
    itemId: {
      type: Schema.Types.Number,
      required: true,
    },
    group: {
      level1: {
        type: Schema.Types.String,
        required: true,
      },
      level2: {
        type: Schema.Types.String,
        required: true,
      },
      level3: {
        type: Schema.Types.String,
        required: true,
      },
    },
    grade: {
      type: Schema.Types.String,
      required: true,
    },
    standart: {
      type: Schema.Types.String,
      required: true,
    },
    thickness: {
      baseSteelThickness: {
        type: Schema.Types.Number,
        required: true,
      },
      postGalvanizationThickness: {
        type: Schema.Types.Number,
        required: true,
      },
      postPaintThickness: {
        type: Schema.Types.Number,
        required: true,
      },
      pipeWallThickness: {
        type: Schema.Types.Number,
        required: true,
      },
    },
    width: {
      type: Schema.Types.Number,
      required: true,
    },
    diameter: {
      type: Schema.Types.Number,
      required: true,
    },
    color: {
      colorCode: {
        type: Schema.Types.String,
        required: true,
      },
      primaryPaintColorCode: {
        type: Schema.Types.String,
        required: true,
      },
      backPaintColorCode: {
        type: Schema.Types.String,
        required: true,
      },
    },
    length: {
      type: Schema.Types.Number,
      required: true,
    },
    shape: {
      type: Schema.Types.String,
      required: true,
    },
    surfaceCoatingLayer: {
      type: Schema.Types.String,
      required: true,
    },
    alloyCoating: {
      type: Schema.Types.String,
      required: true,
    },
    glossine: {
      type: Schema.Types.String,
      required: true,
    },
    conversionRatio: {
      type: Schema.Types.Number,
      required: true,
    },
    dimensional: {
      upper: {
        type: Schema.Types.String,
        required: true,
      },
      lower: {
        type: Schema.Types.String,
        required: true,
      },
    },
    description: {
      shortDescription: {
        type: Schema.Types.String,
        required: true,
      },
      overviewLongDescription: {
        type: Schema.Types.String,
        required: true,
      },
      tradeName: {
        type: Schema.Types.String,
        required: true,
      },
    },
    revision: {
      version: {
        type: Schema.Types.String,
        required: true,
      },
      track: {
        type: Schema.Types.String,
        required: true,
      },
    },
    stocked: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showInDropDownList: {
      type: Schema.Types.Number,
      required: true,
    },
    um: {
      type: Schema.Types.String,
      required: true,
    },
    source: {
      type: Schema.Types.String,
      required: true,
    },
    code: {
      alloyCode: {
        type: Schema.Types.String,
        required: true,
      },
      productCode: {
        type: Schema.Types.String,
        required: true,
      },
      abcCode: {
        type: Schema.Types.String,
        required: true,
      },
    },
    cost: {
      costType: {
        type: Schema.Types.String,
        required: true,
      },
      costMethod: {
        type: Schema.Types.String,
        required: true,
      },
    },
    other: {
      activeForDataIntegration: {
        type: Schema.Types.Boolean,
        default: false,
      },
      acceptRequirement: {
        type: Schema.Types.Boolean,
        default: false,
      },
      passRequirement: {
        type: Schema.Types.Boolean,
        default: false,
      },
      lotTrack: {
        type: Schema.Types.Boolean,
        default: false,
      },
      reservable: {
        type: Schema.Types.Boolean,
        default: false,
      },
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: Date.now,
    },
    updatedAt: {
      type: Schema.Types.Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  },
);

export const ItemModel = model<Item>(DOCUMENT_NAME, schema, COLLECTION_NAME);
