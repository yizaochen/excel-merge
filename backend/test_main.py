import pytest
import io
import datetime
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pandas as pd
from database import Base
from main import app, get_db
from models import Order 


# Point to the test database
DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Fixture to create and drop the test database
@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(setup_database):
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

def test_create_order(client):
    response = client.post("/orders/", json={
        "OrderNumber": "12345",
        "OrderDate": "2024-06-14",
        "CustomerName": "John Doe",
        "PhoneNumber": "1234567890",
        "Email": "johndoe@example.com",
        "ProductID": "ABC123",
        "ProductName": "Widget",
        "Quantity": 10,
        "ProductType": "Gadget",
        "DeliveryMethod": "Courier",
        "BatchID": "BATCH001"
    })
    assert response.status_code == 200
    assert response.json()["OrderNumber"] == "12345"

def test_read_order(client):
    response = client.get("/orders/1")
    assert response.status_code == 200
    assert response.json()["OrderNumber"] == "12345"

def test_update_order(client):
    response = client.put("/orders/1", json={"Quantity": 15})
    assert response.status_code == 200
    assert response.json()["Quantity"] == 15

def test_delete_order(client):
    response = client.delete("/orders/1")
    assert response.status_code == 200
    assert response.json()["OrderNumber"] == "12345"

    response = client.get("/orders/1")
    assert response.status_code == 404

def test_upload_files(client):
    date = "2023-07-05 14:46:01"

    df = pd.DataFrame({
        '訂單號碼': ['12345'],
        '訂單日期': [pd.Timestamp('2023-07-05 14:46:01')],
        '顧客': ['John Doe'],
        '電話號碼': ['1234567890'],
        '電郵': ['johndoe@example.com'],
        '商品貨號': ['ABC123'],
        '商品名稱': ['Widget'],
        '數量': [10],
        '商品類型': ['Gadget'],
        '送貨方式': ['Courier']
    })
    with io.BytesIO() as buffer:
        df.to_excel(buffer, index=False)
        buffer.seek(0)
        files = [('files', ('test.xlsx', buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))]
        response = client.post("/upload/", data={'batch_id': 'BATCH001'}, files=files)
    assert response.status_code == 200
    assert response.json() == {"filenames": ["test.xlsx"], "rows_processed": 1}


def test_recommend_valid(client):
    # Add mock data to the database for testing
    db = TestingSessionLocal()
    new_order = Order(
        OrderNumber="12345",
        OrderDate=datetime.date(2024, 6, 14),
        CustomerName="John Doe",
        PhoneNumber="1234567890",
        Email="johndoe@example.com",
        ProductID="ABC123",
        ProductName="Widget",
        Quantity=10,
        ProductType="Gadget",
        DeliveryMethod="Courier",
        BatchID="BATCH001"
    )
    db.add(new_order)
    db.commit()
    response = client.get("/find/?column_name=CustomerName&keyword=John")
    data = response.json()
    assert response.status_code == 200
    assert data[0] == "John Doe"

def test_recommend_invalid_column(client):
    response = client.get("/find/?column_name=InvalidColumn&keyword=Test")
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid column name"}

def test_recommend_no_results(client):
    response = client.get("/find/?column_name=CustomerName&keyword=NonExistent")
    assert response.status_code == 200
    assert response.json() == []


# Additional test cases for query_orders
def test_query_orders_no_params(client):
    response = client.post("/query/", json={})
    assert response.status_code == 200
    assert len(response.json()) > 0  # Assuming there are orders in the database

def test_query_orders_by_batch_id(client):
    response = client.post("/query/", json={"BatchID": "BATCH001"})
    assert response.status_code == 200
    assert all(order["BatchID"] == "BATCH001" for order in response.json())

def test_query_orders_by_order_number(client):
    response = client.post("/query/", json={"OrderNumber": "12345"})
    assert response.status_code == 200
    assert all(order["OrderNumber"] == "12345" for order in response.json())

def test_query_orders_by_customer_name(client):
    response = client.post("/query/", json={"CustomerName": "John Doe"})
    assert response.status_code == 200
    assert all(order["CustomerName"] == "John Doe" for order in response.json())

def test_query_orders_by_product_name(client):
    response = client.post("/query/", json={"ProductName": "Widget"})
    assert response.status_code == 200
    assert all(order["ProductName"] == "Widget" for order in response.json())

def test_query_orders_by_date_range(client):
    response = client.post("/query/", json={"StartDate": "2024-06-01", "EndDate": "2024-06-30"})
    assert response.status_code == 200
    assert all(
        "2024-06-01" <= order["OrderDate"] <= "2024-06-30"
        for order in response.json()
    )

def test_query_orders_multiple_params(client):
    response = client.post("/query/", json={
        "CustomerName": "John Doe",
        "ProductName": "Widget",
        "StartDate": "2024-06-01",
        "EndDate": "2024-06-30"
    })
    assert response.status_code == 200
    assert all(
        order["CustomerName"] == "John Doe" and
        order["ProductName"] == "Widget" and
        "2024-06-01" <= order["OrderDate"] <= "2024-06-30"
        for order in response.json()
    )