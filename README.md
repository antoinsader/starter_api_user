
# Project Setup Guide
## Information

This starter project is for API in node.js containing basic structure for role, user, notification with authentication  

## Environment Setup

Create a `.env` file in the project root with the following content:

```
DB_CONNECTION_STRING=mongodb://localhost:27017/<dbname>
PORT=3002
JWT_SECRET_ADMIN=<A SECRET KEY>
JWT_SECRET_CUSTOMER=<A SECRET KEY>
ALLOWED_IP=http://localhost:3000
```

## Install Dependencies

To install the required packages, run:

```bash
npm i
```

## Start the Application

To start the application, use the command:

```bash
npm run start
```

## Database Setup

### Create Roles in Database

1. Open MongoDB.
2. Create a collection named `roles`.
3. Add two documents to this collection:

    ```json
    { "name": "admin", "description": "<optional>" }
    { "name": "customer", "description": "<optional>" }
    ```

### Create an Admin User

1. Open the user routes file and locate the following line:

    ```javascript
    router.post("/admin/create", auth_admin, role("admin"), ctrl.createUser);
    ```

2. Temporarily remove `auth_admin` and `role("admin")` so the line reads:

    ```javascript
    router.post("/admin/create", ctrl.createUser);
    ```

3. Open `requests.rest` and execute the following request to create an admin user:

    ```http
    POST http://localhost:3002/user/admin/create
    Content-Type: application/json

    {
        "username": "<username>",
        "email": "<email>",
        "password": "<password>",
        "cnfrmPassword": "<password>",
        "role_id": "<admin role id from db>"
    }
    ```

4. Revert the line in the routes file to its original state:

    ```javascript
    router.post("/admin/create", auth_admin, role("admin"), ctrl.createUser);
    ```

5. Execute the login request to retrieve the token:

    ```http
    POST http://localhost:3002/user/admin/loginAdmin
    Content-Type: application/json

    {
        "username": "<username>",
        "password": "<password>"
    }
    ```

6. Copy the token and save it.

### Create a Customer User

Execute the following request to create a customer user (use the admin token in the Authorization header):

```http
POST http://localhost:3002/user/customer/register
Content-Type: application/json
Authorization: Bearer <token>

{
    "username": "tonyclient",
    "email": "email@gmail.com",
    "password": "<password>"
}
```

## Congratulations! 🎉

Now, two users exist in the database: an admin and a customer.

Feel free to try other routes available in `requests.rest`.

## Additional Information

### To create a protected route for admin:

```javascript
router.get('<route>', auth_admin, role('admin'), ctrl.getAll);
```

### To create an unprotected route:

```javascript
router.get('<route>', ctrl.getAll);
```
