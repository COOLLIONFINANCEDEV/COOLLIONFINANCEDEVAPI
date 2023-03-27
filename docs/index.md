# APIs DOCUMENTATION

***RESPONSE MODEL***

- success: An boolean indicating whether the response was successful or not.
- message: A string describing the response.
- data: an array of objects.
- errors: Table of objects indicating the field causing the error and the error message.
- example:
  
    ```javascript
        // success
        {
            success: true,
            message: "Entity read successfully",
            data: [
                {
                    name: "foo",
                    age: 13,
                },
                {
                    name: "foo",
                    age: "12",
                }
            ],
            errors: []
        }

        // error
        {
            success: false,
            message: "",
            data: [],
            errors: [
                {
                    field: "name",
                    message: "name is required",
                },
                {
                    field: "age",
                    message: "age must be an integer",
                }
            ]
        }
    ```

## Authentication APIs

1. **Changing password**

   - Endpoint: GET /auth/change-password
   - Authorization: Bearer
   - Request Body Schema:

        ```javascript
            {
                oldPassword: string,
                newPassword: string,
            }
        ```

   - Response
     - Status: 200
     - Data:

        ```json
            {
                "success": false,
                "message": "Bad Request",
                "data": [],
                "errors": [
                    {
                    "field": "newPassword",
                    "message": "Give a strong password for more security."
                    }
                ]
            }
        ```

        ```json
            {
                "success": true,
                "message": "Password was change successfull!",
                "data": [],
                "errors": []
            }
        ```

2. **Refresh access token**

   - Endpoint: GET /auth/refresh-access
   - Request Body Schema:

        ```javascript
            {
                refreshToken: string,
                userId: number, // integer
            }
        ```

   - Response
     - Status: 200
     - Data:

        ```json
            {
                "success": true,
                "message": "Login successful!",
                "data": [
                    {
                    "tokenType": "Bearer",
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInNlc3Npb25JZCI6IjA4ZTJmNWEwMzE0Y2Q5NGRmZWE2YTNjYmU2Y2QyNDBhNGY0NDcyZTc4MWM2NjRiNTQzYWMwMDk1NTdjMWZjYzMiLCJ0ZW5hbnRzIjpbXSwiaWF0IjoxNjc5NTQyNTU0LCJleHAiOjE2Nzk1NDI4NTR9.1l4GKmaCOk7k__rXgxb2B7hC67HeUCwh7SYxL-pBw38",
                    "refreshToken": "aba009c6-4c2e-4c0d-82e7-561709085d4b"
                    }
                ],
                "errors": []
            }
        ```

3. **Login**

   - Endpoint: GET /auth/login
   - Request Body Schema:
        - Login with username and password

        ```javascript
            {
                username: string // valide email address or phone number like +225 000000000,
                userId: number, // integer
            }
        ```

        - <span id="login-with-wallet">Login or registration with crypto wallet address</span>

        ```javascript
            {
                address: string
            }
        ```

        - Login using magic link: *only on first login*

        ```javascript
            //magicLink = 'https://base-url.com?magicLink=token
            {
                magicLink: token // the token of magicLink
            }
        ```

   - Response
     - Status: 200
     - Data:

        ```json
            {
                "success": true,
                "message": "Login successful!",
                "data": [
                    {
                    "tokenType": "Bearer",
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInNlc3Npb25JZCI6IjA4ZTJmNWEwMzE0Y2Q5NGRmZWE2YTNjYmU2Y2QyNDBhNGY0NDcyZTc4MWM2NjRiNTQzYWMwMDk1NTdjMWZjYzMiLCJ0ZW5hbnRzIjpbXSwiaWF0IjoxNjc5NTQyNTU0LCJleHAiOjE2Nzk1NDI4NTR9.1l4GKmaCOk7k__rXgxb2B7hC67HeUCwh7SYxL-pBw38",
                    "refreshToken": "aba009c6-4c2e-4c0d-82e7-561709085d4b"
                    }
                ],
                "errors": []
            }
        ```

4. **Registration**

   - Endpoint: POST /auth/register
   - Request Body Schema:
     - Register with username and password

        ```javascript
            {
                email: string,
                password: string,
            }
        ```

     - Register with crypto wallet
        [*See Login*](#login-with-wallet)

   - Response
      - Status: 201
      - Data:
  
        ```json
            {
                "success": true,
                "message": "Created!",
                "data": [],
                "errors": []
            }
        ```

## Tenant APIs

1. List tenants

   - Endpoint: GET /tenant/:tenantId/list/:page?/:perPage?
   - Response:

        ```json
            {
                "success":true,
                "message":"Tenants retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "name": "Asgard Corporation",
                        "accountType": 1,
                        
                    },
                    
                ],
                "errors":[]
            }
       ```

2. Retrieve other tenant
    - Endpoint: GET /tenant/:tenantId/other/:otherId
    - Response:

        ```json
            {
                "success":true,
                "message":"Tenant retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "name": "Asgard Corporation",
                        "accountType": 1,
                        
                    }
                ],
                "errors":[]
            }
        ```

3. Retrieve tenant
    - Endpoint: GET /tenant/:tenantId
    - Response:

        ```json
            {
                "success":true,
                "message":"Tenant retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "name": "Asgard Corporation",
                        "accountType": 1,
                        
                    }
                ],
                "errors":[]
            }
        ```

4. Remove tenant
   - Endpoint: DELETE /tenant/:tenantId
   - Response:
  
        ```json
            {
                "success":true,
                "message":"Tenant removed successfully.",
                "data":[],
                "errors":[]
            }
        ```

5. Update tenant
    - Endpoint: PUT /tenant/:tenantId
    - Request Body Schema:

        ```javascript
            {
                name?: string,
            }
        ```

    - Response:

        ```json
            {
                "success":true,
                "message":"Tenant updated successfully.",
                "data":[],
                "errors":[]
            }
        ```

6. Register tenant
    - Endpoint: POST /tenant
    - Request Body Schema:

        ```javascript
            {
                name: string,
            }
        ```

    - Response:

        ```json
            {
                "success":true,
                "message": "Tenant registered successfully.",
                "data": [],
                "errors": []
            }
        ```

## User APIs

1. List users

   - Endpoint: GET /tenant/:tenantId/user/list:page?/:perPage?
   - Response:

        ```json
            {
                "success":true,
                "message":"Tenants retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "firstName": "john",
                        "lastName": "doe",
                        "email": "john.doe@example.com",
                        "phone": "+225 0000000000",
                        "phone2": null,
                        
                    },
                    
                ],
                "errors":[]
            }
       ```

2. Retrieve other user
    - Endpoint: GET /tenant/:tenantId/user/:userId
    - Response:

        ```json
            {
                "id": 1,
                "firstName": "john",
                "lastName": "doe",
                "email": "john.doe@example.com",
                "phone": "+225 0000000000",
                "phone2": null,
                
            },
        ```

3. Retrieve user
    - Endpoint: GET /user
    - Response:

        ```json
            {
                "id": 1,
                "firstName": "john",
                "lastName": "doe",
                "email": "john.doe@example.com",
                "phone": "+225 0000000000",
                "phone2": null,
                
            },
        ```

4. Remove user
   - Endpoint: DELETE /user
   - Response:
  
        ```json
            {
                "success":true,
                "message":"User deleted successfully.",
                "data":[],
                "errors":[]
            }
        ```

5. Update user
    - Endpoint: PUT /user/
    - Request Body Schema:

        ```javascript
            {
                lastName?: "doe",
                email?: "john.doe@example.com",
                phone2?: "+2251111111111"
            },
        ```

    - Response:

        ```json
            {
                "success":true,
                "message":"uSER updated successfully.",
                "data":[],
                "errors":[]
            }
        ```

## Transaction APIs

1. List other transactions

   - Endpoint: GET /tenant/:tenantId/user/list:page?/:perPage?
   - Response:

        ```json
            {
                "success":true,
                "message":"Transactions retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "paymentMethodType": "MM",
                        "amount": 123.5,
                        "recipient": 2,
                        "sender": 2,
                        "reason": "Deposit on my wallet",
                        "transactionId": "aba009c6-4c2e-4c0d-82e7-561709085d4b",
                        "status": "ACCEDPTED",
                        "operator": "OM",
                        "phone": "+225 0000000000",
                    },
                    
                ],
                "errors":[]
            }
       ```

2. List transactions

   - Endpoint: GET /tenant/:tenantId/user/list:page?/:perPage?
   - Response:

        ```json
            {
                "success":true,
                "message":"Transactions retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "paymentMethodType": "MM",
                        "amount": 123.5,
                        "recipient": 2,
                        "sender": 2,
                        "reason": "Deposit on my wallet",
                        "transactionId": "aba009c6-4c2e-4c0d-82e7-561709085d4b",
                        "status": "ACCEDPTED",
                        "operator": "OM",
                        "phone": "+225 0000000000",
                    },
                    
                ],
                "errors":[]
            }
       ```

3. Retrive transactions

   - Endpoint: GET /tenant/:tenantId/user/list:page?/:perPage?
   - Response:

        ```json
            {
                "success":true,
                "message":"Transactions retrieved successfully.",
                "data":[
                    {
                        "id": 1,
                        "paymentMethodType": "MM",
                        "amount": 123.5,
                        "recipient": 2,
                        "sender": 2,
                        "reason": "Deposit on my wallet",
                        "transactionId": "aba009c6-4c2e-4c0d-82e7-561709085d4b",
                        "status": "ACCEDPTED",
                        "operator": "OM",
                        "phone": "+225 0000000000",
                    },
                    
                ],
                "errors":[]
            }
       ```

4. Make deposit
    - Endpoint: POST /tenant
    - Request Body Schema:

        ```javascript
            {
                paymentMethodTypeCodename: string, // MM: Mobile Money | CrC: Credit Card | CC: Crypto Currency
                amount: number,
                currency: string, // USD | USDC
                transactionId: string, // UUID V4

                // required if paymentMethodTypeCodename equal to CC
                address: string, // just an example

                // required if paymentMethodTypeCodename equal to CrC
                customerName: string,
                customerSurname: string,
                customerEmail: string,
                customerPhoneNumber: string,
                customerAddress: string,
                customerCity: string,
                customerCountry: string,
                customerState: string,
                customerZipCode: string,
            }
        ```

    - Response:

        ```json
            {
                "success":true,
                "message": "Transaction in treatement.",
                "data": [],
                "errors": []
            }
        ```

<!-- 
## Account Type API

1. Register account type
    - Endpoint: POST /account-type/
    - Request Body Schema:

        ```json
            {
                name: string,
                description?: string,
                roles: number[],
                permissions?: number[]
            }
        ```

    - Response:

        ```json
            {
                "success":true,
                "message":"Account type registered successfully.",
                "data":[],
                "errors":[]
            }
        ``` -->
