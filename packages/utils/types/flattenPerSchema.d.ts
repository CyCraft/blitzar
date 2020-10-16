/**
 * Flattens an object to be in line with a schema.
 *
 * @export
 * @param {Record<string, any>} target the target object
 * @param {Record<string, any> | (Record<string, any>[])} schema
 * @returns {Record<string, any>}
 */
export declare function flattenPerSchema(target: Record<string, any>, schema: Record<string, any> | Record<string, any>[]): Record<string, any>;
