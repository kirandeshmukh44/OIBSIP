# MongoDB and Mongoose: Database Concept Guide

This guide explains the database part of PizzaCraft in simple terms. Use it to understand the project and prepare for a viva.

## 1. What is a database?

A database is the permanent storage of an application. React variables disappear after refresh, but data saved in MongoDB remains available later.

In PizzaCraft, MongoDB saves:

- users and their secure password hashes
- administrators
- customer orders and payment/status information
- ingredient inventory and low-stock thresholds

## 2. Why MongoDB?

MongoDB is a NoSQL document database. Instead of tables and rows, it stores collections and documents.

| SQL database term | MongoDB term | PizzaCraft example |
| --- | --- | --- |
| Database | Database | `pizzacraft` |
| Table | Collection | `users`, `orders`, `inventories` |
| Row | Document | One user or one order |
| Column | Field | `email`, `totalAmount`, `quantity` |
| Primary key | `_id` | MongoDB-generated unique ID |

A user document conceptually looks like:

```js
{
  _id: ObjectId("..."),
  name: "Asha",
  email: "asha@example.com",
  password: "$2b$12$...", // bcrypt hash, never actual password
  isVerified: true,
  createdAt: "2026-08-16T..."
}
```

## 3. MongoDB Atlas

MongoDB Atlas is MongoDB hosted in the cloud. It gives a connection URL (`MONGO_URI`) such as:

```text
mongodb+srv://username:password@cluster.mongodb.net/pizzacraft
```

The backend reads this URL from `server/.env`; it must never be pasted into React or GitHub.

Atlas setup concept:

1. Create a free cluster.
2. Create a database user with username/password.
3. Add your current IP address in Network Access for development.
4. Copy the connection string into `server/.env` as `MONGO_URI`.
5. When the server starts, `config/db.js` calls `mongoose.connect(process.env.MONGO_URI)`.

## 4. What is Mongoose?

Mongoose is an ODM: Object Data Modeling library. It connects Node.js objects to MongoDB documents.

It gives us three important concepts:

1. **Schema**: rules for a document’s fields.
2. **Model**: the code object used to query a collection.
3. **Validation**: prevents invalid data such as a negative quantity.

Example from the Inventory idea:

```js
const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Pizza Bases", "Sauces", "Cheeses", "Vegetables"] },
  quantity: { type: Number, min: 0 },
  threshold: { type: Number, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
```

`timestamps: true` automatically adds `createdAt` and `updatedAt`.

## 5. PizzaCraft models

### User model: `server/src/models/User.js`

Stores account information. Fields include name, email, bcrypt password hash, email verification data and reset-password data.

Important: verification/reset tokens are stored as hashes, with expiry dates. This means a stolen database cannot directly reveal active raw links.

### Admin model: `server/src/models/Admin.js`

Stores only separate administrator accounts. Normal users cannot register with the admin role. Admin login creates a JWT containing `role: "admin"`.

### Order model: `server/src/models/Order.js`

Stores one custom pizza order.

```text
Order
 ├── user                  → ObjectId reference to User
 ├── pizzaBase, sauce, cheese, vegetables
 ├── totalAmount
 ├── paymentStatus         → pending / paid / failed
 ├── orderStatus           → Order Received / In Kitchen / Sent to Delivery
 └── Razorpay order/payment IDs
```

The `user` field is a relationship. It contains the user’s `_id`, not a second copy of their full user record.

### Inventory model: `server/src/models/Inventory.js`

Each document represents one stock item, for example Thin Crust or Onion.

The compound unique index on `(name, category)` prevents creating the same ingredient twice in the same category.

## 6. CRUD: the four basic database operations

| Operation | Meaning | PizzaCraft example |
| --- | --- | --- |
| Create | Insert a new document | `User.create()`, `Order.create()` |
| Read | Find documents | `Order.find()`, `Inventory.findOne()` |
| Update | Change existing document | `findByIdAndUpdate()` |
| Delete | Remove a document | Not exposed in the current UI, to avoid accidental stock deletion |

Examples:

```js
// Read one user
const user = await User.findOne({ email: "asha@example.com" });

// Read all orders newest first
const orders = await Order.find().sort({ createdAt: -1 });

// Safely reduce Onion only if at least one is available
const updated = await Inventory.findOneAndUpdate(
  { name: "Onion", category: "Vegetables", quantity: { $gte: 1 } },
  { $inc: { quantity: -1 } },
  { new: true }
);
```

## 7. Data flow in this application

```text
React page
   ↓ fetch() + JWT
Express route
   ↓
Authentication/validation middleware
   ↓
Controller (business rules)
   ↓
Mongoose model
   ↓
MongoDB Atlas collection
```

For example, creating an order:

```text
Builder.jsx → POST /api/orders → authMiddleware → orderController → Order.create() → orders collection
```

## 8. References and populate

An order contains the user ID, such as:

```js
{ user: ObjectId("65...") }
```

For the admin dashboard, `populate("user", "name email")` replaces that ID with the selected user details. This is similar to joining data in SQL, but it happens in Mongoose.

## 9. Inventory safety and transactions

Inventory must not go below zero. The payment verification uses:

```js
quantity: { $gte: 1 }
```

This updates a stock item only when it has at least one unit.

The project uses a MongoDB transaction during paid-order processing. A transaction means:

```text
Deduct base + deduct sauce + deduct cheese + deduct vegetables + mark order paid
                    all succeed together OR all are reverted
```

Without a transaction, one ingredient could be deducted while a later one fails, creating incorrect stock. MongoDB Atlas replica sets support transactions.

## 10. Security rules to remember

- Never commit `.env`, MongoDB URI, JWT secret, Razorpay secret or email password.
- Never store plaintext passwords; use bcrypt hashing.
- Validate user input at API level, not only in React.
- Protect user routes with JWT middleware.
- Protect admin routes with admin-role middleware.
- Do not trust payment success received only from the browser; verify Razorpay’s signature on the backend.

## 11. Useful MongoDB Compass checks

MongoDB Compass is a desktop GUI for inspecting Atlas data.

After testing, you can inspect these collections:

- `users`: confirm `isVerified` and no plaintext password
- `admins`: confirm only the intended admin exists
- `orders`: view status and payment fields
- `inventories`: verify quantity decreases after a verified paid order

Do not manually edit production data unless you understand the effect; use the admin API/UI where possible.
