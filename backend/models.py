from sqlalchemy import Column, Integer, String, Date, Index
from database import Base


class Order(Base):
    __tablename__ = 'Order'

    OrderID = Column(Integer, primary_key=True, autoincrement=True)
    OrderNumber = Column(String(50), nullable=False) # 訂單號碼
    OrderDate = Column(Date, nullable=False) # 訂單日期
    CustomerName = Column(String(255), nullable=False) # 顧客
    PhoneNumber = Column(String(20)) # 電話號碼
    Email = Column(String(255)) # 電郵
    ProductID = Column(String(255), index=True) # 商品貨號
    ProductName = Column(String(255), nullable=False) # 商品名稱
    Quantity = Column(Integer, nullable=False) # 數量
    ProductType = Column(String(100)) # 商品類型
    DeliveryMethod = Column(String(100), index=True) # 送貨方式
    BatchID = Column(String(50), index=True)

    __table_args__ = (
        Index('ix_CustomerName', 'CustomerName'),
        Index('ix_BatchID', 'BatchID'),
        Index('ix_ProductID', 'ProductID'),
        Index('ix_DeliveryMethod', 'DeliveryMethod')
    )