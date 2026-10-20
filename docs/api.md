# REST API Documentation & Endpoint Reference

The RestaurantIQ backend exposes versioned, high-performance REST APIs compliant with the OpenAPI 3.1 standard.

Interactive API Explorer: [http://localhost:8000/docs](http://localhost:8000/docs)  
Alternative ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 1. Global Conventions & Standards

- **Base URL**: `/api/v1`
- **Authentication**: JWT Bearer token passed in the HTTP Authorization header:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Error Response Schema**:
  ```json
  {
    "detail": "Descriptive error message explaining validation or operational failure"
  }
  ```
- **Standard HTTP Codes**:
  - `200 OK`: Request succeeded.
  - `201 Created`: Resource successfully provisioned.
  - `400 Bad Request`: Validation failure or business logic violation.
  - `401 Unauthorized`: Missing, expired, or invalid JWT bearer token.
  - `403 Forbidden`: RBAC role permission denied.
  - `404 Not Found`: Target resource does not exist.
  - `500 Internal Server Error`: Unhandled server exception.

---

## 2. API Endpoint Directory

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register new restaurant owner account | Public |
| `POST` | `/login` | JSON login returning JWT access & refresh tokens | Public |
| `POST` | `/login/oauth` | OAuth2 form-compatible login for Swagger UI | Public |
| `POST` | `/refresh` | Obtain fresh access token via refresh token | Public |
| `GET` | `/me` | Get currently authenticated user profile | Authenticated |
| `PUT` | `/profile` | Update user name, phone, or password | Authenticated |
| `POST` | `/forgot-password`| Request password recovery instructions | Public |

### Users & RBAC (`/api/v1/users`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/roles` | List all available system roles | Authenticated |
| `GET` | `/` | List staff users in restaurant | Super Admin, Owner, Manager |
| `POST` | `/` | Provision new staff member or manager | Super Admin, Owner, Manager |
| `PUT` | `/{id}` | Update staff role, branch, or active status | Super Admin, Owner |
| `DELETE` | `/{id}` | Deactivate a user account | Super Admin, Owner |

### Restaurants & Multi-Branch (`/api/v1/restaurants`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List accessible restaurants | Authenticated |
| `GET` | `/{id}` | Get restaurant details and tax rate | Authenticated |
| `PUT` | `/{id}` | Update restaurant profile & currency | Super Admin, Owner |
| `GET` | `/{id}/branches` | List branches for restaurant | Authenticated |
| `POST` | `/{id}/branches` | Add a new branch | Super Admin, Owner |
| `GET` | `/branches/{id}/tables`| List dining tables in branch | Authenticated |
| `POST` | `/branches/{id}/tables`| Create a new dining table | Super Admin, Owner, Manager |

### Menu & Recipes (`/api/v1/menu`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | List menu categories | Authenticated |
| `POST` | `/categories` | Create new category | Super Admin, Owner, Manager |
| `GET` | `/items` | List menu items (filters: category, veg, search)| Authenticated |
| `GET` | `/items/{id}` | Get menu item with full recipe ingredients | Authenticated |
| `POST` | `/items` | Create dish with recipe ingredient linkages | Super Admin, Owner, Manager, Chef |
| `PUT` | `/{id}` | Edit dish price, prep time, or recipe | Super Admin, Owner, Manager, Chef |
| `PATCH`| `/{id}/toggle-availability` | Quick toggle dish availability (86/un-86) | Super Admin, Owner, Manager, Chef |
| `GET` | `/ingredients` | List raw ingredients and current stock | Authenticated |
| `POST` | `/ingredients` | Register new raw ingredient | Super Admin, Owner, Manager, Chef |

### Orders & POS (`/api/v1/orders`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List orders (filters: branch, status, search) | Authenticated |
| `POST` | `/` | Place order: auto-calculates tax, deducts recipe stock, notifies kitchen | Authenticated |
| `GET` | `/{id}` | Get complete order details and line items | Authenticated |
| `PATCH`| `/{id}/status` | Advance order status (NEW &rarr; PREPARING &rarr; READY &rarr; SERVED &rarr; COMPLETED) | Authenticated |

### Kitchen Display System (`/api/v1/kitchen`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/queue` | Get live kitchen queue (NEW, PREPARING, READY) with prep timers | Authenticated |
| `POST` | `/orders/{id}/progress`| 1-click status progression for kitchen touch displays | Super Admin, Owner, Manager, Chef, Staff |

### Inventory & Procurement (`/api/v1/inventory`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | List ingredients with status: HEALTHY, LOW, CRITICAL, EXPIRED | Authenticated |
| `POST` | `/transactions` | Record manual adjustment, delivery, or waste | Super Admin, Owner, Manager, Chef |
| `GET` | `/transactions` | List chronological inventory ledger | Authenticated |
| `GET` | `/purchase-orders` | List purchase orders with line items | Authenticated |
| `POST` | `/purchase-orders` | Create new PO for supplier | Super Admin, Owner, Manager, Chef |
| `PATCH`| `/purchase-orders/{id}/receive` | Receive PO and automatically increment ingredient stock | Super Admin, Owner, Manager, Chef |

### AI Demand Forecasting (`/api/v1/forecast`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/item/{id}` | Execute Scikit-learn Gradient Boosting forecast for dish (7-day predictions + MAE/RMSE) | Authenticated |
| `POST` | `/train-all` | Batch train forecast models for all dishes in branch | Super Admin, Owner, Manager |

### AI Inventory Recommendations (`/api/v1/recommendations`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/inventory` | Compute optimal purchase quantities using current stock, safety buffer, and lead time | Authenticated |

### AI Business Assistant (`/api/v1/ai`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `POST` | `/assistant` | Answer operational queries grounded in live database metrics & forecast models | Authenticated |

### Anomaly Detection (`/api/v1/anomalies`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List operational & revenue outliers | Authenticated |
| `POST` | `/scan` | Execute Isolation Forest model scan across revenue & waste | Super Admin, Owner, Manager |
| `PATCH`| `/{id}/resolve`| Mark anomaly as reviewed/resolved | Super Admin, Owner, Manager |

### Food Waste Intelligence (`/api/v1/waste`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List recorded food waste incidents | Authenticated |
| `POST` | `/` | Log food waste incident | Super Admin, Owner, Manager, Chef |
| `GET` | `/analytics/insights`| Get cost loss breakdown and AI waste pattern discoveries | Authenticated |

### Reviews & NLP Sentiment (`/api/v1/reviews`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List customer reviews with sentiment tags | Authenticated |
| `POST` | `/` | Ingest review; automatically triggers NLP sentiment & aspect pipeline | Authenticated |
| `GET` | `/analytics/summary`| Get aggregate satisfaction % and aspect scores | Authenticated |

### Executive Analytics & Reports (`/api/v1/analytics`, `/api/v1/reports`)
| Method | Endpoint | Description | Roles Allowed |
| :--- | :--- | :--- | :--- |
| `GET` | `/analytics/dashboard`| Consolidated KPI cards, 14-day trends, velocity items, alerts | Authenticated |
| `GET` | `/reports/sales/csv` | Download detailed sales tickets CSV | Super Admin, Owner, Manager |
| `GET` | `/reports/inventory/csv`| Download inventory valuation CSV | Super Admin, Owner, Manager, Chef |
| `GET` | `/reports/audit-logs` | Retrieve immutable system audit trail | Super Admin, Owner |
