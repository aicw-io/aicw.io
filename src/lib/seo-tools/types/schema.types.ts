export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'date'
  | 'datetime'
  | 'number'
  | 'currency'
  | 'select'
  | 'boolean'
  | 'array'
  | 'nested'
  | 'image'
  | 'rating'
  | 'duration';

export interface SchemaField {
  property: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  nestedType?: string;
  itemType?: string;
  itemFields?: SchemaField[];
}

export interface SchemaDefinition {
  type: string;
  label: string;
  description: string;
  fields: SchemaField[];
  example?: Record<string, unknown>;
  customGenerator?: (data: Record<string, unknown>) => Record<string, unknown>;
}

export interface SchemaTypeInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popularity: number;
}

export interface SchemaData {
  [key: string]: unknown;
}

export interface SchemaOutput {
  json: string;
  scriptTag: string;
  schema: Record<string, unknown>;
}
