AdminUserController
(App\Features\user\Controllers\SuperAdmin\AdminUs
erController)

1. List Admin Users

- HTTP Method + Route: GET
  /api/super-admin/admins
- Controller Method Name: index
- Request Payload: None
- Response Format:

  1 {
  2 "success": true,
  3 "message": "Admin users retrieved
  successfully.",
  4 "data": [
  5 {
  6 "id": "uuid-admin-1",
  7 "name": "Admin User 1",
  8 "email":
  "admin1@example.com",
  9 "role": "admin",

10 "created_at":
"YYYY-MM-DDTHH:MM:SSZ",
11 "updated_at":
"YYYY-MM-DDTHH:MM:SSZ"
12 }
13 ]
14 }

2. Create New Admin User

- HTTP Method + Route: POST
  /api/super-admin/admins
- Controller Method Name: store
- Request Payload:

1 {
2 "name": "string",
3 "email": "string (email, unique)",
4 "password": "string (min:8)",
5 "location_id": "uuid (optional,
exists:locations,id)",
6 "location_ids": ["uuid"] (array,
min:1, distinct, exists:locations,id)
7 }

- Response Format:

  1 {
  2 "success": true,
  3 "message": "Admin user created
  successfully.",
  4 "data": {
  5 "id": "uuid-new-admin",
  6 "name": "New Admin",
  7 "email": "newadmin@example.com",
  8 "role": "admin",
  9 "created_at":
  "YYYY-MM-DDTHH:MM:SSZ",

10 "updated_at":
"YYYY-MM-DDTHH:MM:SSZ"
11 }
12 }

3. Show Admin User Details

- HTTP Method + Route: GET
  /api/super-admin/admins/{admin}
- Controller Method Name: show
- Request Payload: None
- Response Format:

  1 {
  2 "success": true,
  3 "message": "Admin user retrieved
  successfully.",
  4 "data": {
  5 "id": "uuid-admin-x",
  6 "name": "Admin User X",
  7 "email": "adminx@example.com",
  8 "role": "admin",
  9 "created_at":
  "YYYY-MM-DDTHH:MM:SSZ",

10 "updated_at":
"YYYY-MM-DDTHH:MM:SSZ"
11 }
12 }

4. Update Admin User Details

- HTTP Method + Route: PUT|PATCH
  /api/super-admin/admins/{admin}
- Controller Method Name: update
- Request Payload:

1 {
2 "name": "string (optional, max:255)",
3 "email": "string (optional, email,
max:255, unique:users,email,
ignore:{adminId})",
4 "password": "string (optional,
min:8)",
5 "location_id": "uuid (sometimes,
nullable, exists:locations,id)",
6 "location_ids": ["uuid"] (sometimes,
array, min:1, distinct, exists:locations,id)
7 }

- Response Format:

  1 {
  2 "success": true,
  3 "message": "Admin user updated
  successfully.",
  4 "data": {
  5 "id": "uuid-admin-x",
  6 "name": "Updated Name",
  7 "email": "updated@example.com",
  8 "role": "admin",
  9 "created_at":
  "YYYY-MM-DDTHH:MM:SSZ",

10 "updated_at":
"YYYY-MM-DDTHH:MM:SSZ"
11 }
12 }

5. Delete Admin User

- HTTP Method + Route: DELETE
  /api/super-admin/admins/{admin}
- Controller Method Name: destroy
- Request Payload: None
- Response Format:

1 {
2 "success": true,
3 "message": "Admin user deleted
successfully.",
4 "data": null
5 }

6. Assign Locations to Admin User

- HTTP Method + Route: PUT
  /api/super-admin/admins/{admin}/locations
- Controller Method Name: assignLocations
- Request Payload:

1 {
2 "location_id": "uuid (sometimes,
nullable, exists:locations,id)",
3 "location_ids": ["uuid"] (required,
array, min:1, distinct, exists:locations,id)
4 }

- Response Format:

  1 {
  2 "success": true,
  3 "message": "Locations assigned to
  admin successfully.",
  4 "data": {
  5 "admin_id": "uuid-admin-x",
  6 "assigned_locations": [
  7 "uuid-location-1",
  8 "uuid-location-2"
  9 ]

10 }
11 }
