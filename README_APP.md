# Column L Analysis Web Application

A modern web application built with Flask that analyzes Excel files for Enfra and SMS LD distribution in Column L.

## 🚀 Features

- **Drag & Drop Upload**: Easy file upload with drag and drop support
- **Default File Analysis**: Analyze the default DB.xlsx file with one click
- **Interactive Visualizations**: Beautiful pie charts and bar charts
- **Real-time Statistics**: Live count and percentage calculations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Gradient backgrounds and smooth animations

## 📋 Requirements

- Python 3.7 or higher
- Flask
- pandas
- matplotlib
- openpyxl

## 🔧 Installation

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python app.py
   ```

3. **Access the App**:
   Open your browser and go to: `http://localhost:5000`

## 💡 Usage

### Option 1: Upload Excel File
1. Click "Choose File" or drag and drop your Excel file
2. The app will automatically analyze Column L
3. View the results with interactive charts

### Option 2: Analyze Default File
1. Click "Analyze Default DB.xlsx" button
2. The app will analyze the DB.xlsx file in the same directory
3. View the results instantly

## 📊 What It Analyzes

The application counts occurrences in Column L:
- **Enfra**: Entries containing "Enfra"
- **SMS LD**: Entries containing "SMS LD" or "SMS-LD"
- **Others**: All other entries including empty cells

## 🎨 Features

- **Statistics Cards**: Display counts and percentages
- **Pie Chart**: Visual distribution of categories
- **Bar Chart**: Side-by-side comparison
- **Responsive Design**: Adapts to any screen size
- **Error Handling**: Clear error messages for issues

## 🔒 Security

- Maximum file size: 16MB
- Only accepts Excel files (.xlsx, .xls)
- Temporary file cleanup after processing

## 🛠️ Technical Stack

- **Backend**: Flask (Python)
- **Data Processing**: pandas
- **Visualization**: matplotlib
- **Frontend**: HTML5, CSS3, JavaScript

## 📁 File Structure

```
RMS/
├── app.py                  # Flask application
├── templates/
│   └── index.html         # Web interface
├── uploads/               # Temporary upload folder
├── requirements.txt       # Python dependencies
└── DB.xlsx               # Default data file (optional)
```

## 🎯 Example Output

The app provides:
- **Enfra Count**: Number of Enfra entries
- **SMS LD Count**: Number of SMS LD entries
- **Others Count**: Number of other entries
- **Total Rows**: Total number of rows in the file
- **Visual Charts**: Pie chart and bar chart representations

## 🐛 Troubleshooting

**Issue**: App won't start
- **Solution**: Make sure all dependencies are installed: `pip install -r requirements.txt`

**Issue**: "Column L not found"
- **Solution**: Ensure your Excel file has at least 12 columns (A-L)

**Issue**: Charts not displaying
- **Solution**: Check that matplotlib is properly installed

## 📝 Notes

- The app runs on `http://localhost:5000` by default
- Press `CTRL+C` in the terminal to stop the server
- Uploaded files are automatically deleted after processing
- The app uses a non-interactive matplotlib backend for server rendering

## 🚀 Future Enhancements

- Support for multiple columns
- Export results to PDF
- Historical data tracking
- Custom category definitions
- Advanced filtering options

## 📄 License

This project is for internal use.

## 👨‍💻 Author

Created for SMS LD Dashboard Analysis

---

**Enjoy analyzing your data! 📊✨**
