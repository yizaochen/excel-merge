import React, { useState } from 'react';
import QueryForm from '../components/QueryForm';
import OrderTable from '../components/OrderTable';

function QueryPage() {
    const [orders, setOrders] = useState([]);

    const handleQuery = (query) => {
        // Perform query and update orders
        console.log("handleQuery");
    };

    return (
        <div>
            <h1>Query Orders</h1>
            <QueryForm onQuery={handleQuery} />
            <OrderTable orders={orders} />
        </div>
    );
}

export default QueryPage;
