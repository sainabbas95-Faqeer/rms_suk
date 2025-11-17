"""
Column L Analysis with 3D Pie Chart
Counts 'Enfra' and 'SMS LD' occurrences in column L and displays them in a 3D pie chart
"""

import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import warnings
warnings.filterwarnings('ignore')

def index():
    """RMS Offline Data Sukkur"""
    
    try:
        print("📊 Analyzing Column L for Enfra & SMS LD")
        print("=" * 45)
        
        # Read Excel file
        df = pd.read_excel('DB.xlsx')
        print(f"✅ Successfully loaded Excel file with {len(df)} rows")
        
        # Check if column L exists
        columns = df.columns.tolist()
        print(f"Available columns: {columns}")
        
        # Find column L (could be index 11 or named 'L')
        column_l_data = None
        column_l_name = None
        
        if 'L' in columns:
            column_l_data = df['L']
            column_l_name = 'L'
        elif len(columns) > 11:  # Column L would be index 11 (0-based)
            column_l_data = df.iloc[:, 11]
            column_l_name = columns[11]
        else:
            print("❌ Column L not found in the dataset")
            return
        
        print(f"\n📋 Analyzing column: {column_l_name}")
        print(f"Total values in column: {len(column_l_data)}")
        
        # Count occurrences
        enfra_count = 0
        sms_ld_count = 0
        other_count = 0
        
        for value in column_l_data:
            if pd.isna(value):
                other_count += 1
            else:
                value_str = str(value).strip().upper()
                if 'ENFRA' in value_str:
                    enfra_count += 1
                elif 'SMS LD' in value_str or 'SMS-LD' in value_str:
                    sms_ld_count += 1
                else:
                    other_count += 1
        
        print(f"\n📈 COUNT RESULTS:")
        print(f"Enfra: {enfra_count}")
        print(f"SMS LD: {sms_ld_count}")
        print(f"Others: {other_count}")
        
        # Create 3D Pie Chart
        create_3d_pie_chart(enfra_count, sms_ld_count, other_count)
        
        # Show detailed breakdown
        print(f"\n🔍 DETAILED BREAKDOWN:")
        unique_values = column_l_data.value_counts()
        print(unique_values.head(10))
        
        return enfra_count, sms_ld_count, other_count
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def create_3d_pie_chart(enfra_count, sms_ld_count, other_count):
    """Create a 3D pie chart for the counts"""
    
    # Data for pie chart
    labels = ['Enfra', 'SMS LD', 'Others']
    sizes = [enfra_count, sms_ld_count, other_count]
    colors = ['#ff9999', '#66b3ff', '#99ff99']
    explode = (0.1, 0.1, 0.05)  # explode slices
    
    # Create figure with 3D effect
    fig = plt.figure(figsize=(12, 8))
    
    # Main 3D-style pie chart
    ax1 = fig.add_subplot(121)
    wedges, texts, autotexts = ax1.pie(sizes, labels=labels, colors=colors, 
                                       autopct='%1.1f%%', startangle=90, 
                                       explode=explode, shadow=True,
                                       textprops={'fontsize': 12, 'fontweight': 'bold'})
    
    # Enhance 3D appearance
    for w in wedges:
        w.set_linewidth(3)
        w.set_edgecolor('white')
    
    ax1.set_title('Column L Analysis\nEnfra & SMS LD Distribution', 
                  fontsize=16, fontweight='bold', pad=20)
    
    # Add a bar chart for comparison
    ax2 = fig.add_subplot(122)
    bars = ax2.bar(labels, sizes, color=colors, alpha=0.8, edgecolor='black', linewidth=2)
    ax2.set_title('Count Comparison', fontsize=14, fontweight='bold')
    ax2.set_ylabel('Count', fontsize=12)
    
    # Add value labels on bars
    for bar, size in zip(bars, sizes):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{size}', ha='center', va='bottom', fontweight='bold')
    
    # Style the bar chart
    ax2.grid(True, alpha=0.3)
    ax2.set_ylim(0, max(sizes) * 1.1)
    
    plt.tight_layout()
    
    # Save the chart
    plt.savefig('column_l_3d_pie_chart.png', dpi=300, bbox_inches='tight')
    print(f"📊 3D Pie Chart saved as 'column_l_3d_pie_chart.png'")
    
    plt.show()

def create_enhanced_3d_visualization(enfra_count, sms_ld_count, other_count):
    """Create an enhanced 3D visualization"""
    
    fig = plt.figure(figsize=(15, 10))
    
    # Create 3D pie chart using 3D plotting
    ax = fig.add_subplot(111, projection='3d')
    
    # Data
    labels = ['Enfra', 'SMS LD', 'Others']
    sizes = np.array([enfra_count, sms_ld_count, other_count])
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    
    # Create multiple layers for 3D effect
    layers = 5
    for i in range(layers):
        z = i * 0.1
        ax.pie(sizes, labels=labels if i == layers-1 else None, 
               colors=colors, autopct='%1.1f%%' if i == layers-1 else None,
               startangle=90, radius=1-i*0.05,
               textprops={'fontsize': 10, 'fontweight': 'bold'})
    
    ax.set_title('3D Column L Analysis\nEnfra vs SMS LD Distribution', 
                 fontsize=16, fontweight='bold', pad=30)
    
    plt.savefig('enhanced_3d_pie_chart.png', dpi=300, bbox_inches='tight')
    plt.show()

if __name__ == "__main__":
    print("🚀 Starting Column L Analysis...")
    result = analyze_column_l()
    
    if result:
        enfra_count, sms_ld_count, other_count = result
        print(f"\n✅ Analysis Complete!")
        print(f"📊 Results: Enfra={enfra_count}, SMS LD={sms_ld_count}, Others={other_count}")
        
        # Create enhanced 3D visualization if matplotlib supports it
        try:
            create_enhanced_3d_visualization(enfra_count, sms_ld_count, other_count)
        except:
            print("📌 Enhanced 3D visualization not available, using standard pie chart")