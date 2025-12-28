export const sampleSchema = [
  {
    "id": "users",
    "name": "users",
    "type": "auth",
    "schema": [
      { "name": "name", "type": "text" },
      { "name": "avatar", "type": "file" },
      { "name": "bio", "type": "text" }
    ]
  },
  {
    "id": "posts",
    "name": "posts",
    "type": "base",
    "schema": [
      { "name": "title", "type": "text" },
      { "name": "content", "type": "text" },
      { "name": "author", "type": "relation", "options": { "collectionName": "users" } },
      { "name": "published", "type": "bool" },
      { "name": "tags", "type": "json" }
    ]
  },
  {
    "id": "comments",
    "name": "comments",
    "type": "base",
    "schema": [
      { "name": "content", "type": "text" },
      { "name": "post", "type": "relation", "options": { "collectionName": "posts" } },
      { "name": "author", "type": "relation", "options": { "collectionName": "users" } }
    ]
  },
  {
    "id": "categories",
    "name": "categories",
    "type": "base",
    "schema": [
      { "name": "name", "type": "text" },
      { "name": "slug", "type": "text" },
      { "name": "description", "type": "text" }
    ]
  }
]
