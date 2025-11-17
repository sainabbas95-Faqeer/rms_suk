import pandas as pd
import numpy as np

def examine_excel_file(file_path):
    """
    Examine the Excel file structure and display basic information
    """
    try:
        # Read the Excel file
        excel_file = pd.ExcelFile(file_path)
        
        print("Excel File Analysis")
        print("=" * 50)
        print(f"File: {file_path}")
        print(f"Sheet Names: {excel_file.sheet_names}")
        print()
        
        # Analyze each sheet
        for sheet_name in excel_file.sheet_names:
            print(f"Sheet: {sheet_name}")
            print("-" * 30)
            
            # Read the sheet
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            
            print(f"Shape: {df.shape}")
            print(f"Columns: {list(df.columns)}")
            print("\nData Types:")
            print(df.dtypes)
            print("\nFirst 5 rows:")
            print(df.head())
            print("\nBasic Statistics:")
            print(df.describe())
            print("\nMissing Values:")
            print(df.isnull().sum())
            print("\n" + "="*50 + "\n")
            
    except Exception as e:
        print(f"Error reading Excel file: {e}")

if __name__ == "__main__":
    examine_excel_file("DB.xlsx")