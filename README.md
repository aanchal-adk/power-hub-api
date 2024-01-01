# Power Hub API

The Power Hub API provides two main APIs, one to store a list of batteries into the MongoDB database and the other to fetch the list applying filters and search keywords.

## API Endpoints

### GET /batteries

Fetches the list of batteries based on filter and search criteria.

#### Optional Query Parameters

- `pc_start`: Filters the list with postal code greater than or equal to pc_start.
- `pc_end`: Filters the list with postal code less than or equal to pc_end.
- `gte_cap`: Filters the list with  capacity greater than or equal to gte_cap.
- `lte_cap`: Filters the list with  capacity less than or equal to lte_cap.
- `search`: Searches for batteries based on a keyword.


### POST /batteries

Stores a list of batteries into the database.

#### Body format 

```
[
    {
        name: 'battery_name',
        capacity: 1000,
        postalCode: 45000
    },
    .
    .
    .
]
```




## Setup

1. After cloning the repo, install npm packages:

    ```shell
    npm install
    ```

2. Create .env file from provided .env.example

    ```shell
    cp .env.example .env
    ```

3. Update DB_CONNECTION_STRING with your mongodb connection string

4. Start the server:

    ```shell
    npm run dev
    ```


