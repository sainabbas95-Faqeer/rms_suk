import pandas as pd

# Read the Excel file
df = pd.read_excel("DB.xlsx")

# Get column names
print("Column names:")
for i, col in enumerate(df.columns):
    print(f"{i}: {col}")

print("\n" + "="*50)

# Check if column I exists (index 8)
if len(df.columns) > 8:
    col_i_name = df.columns[8]
    print(f"\nColumn I (index 8): {col_i_name}")
    print(f"\nUnique values in Column I:")
    print(df.iloc[:, 8].value_counts())
    print(f"\nSample data:")
    print(df.iloc[:, 8].head(20))
else:
    print("Column I not found!")
