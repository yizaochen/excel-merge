import uvicorn
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_, true
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from models import Order
import io
import pandas as pd

from database import engine, SessionLocal
from models import Order, Base


app = FastAPI()
Base.metadata.create_all(bind=engine)

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:3000"  # React frontend alternative
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderCreate(BaseModel):
    OrderNumber: str
    OrderDate: date
    CustomerName: str
    PhoneNumber: Optional[str] = None
    Email: Optional[str] = None
    ProductID: str
    ProductName: str
    Quantity: int
    ProductType: Optional[str] = None
    DeliveryMethod: Optional[str] = None
    BatchID: Optional[str] = None


class OrderUpdate(BaseModel):
    OrderNumber: Optional[str] = None
    OrderDate: Optional[date] = None
    CustomerName: Optional[str] = None
    PhoneNumber: Optional[str] = None
    Email: Optional[str] = None
    ProductID: Optional[str] = None
    ProductName: Optional[str] = None
    Quantity: Optional[int] = None
    ProductType: Optional[str] = None
    DeliveryMethod: Optional[str] = None
    BatchID: Optional[str] = None


class OrderQuery(BaseModel):
    BatchID: Optional[str] = None
    OrderNumber: Optional[str] = None
    CustomerName: Optional[str] = None
    ProductName: Optional[str] = None
    StartDate: Optional[date] = None
    EndDate: Optional[date] = None


def get_date(date_str: str) -> date:
    """
    input format: 2023-07-05 14:46:01
    """
    return date.fromisoformat(date_str.split(' ')[0])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/orders/", response_model=OrderCreate)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = Order(**order.model_dump())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


@app.get("/orders/{order_id}", response_model=OrderCreate)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.OrderID == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@app.put("/orders/{order_id}", response_model=OrderCreate)
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.OrderID == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    for key, value in order.model_dump(exclude_unset=True).items():
        setattr(db_order, key, value)
    db.commit()
    db.refresh(db_order)
    return db_order


@app.delete("/orders/{order_id}", response_model=OrderCreate)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.OrderID == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(db_order)
    db.commit()
    return db_order


@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...), batch_id: str = Form(...), db: Session = Depends(get_db)):
    total_rows_processed = 0
    for file in files:
        content = await file.read()
        df = pd.read_excel(io.BytesIO(content))
        for _, row in df.iterrows():
            order_date = row['訂單日期'].date()
            order = Order(
                OrderNumber=row['訂單號碼'],
                OrderDate=order_date,
                CustomerName=row['顧客'],
                PhoneNumber=row.get('電話號碼'),
                Email=row.get('電郵'),
                ProductID=row['商品貨號'],
                ProductName=row['商品名稱'],
                Quantity=row['數量'],
                ProductType=row.get('商品類型'),
                DeliveryMethod=row.get('送貨方式'),
                BatchID=batch_id
            )
            db.add(order)
        total_rows_processed += len(df)
    db.commit()
    return {"filenames": [file.filename for file in files], "rows_processed": total_rows_processed}


@app.get("/find/")
def recommend(column_name: str, keyword: str, db: Session = Depends(get_db)):
    if column_name not in ['BatchID', 'OrderNumber', 'CustomerName', 'ProductName']:
        raise HTTPException(status_code=400, detail="Invalid column name")
    results = db.query(Order).filter(getattr(Order, column_name).like(f'%{keyword}%')).all()
    data = [getattr(result, column_name) for result in results]
    data = list(set(data)) # make results unique, not duplicate
    return data


@app.post("/query/")
def query_orders(query: OrderQuery, db: Session = Depends(get_db)):
    filters = []
    if query.BatchID:
        filters.append(Order.BatchID == query.BatchID)
    if query.OrderNumber:
        filters.append(Order.OrderNumber == query.OrderNumber)
    if query.CustomerName:
        filters.append(Order.CustomerName == query.CustomerName)
    if query.ProductName:
        filters.append(Order.ProductName == query.ProductName)
    if query.StartDate:
        filters.append(Order.OrderDate >= query.StartDate)
    if query.EndDate:
        filters.append(Order.OrderDate <= query.EndDate)

    if filters:
        results = db.query(Order).filter(and_(*filters)).all()
    else:
        results = db.query(Order).filter(true()).all()
        
    return results


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)