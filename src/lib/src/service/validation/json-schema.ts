/**
 * Types allowed in a JSON Schema.
 * Avoid `null` type: it will be removed in v8.
 */
export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null';

/**
 * Subset of the JSON Schema.
 * Types are enforced to validate everything: each value MUST have a `type`.
 * Therefore, unlike the spec, booleans are not allowed as schemas.
 * @see http://json-schema.org/latest/json-schema-validation.html
 * @todo Not all validation features are supported yet : just follow the interface.
 */
export interface JSONSchema {

  /**
   * Type for a primitive value.
   * Always explicit the `type`: it will be required in v8.
   * Avoid `null` type: it will be removed in v8.
   */
  type?: JSONSchemaType | JSONSchemaType[];

  /**
   * List of properties schemas for an object.
   */
  properties?: {
    [k: string]: JSONSchema;
  };

  /**
   * Array of names of the required properties for an object.
   * Properties set as required should be present in 'properties' too.
   * Note that in the last spec, booleans are not supported anymore.
   */
  required?: string[];

  /**
   * Schema for the values of an array.
   * 'type' of values should be a string (not an array of type).
   * Avoid using an array of JSON schemas: it won't be possible anymore in v8.
   */
  items?: JSONSchema | JSONSchema[];

  /**
   * Allow other properties, to not fail with existing JSON schemas.
   * Avoid this: it won't be possible anymore in v8.
   */
  [k: string]: any;

}
