"""
Column L Analysis Web Application
A Flask-based web app for analyzing Excel data and displaying interactive charts
"""

from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import os
import io
import base64
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def analyze_excel_data(file_path):
    """Analyze column L for Enfra and SMS LD counts"""
    try:
        # Read Excel file
        df = pd.read_excel(file_path)
        
        # Find column L
        columns = df.columns.tolist()
        column_l_data = None
        column_l_name = None
        
        if 'L' in columns:
            column_l_data = df['L']
            column_l_name = 'L'
        elif len(columns) > 11:
            column_l_data = df.iloc[:, 11]
            column_l_name = columns[11]
        else:
            return None, "Column L not found in the dataset"
        
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
        
        # Get unique values breakdown
        unique_values = column_l_data.value_counts().head(10).to_dict()
        
        result = {
            'enfra_count': enfra_count,
            'sms_ld_count': sms_ld_count,
            'other_count': other_count,
            'total_rows': len(df),
            'column_name': column_l_name,
            'unique_values': unique_values
        }
        
        return result, None
        
    except Exception as e:
        return None, str(e)

def create_pie_chart(enfra_count, sms_ld_count, other_count):
    """Create a pie chart and return as base64 encoded image"""
    labels = ['Enfra', 'SMS LD', 'Others']
    sizes = [enfra_count, sms_ld_count, other_count]
    colors = ['#ff9999', '#66b3ff', '#99ff99']
    explode = (0.1, 0.1, 0.05)
    
    fig, ax = plt.subplots(figsize=(10, 8))
    wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, 
                                       autopct='%1.1f%%', startangle=90, 
                                       explode=explode, shadow=True,
                                       textprops={'fontsize': 12, 'fontweight': 'bold'})
    
    for w in wedges:
        w.set_linewidth(3)
        w.set_edgecolor('white')
    
    ax.set_title('Column L Analysis - Enfra & SMS LD Distribution', 
                  fontsize=16, fontweight='bold', pad=20)
    
    # Convert to base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_base64

def create_bar_chart(enfra_count, sms_ld_count, other_count):
    """Create a bar chart and return as base64 encoded image"""
    labels = ['Enfra', 'SMS LD', 'Others']
    sizes = [enfra_count, sms_ld_count, other_count]
    colors = ['#ff9999', '#66b3ff', '#99ff99']
    
    fig, ax = plt.subplots(figsize=(10, 8))
    bars = ax.bar(labels, sizes, color=colors, alpha=0.8, edgecolor='black', linewidth=2)
    ax.set_title('Count Comparison', fontsize=16, fontweight='bold')
    ax.set_ylabel('Count', fontsize=12)
    
    # Add value labels on bars
    for bar, size in zip(bars, sizes):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{size}', ha='center', va='bottom', fontweight='bold', fontsize=12)
    
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, max(sizes) * 1.1 if max(sizes) > 0 else 10)
    
    # Convert to base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    
    return img_base64

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze uploaded Excel file"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith(('.xlsx', '.xls')):
        return jsonify({'error': 'Please upload an Excel file (.xlsx or .xls)'}), 400
    
    try:
        # Save uploaded file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"upload_{timestamp}.xlsx"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze the file
        result, error = analyze_excel_data(filepath)
        
        if error:
            return jsonify({'error': error}), 400
        
        # Create charts
        pie_chart = create_pie_chart(result['enfra_count'], result['sms_ld_count'], result['other_count'])
        bar_chart = create_bar_chart(result['enfra_count'], result['sms_ld_count'], result['other_count'])
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'data': result,
            'pie_chart': pie_chart,
            'bar_chart': bar_chart
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/analyze-default')
def analyze_default():
    """Analyze the default DB.xlsx file"""
    default_file = 'DB.xlsx'
    
    if not os.path.exists(default_file):
        return jsonify({'error': 'DB.xlsx file not found in the application directory'}), 404
    
    try:
        # Analyze the file
        result, error = analyze_excel_data(default_file)
        
        if error:
            return jsonify({'error': error}), 400
        
        # Create charts
        pie_chart = create_pie_chart(result['enfra_count'], result['sms_ld_count'], result['other_count'])
        bar_chart = create_bar_chart(result['enfra_count'], result['sms_ld_count'], result['other_count'])
        
        return jsonify({
            'success': True,
            'data': result,
            'pie_chart': pie_chart,
            'bar_chart': bar_chart
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

if __name__ == '__main__':
    print("🚀 Starting Column L Analysis Web Application...")
    print("📊 Access the app at: http://localhost:5000")
    print("Press CTRL+C to quit")
    app.run(debug=True, host='0.0.0.0', port=5000)
