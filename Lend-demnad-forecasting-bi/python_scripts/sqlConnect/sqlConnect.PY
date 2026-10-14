import pandas as pd
import os
from sqlalchemy import create_engine


db_user = 'postgres'
db_password = ' ' 
db_name = 'forecast_portfolio' 
db_host = 'localhost'
db_port = '5432'

historical_folder = r"C:\Users\asd\OneDrive\Desktop\MODEL\product_sales_month"

engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

all_history = []

for file in os.listdir(historical_folder):
    if not file.endswith('.xlsx'):
        continue
        
    if "TOTAL_SALES" in file:
        continue
        
    file_path = os.path.join(historical_folder, file)
    
    try:
        df = pd.read_excel(file_path)
        
        model_name = file.replace('.xlsx', '').replace('_', ' ')
        
        df['lens_model'] = model_name
        
        df.columns = ['sales_date', 'total_sales', 'lens_model']
        
        all_history.append(df)
        print(f"Processed Historical Data for: {model_name}")
        
    except Exception as e:
        print(f"Error processing {file}: {e}")

if all_history:
    master_history_df = pd.concat(all_history, ignore_index=True)
    master_history_df.to_sql('historical_sales', engine, if_exists='replace', index=False)
    print(f"\nSUCCESS: Uploaded {len(master_history_df)} Historical Sales rows to PostgreSQL!")