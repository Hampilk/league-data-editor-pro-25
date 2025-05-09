
# API Documentation

This directory contains documentation for the API endpoints used in the Football League Analytics platform.

## API Structure

The application uses a REST API architecture with the following endpoints:

- `/leagues` - League management endpoints
- `/matches` - Match data endpoints
- `/stats` - Statistics and analysis endpoints
- `/predictions` - Prediction system endpoints

## Authentication

Most API endpoints require authentication. The application uses token-based authentication with JWT.

## Error Handling

API responses follow standard HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses are formatted as:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Pagination

List endpoints support pagination using the following query parameters:

- `page` - Page number (1-based)
- `limit` - Number of items per page
- `sort` - Field to sort by
- `order` - Sort order (`asc` or `desc`)

Paginated responses include metadata:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- 100 requests per minute per user
- 1000 requests per day per user

Rate limit information is included in the response headers:

- `X-RateLimit-Limit` - Maximum requests per minute
- `X-RateLimit-Remaining` - Remaining requests in the current window
- `X-RateLimit-Reset` - Time when the rate limit resets (Unix timestamp)
