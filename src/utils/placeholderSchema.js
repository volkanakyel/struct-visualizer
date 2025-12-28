export const placeholderSchema = [
  {
    name: 'plan',
    columns: [
      { name: 'id', type: 'text', isPrimaryKey: true },
      { name: 'title', type: 'text' },
      { name: 'your_id', type: 'relation', relatedCollection: 'your' },
      { name: 'created', type: 'autodate' },
      { name: 'updated', type: 'autodate' }
    ]
  },
  {
    name: 'your',
    columns: [
      { name: 'id', type: 'text', isPrimaryKey: true },
      { name: 'name', type: 'text' },
      { name: 'pocketbase_id', type: 'relation', relatedCollection: 'pocketbase' },
      { name: 'created', type: 'autodate' },
      { name: 'updated', type: 'autodate' }
    ]
  },
  {
    name: 'pocketbase',
    columns: [
      { name: 'id', type: 'text', isPrimaryKey: true },
      { name: 'schema', type: 'json' },
      { name: 'created', type: 'autodate' },
      { name: 'updated', type: 'autodate' }
    ]
  }
]
