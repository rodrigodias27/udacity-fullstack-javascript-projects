# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

- [API Requirements](#api-requirements)
  - [API Endpoints](#api-endpoints)
      - [Products](#products)
      - [Users](#users)
      - [Orders](#orders)
  - [API Data Shapes](#api-data-shapes)
      - [Product](#product)
      - [User](#user)
      - [Orders](#orders-1)
      - [OrdersProducts (Auxiliar table)](#ordersproducts-auxiliar-table)
  - [Database Relationship](#database-relationship)
  - [API endpoints (how to use)](#api-endpoints-how-to-use)
    - [POST /users/authenticate/](#post-usersauthenticate)
      - [How to user authentication:](#how-to-user-authentication)
    - [GET /users/](#get-users)
    - [GET /users/:id](#get-usersid)
    - [POST /users/](#post-users)
    - [PUT /users/](#put-users)
    - [DELETE /users/](#delete-users)
    - [GET /products/](#get-products)
    - [GET /products/:id](#get-productsid)
    - [POST /products/](#post-products)
    - [PUT /products/](#put-products)
    - [DELETE /products/](#delete-products)
    - [GET /orders/](#get-orders)
    - [GET /orders/:id](#get-ordersid)
    - [POST /orders/](#post-orders)
    - [GET /orders-active/](#get-orders-active)
    - [GET /orders-complete/](#get-orders-complete)
    - [POST /orders-product/](#post-orders-product)
    - [PUT /orders/](#put-orders)
    - [PUT /orders-product/](#put-orders-product)
    - [DELETE /orders/](#delete-orders)


## API Endpoints
#### Products
- Index
- Show
- Create [token required] [role: admin]
- Update [token required] [role: admin]
- Delete [token required] [role: admin]

#### Users
- Index [token required] [role: admin]
- Show [token required] [role: admin]
- Create [token required] [role: admin]
- Authenticate
- Update [token required] [role: admin, user_id: own_user]
- Delete [token required] [role: admin, user_id: own_user]

#### Orders
- Index [token required] [role: admin]
- Show [token required] [role: admin]
- Create [token required] [role: admin]
- Add products to order [token required] [role: admin, user_id: own_user]
- Update products to order [token required] [role: admin, user_id: own_user]
- Update order [token required] [role: admin, user_id: own_user]
- Current Order by user [token required] [role: admin, user_id: own_user]
- Completed Orders by user [token required] [role: admin, user_id: own_user]
- Delete [token required] [role: admin]

## API Data Shapes
#### Product
- id: number
- name: string
- price: number (cents)
- category: string

#### User
- id: number
- firstName: string
- lastName: string
- password_digest: string
- role (admin or user): string

#### Orders
- id: number
- id of each product in the order: array of numbers
- quantity of each product in the order: array of numbers
- user_id: number
- status of order (active or complete): string

#### OrdersProducts (Auxiliar table)
- id: number
- order_id: id of order
- product_id id of product
- quantity: quantity of product on order

## Database Relationship

![database-relationship](./assets/database-relationship.png)

## API endpoints (how to use)

---
### POST /users/authenticate/
Return a jwt token to authenticate in other endpoints.

Body:
- first_name: first name of user
- last_name: last name of user
- password: password defined on creation

```json
{
  "first_name": "Doctor",
  "last_name": "Who",
  "password": "Trenzalore"
}
```

**Response example**:
- Success `200 OK`
```
jwt_token
```

#### How to user authentication:

Add jwt on headers:
```json
{"Authorization": "Bearer <jwt_token>"}
```
---
### GET /users/
Return all users.

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
[
  {
    "id": 1,
    "first_name": "Doctor",
    "last_name": "Who",
    "password_digest": "<password_digest>",
    "role": "admin"
  },
  {
    "id": 2,
    "first_name": "Clara",
    "last_name": "Oswald",
    "password_digest": "<password_digest>",
    "role": "user",
  }
]
```
---
### GET /users/:id
Return user according to id

Params:
- id: id of user

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "first_name": "Doctor",
  "last_name": "Who",
  "password_digest": "<password_digest>",
  "role": "admin"
}
```
---
### POST /users/
Create an user

Body:
- first_name: first name of user
- last_name: last name of user
- role: give permissions (admin or user)
- password: password to authenticate and get jwt_token

```json
{
  "first_name": "Doctor",
  "last_name": "Who",
  "password": "Tranzalore",
  "role": "admin"
}
```

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "first_name": "Doctor",
  "last_name": "Who",
  "password_digest": "<password_digest>",
  "role": "admin"
}
```
---
### PUT /users/
Update user values

Body:
- user_id: id to be updated
- first_name: first name of user
- last_name: last name of user
- password: password to authenticate and get jwt_token

```json
{
  "user_id": 1,
  "first_name": "Doctor",
  "last_name": "Who",
  "password": "Gallifrey"
}
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "first_name": "Doctor",
  "last_name": "Who",
  "password_digest": "<password_digest>",
  "role": "admin"
}
```
---
### DELETE /users/
Delete user

Body:
- user_id: id to be deleted

```json
{"user_id": 1}
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "first_name": "Doctor",
  "last_name": "Who",
  "password_digest": "<password_digest>",
  "role": "admin"
}
```
---
### GET /products/
Return all products

**Response example**:
- Success `200 OK`
```json
[
  {
    "id": 1,
    "name": "Lego StarWars",
    "price": 5000,
    "category": "Lego"
  },
  {
    "id": 2,
    "name": "Lego Mario",
    "price": 50000,
    "category": "Lego"
  }
]
```
---
### GET /products/:id
Return product according to id

Params:
- id: id of product

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "name": "Lego StarWars",
  "price": 5000,
  "category": "Lego"
}
```
---
### POST /products/
Create a new product

Body:
- name: name of product
- price: price of product in cents
- category: category of product

```json
{
  "name": "Lego StarWars Deluxe",
  "price": 10000,
  "category": "Lego/bricks"
}
```

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 3,
  "name": "Lego StarWars Deluxe",
  "price": 10000,
  "category": "Lego/bricks"
}
```
---
### PUT /products/
Edit a product

Body:
- id: id of product
- name: name of product
- price: price of product in cents
- category: category of product

```json
{
  "id": 1,
  "name": "Lego StarWars Deluxe",
  "price": 10000,
  "category": "Lego/bricks"
}
```

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "name": "Lego StarWars Deluxe",
  "price": 10000,
  "category": "Lego/bricks"
}
```
---
### DELETE /products/
Delete a product

Body:
- id: id of product

```json
{
  "id": 1
}
```

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "name": "Lego StarWars Deluxe",
  "price": 10000,
  "category": "Lego/bricks"
}
```
---
### GET /orders/
Return all orders.

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
[
  {
    "id": 1,
    "products": [ 1 ],
    "quantities": [ 12 ],
    "user_id": 1,
    "status": "active",
  },
  {
    "id": 2,
    "products": [ 2 ],
    "quantities": [ 5 ],
    "user_id": 1,
    "status": "active",
  }
]
```
---
### GET /orders/:id
Return an order according to id

Params:
- id: id of order

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "products": [ 1 ],
  "quantities": [ 12 ],
  "user_id": 1,
  "status": "active",
}
```
### POST /orders/
Create a new order

Body:
- user_id: id of order owner

```json
{ "user_id": 1}
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
{
  "id": 3,
  "products": [ null ],
  "quantities": [ null ],
  "user_id": 1,
  "status": "active",
}
```
---
### GET /orders-active/
Return active orders.


Body:
- user_id: owner of orders

```json
{ "user_id": 1 }
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
[
  {
    "id": 1,
    "products": [ 1 ],
    "quantities": [ 12 ],
    "user_id": 1,
    "status": "active",
  },
  {
    "id": 2,
    "products": [ 2 ],
    "quantities": [ 5 ],
    "user_id": 1,
    "status": "active",
  }
]
```
---
### GET /orders-complete/
Return complete orders

Body:
- user_id: owner of orders

```json
{ "user_id": 1 }
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
[
  {
    "id": 1,
    "products": [ 1 ],
    "quantities": [ 12 ],
    "user_id": 1,
    "status": "complete",
  },
  {
    "id": 2,
    "products": [ 2 ],
    "quantities": [ 5 ],
    "user_id": 1,
    "status": "complete",
  }
]
```
---
### POST /orders-product/
Add product to an order

Body:
- order_id: id of order
- user_id: owner of order
- product_id: id of product
- quantity: quantity to add

```json
{
  "order_id": 1,
  "user_id": 1,
  "product_id": 2,
  "quantity": 10
}
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "products": [ 1, 2 ],
  "quantities": [ 12, 10 ],
  "user_id": 1,
  "status": "active",
}
```
---
### PUT /orders/
Change status of an order

Body:
- order_id: id of order
- user_id: owner of order
- status: (active or complete)

```json
{
  "id": 1,
  "user_id": 1,
  "status": "complete"
}
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "products": [ 1, 2 ],
  "quantities": [ 12, 10 ],
  "user_id": 1,
  "status": "complete",
}
```
---
### PUT /orders-product/
Change product quantity of an order

Body:
- order_id: id of order
- user_id: owner of order
- product_id: id of product
- quantity: new quantity

```json
{
  "order_id": 1,
  "user_id": 1,
  "product_id": 2,
  "quantity": 5
}
```

```Obs.: Needs authentication (role: admin) or jwt_token of user_id```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "products": [ 1, 2 ],
  "quantities": [ 12, 5 ],
  "user_id": 1,
  "status": "active",
}
```
---
### DELETE /orders/
Delete an order

Body:
- id: id of order

```json
{ "id": 1 }
```

```Obs.: Needs authentication (role: admin)```

**Response example**:
- Success `200 OK`
```json
{
  "id": 1,
  "products": [ 1, 2 ],
  "quantities": [ 12, 10 ],
  "user_id": 1,
  "status": "complete",
}
```