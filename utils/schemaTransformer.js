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

/**
 * Get the type of a value for display
 */
function getValueType(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

/**
 * Format a value for display
 */
function formatValue(value) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value.length > 30 ? value.substring(0, 30) + '...' : value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return '{...}'
  return String(value)
}

/**
 * Generate a unique ID for a node
 */
let nodeIdCounter = 0
function generateNodeId(prefix = 'node') {
  return `${prefix}_${++nodeIdCounter}`
}

/**
 * Transforms any JSON structure into visualization-friendly format
 */
export function transformGenericJSON(json) {
  nodeIdCounter = 0
  const nodes = []
  const relations = []

  function processValue(value, nodeName, parentId = null, relationKey = null) {
    if (value === null || value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      // Process array
      if (value.length === 0) {
        return null
      }

      // Check if array contains objects
      const hasObjects = value.some(item => typeof item === 'object' && item !== null && !Array.isArray(item))

      if (hasObjects) {
        // Create a node for each object in the array
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            const itemName = item.name || item.queue_name || item.display_name || item.id || `${nodeName}[${index}]`
            processValue(item, itemName, parentId, relationKey || nodeName)
          }
        })
      }
      return null
    }

    if (typeof value === 'object') {
      const nodeId = generateNodeId(nodeName)
      const columns = []
      const childRelations = []

      // Process each property
      Object.entries(value).forEach(([key, val]) => {
        const valType = getValueType(val)

        if (valType === 'object' && val !== null) {
          // Nested object - create relation
          const childNodeId = processValue(val, key, nodeId, key)
          if (childNodeId) {
            childRelations.push({
              key,
              targetId: childNodeId
            })
          } else {
            // If child returned null but has properties, show as inline object
            const objKeys = Object.keys(val)
            if (objKeys.length > 0 && objKeys.length <= 3) {
              // Small object - show inline
              objKeys.forEach(subKey => {
                columns.push({
                  name: `${key}.${subKey}`,
                  type: getValueType(val[subKey]),
                  value: formatValue(val[subKey]),
                  isPrimaryKey: false,
                  isNested: true
                })
              })
            } else {
              columns.push({
                name: key,
                type: 'object',
                value: formatValue(val),
                isPrimaryKey: false
              })
            }
          }
        } else if (valType === 'array') {
          // Array - check contents
          if (val.length > 0) {
            const firstItem = val[0]
            if (typeof firstItem === 'object' && firstItem !== null) {
              // Array of objects - create child nodes
              processValue(val, key, nodeId, key)
              columns.push({
                name: key,
                type: 'relation',
                value: `${val.length} items`,
                isPrimaryKey: false,
                relatedCollection: key,
                isArray: true
              })
            } else {
              // Array of primitives
              columns.push({
                name: key,
                type: `${getValueType(firstItem)}[]`,
                value: `[${val.length} items]`,
                isPrimaryKey: false
              })
            }
          } else {
            columns.push({
              name: key,
              type: 'array',
              value: '[]',
              isPrimaryKey: false
            })
          }
        } else {
          // Primitive value
          const isPK = key === 'id' || key === 'name' || key === 'queue_name'
          columns.push({
            name: key,
            type: valType,
            value: formatValue(val),
            isPrimaryKey: isPK
          })
        }
      })

      // Sort columns: primary keys first, then by name
      columns.sort((a, b) => {
        if (a.isPrimaryKey && !b.isPrimaryKey) return -1
        if (!a.isPrimaryKey && b.isPrimaryKey) return 1
        return a.name.localeCompare(b.name)
      })

      nodes.push({
        id: nodeId,
        name: nodeName,
        columns,
        parentId,
        relationKey
      })

      // Add child relations
      childRelations.forEach(rel => {
        relations.push({
          sourceId: nodeId,
          targetId: rel.targetId,
          key: rel.key
        })
      })

      // Add parent relation
      if (parentId && relationKey) {
        relations.push({
          sourceId: parentId,
          targetId: nodeId,
          key: relationKey
        })
      }

      return nodeId
    }

    return null
  }

  // Handle both array and object root
  if (Array.isArray(json)) {
    if (json.length === 1 && typeof json[0] === 'object') {
      // Single object in array - treat as root
      processValue(json[0], 'root')
    } else {
      // Multiple items - process each
      json.forEach((item, index) => {
        const itemName = item.name || item.id || `item_${index}`
        processValue(item, itemName)
      })
    }
  } else if (typeof json === 'object' && json !== null) {
    processValue(json, 'root')
  }

  return { nodes, relations }
}
