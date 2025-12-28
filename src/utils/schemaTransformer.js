/**
 * Transforms PocketBase schema JSON to a format suitable for visualization
 */
export function transformPocketBaseSchema(schema) {
  if (!Array.isArray(schema)) {
    throw new Error('Schema must be an array of collections')
  }

  return schema.map(collection => {
    const columns = []

    // Add id column (primary key)
    columns.push({
      name: 'id',
      type: 'text',
      isPrimaryKey: true
    })

    // Process schema fields
    if (collection.schema && Array.isArray(collection.schema)) {
      collection.schema.forEach(field => {
        const column = {
          name: field.name,
          type: field.type,
          isPrimaryKey: false
        }

        // Handle relation fields
        if (field.type === 'relation' && field.options) {
          column.relatedCollection = field.options.collectionId || field.options.collectionName
        }

        columns.push(column)
      })
    }

    // Add created/updated columns for base collections
    if (collection.type !== 'view') {
      columns.push({
        name: 'created',
        type: 'autodate',
        isPrimaryKey: false
      })
      columns.push({
        name: 'updated',
        type: 'autodate',
        isPrimaryKey: false
      })
    }

    return {
      name: collection.name,
      columns
    }
  })
}
