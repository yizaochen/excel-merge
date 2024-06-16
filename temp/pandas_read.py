from os import path
import pandas as pd

excel_file = path.join('..', 'data', 'sample1.xlsx')

df = pd.read_excel(excel_file)
for row in df.iterrows():
    print(row)