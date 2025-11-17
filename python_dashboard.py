"""
Excel Data Dashboard - Python Version
A comprehensive dashboard for analyzing Excel data with visualizations
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class ExcelDashboard:
    def __init__(self, file_path="DB.xlsx"):
        """Initialize the dashboard with Excel file"""
        self.file_path = file_path
        self.data = None
        self.sheets = {}
        
    def load_data(self):
        """Load data from Excel file"""
        try:
            # Read all sheets
            excel_file = pd.ExcelFile(self.file_path)
            print(f"📊 Loading data from {self.file_path}")
            print(f"Found sheets: {excel_file.sheet_names}")
            
            for sheet_name in excel_file.sheet_names:
                self.sheets[sheet_name] = pd.read_excel(self.file_path, sheet_name=sheet_name)
                print(f"✅ Loaded sheet '{sheet_name}' with {len(self.sheets[sheet_name])} rows")
            
            # Use first sheet as main data
            self.data = self.sheets[excel_file.sheet_names[0]]
            return True
            
        except Exception as e:
            print(f"❌ Error loading Excel file: {e}")
            return False
    
    def display_basic_info(self):
        """Display basic information about the dataset"""
        if self.data is None:
            print("❌ No data loaded")
            return
            
        print("\n" + "="*60)
        print("📋 DATASET OVERVIEW")
        print("="*60)
        print(f"Shape: {self.data.shape}")
        print(f"Columns: {list(self.data.columns)}")
        print(f"Memory usage: {self.data.memory_usage(deep=True).sum() / 1024:.2f} KB")
        
        print("\n📊 DATA TYPES:")
        print("-" * 30)
        for col, dtype in self.data.dtypes.items():
            null_count = self.data[col].isnull().sum()
            null_pct = (null_count / len(self.data)) * 100
            print(f"{col:20} | {str(dtype):10} | Nulls: {null_count:3} ({null_pct:.1f}%)")
        
        print("\n📈 NUMERICAL STATISTICS:")
        print("-" * 50)
        numeric_data = self.data.select_dtypes(include=[np.number])
        if not numeric_data.empty:
            print(numeric_data.describe())
        else:
            print("No numerical columns found")
            
        print("\n🔤 CATEGORICAL INFO:")
        print("-" * 30)
        categorical_data = self.data.select_dtypes(include=['object'])
        for col in categorical_data.columns:
            unique_count = self.data[col].nunique()
            print(f"{col:20} | Unique values: {unique_count}")
            if unique_count <= 10:
                print(f"  Values: {list(self.data[col].value_counts().head().index)}")
    
    def create_visualizations(self):
        """Create various visualizations"""
        if self.data is None:
            print("❌ No data loaded")
            return
            
        # Set style
        plt.style.use('seaborn-v0_8')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('📊 Data Analysis Dashboard', fontsize=16, fontweight='bold')
        
        # 1. Missing values heatmap
        missing_data = self.data.isnull()
        if missing_data.sum().sum() > 0:
            sns.heatmap(missing_data, cbar=True, ax=axes[0,0], cmap='viridis')
            axes[0,0].set_title('🔍 Missing Values Heatmap')
        else:
            axes[0,0].text(0.5, 0.5, 'No Missing Values', ha='center', va='center', transform=axes[0,0].transAxes)
            axes[0,0].set_title('🔍 Missing Values Check')
        
        # 2. Correlation heatmap (for numerical columns)
        numeric_data = self.data.select_dtypes(include=[np.number])
        if len(numeric_data.columns) > 1:
            correlation = numeric_data.corr()
            sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0, ax=axes[0,1])
            axes[0,1].set_title('🔗 Correlation Matrix')
        else:
            axes[0,1].text(0.5, 0.5, 'Need 2+ Numerical Columns', ha='center', va='center', transform=axes[0,1].transAxes)
            axes[0,1].set_title('🔗 Correlation Analysis')
        
        # 3. Distribution of first numerical column
        if not numeric_data.empty:
            first_numeric = numeric_data.columns[0]
            self.data[first_numeric].hist(bins=20, ax=axes[1,0], alpha=0.7, color='skyblue')
            axes[1,0].set_title(f'📊 Distribution of {first_numeric}')
            axes[1,0].set_xlabel(first_numeric)
            axes[1,0].set_ylabel('Frequency')
        else:
            axes[1,0].text(0.5, 0.5, 'No Numerical Data', ha='center', va='center', transform=axes[1,0].transAxes)
            axes[1,0].set_title('📊 Data Distribution')
        
        # 4. Top categories (for first categorical column)
        categorical_data = self.data.select_dtypes(include=['object'])
        if not categorical_data.empty:
            first_categorical = categorical_data.columns[0]
            top_categories = self.data[first_categorical].value_counts().head(10)
            top_categories.plot(kind='bar', ax=axes[1,1], color='lightcoral')
            axes[1,1].set_title(f'🏆 Top Categories in {first_categorical}')
            axes[1,1].tick_params(axis='x', rotation=45)
        else:
            axes[1,1].text(0.5, 0.5, 'No Categorical Data', ha='center', va='center', transform=axes[1,1].transAxes)
            axes[1,1].set_title('🏆 Category Analysis')
        
        plt.tight_layout()
        plt.show()
    
    def generate_insights(self):
        """Generate automated insights from the data"""
        if self.data is None:
            print("❌ No data loaded")
            return
            
        print("\n" + "="*60)
        print("💡 AUTOMATED INSIGHTS")
        print("="*60)
        
        # Data quality insights
        total_cells = self.data.shape[0] * self.data.shape[1]
        missing_cells = self.data.isnull().sum().sum()
        completeness = ((total_cells - missing_cells) / total_cells) * 100
        
        print(f"📈 Data Completeness: {completeness:.1f}%")
        
        if missing_cells > 0:
            print(f"⚠️  Found {missing_cells} missing values")
            most_missing = self.data.isnull().sum().sort_values(ascending=False).head(3)
            print(f"   Columns with most missing: {dict(most_missing)}")
        
        # Numerical insights
        numeric_data = self.data.select_dtypes(include=[np.number])
        if not numeric_data.empty:
            print(f"\n📊 Numerical Analysis:")
            for col in numeric_data.columns[:3]:  # Top 3 numerical columns
                mean_val = self.data[col].mean()
                median_val = self.data[col].median()
                std_val = self.data[col].std()
                
                print(f"   {col}:")
                print(f"     Mean: {mean_val:.2f}, Median: {median_val:.2f}")
                print(f"     Standard Deviation: {std_val:.2f}")
                
                # Detect outliers
                Q1 = self.data[col].quantile(0.25)
                Q3 = self.data[col].quantile(0.75)
                IQR = Q3 - Q1
                outliers = self.data[(self.data[col] < Q1 - 1.5*IQR) | (self.data[col] > Q3 + 1.5*IQR)]
                if len(outliers) > 0:
                    print(f"     ⚠️  Detected {len(outliers)} potential outliers")
        
        # Categorical insights
        categorical_data = self.data.select_dtypes(include=['object'])
        if not categorical_data.empty:
            print(f"\n🔤 Categorical Analysis:")
            for col in categorical_data.columns[:3]:  # Top 3 categorical columns
                unique_count = self.data[col].nunique()
                most_common = self.data[col].mode().iloc[0] if not self.data[col].mode().empty else "N/A"
                most_common_count = self.data[col].value_counts().iloc[0] if not self.data[col].value_counts().empty else 0
                
                print(f"   {col}:")
                print(f"     Unique values: {unique_count}")
                print(f"     Most common: '{most_common}' ({most_common_count} occurrences)")
    
    def export_summary(self, filename="data_summary.txt"):
        """Export analysis summary to text file"""
        if self.data is None:
            print("❌ No data loaded")
            return
            
        with open(filename, 'w') as f:
            f.write(f"Excel Data Analysis Summary\n")
            f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Source file: {self.file_path}\n")
            f.write("="*60 + "\n\n")
            
            f.write(f"Dataset Shape: {self.data.shape}\n")
            f.write(f"Columns: {', '.join(self.data.columns)}\n\n")
            
            f.write("Column Information:\n")
            f.write("-" * 30 + "\n")
            for col, dtype in self.data.dtypes.items():
                null_count = self.data[col].isnull().sum()
                f.write(f"{col}: {dtype} (Missing: {null_count})\n")
            
            # Add numerical statistics
            numeric_data = self.data.select_dtypes(include=[np.number])
            if not numeric_data.empty:
                f.write(f"\nNumerical Statistics:\n")
                f.write("-" * 30 + "\n")
                f.write(str(numeric_data.describe()))
        
        print(f"📄 Summary exported to {filename}")
    
    def run_dashboard(self):
        """Run the complete dashboard analysis"""
        print("🚀 Starting Excel Data Dashboard Analysis...")
        
        if not self.load_data():
            return
            
        self.display_basic_info()
        self.generate_insights()
        
        # Ask user if they want visualizations
        try:
            show_viz = input("\n📊 Generate visualizations? (y/n): ").lower()
            if show_viz in ['y', 'yes']:
                self.create_visualizations()
        except:
            pass
        
        # Ask user if they want to export summary
        try:
            export = input("\n📄 Export summary to file? (y/n): ").lower()
            if export in ['y', 'yes']:
                self.export_summary()
        except:
            pass
        
        print("\n✅ Dashboard analysis complete!")

if __name__ == "__main__":
    # Create and run dashboard
    dashboard = ExcelDashboard("DB.xlsx")
    dashboard.run_dashboard()