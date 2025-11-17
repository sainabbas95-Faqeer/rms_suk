// Regional Dashboard JavaScript - Shared across Jacobabad, Larkana, and Sukkur pages
// This script handles data loading, filtering, and visualization for regional pages

// Set the date in header (previous day) - matches main page
function setPreviousDate() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[yesterday.getDay()];
    const monthName = months[yesterday.getMonth()];
    const date = yesterday.getDate();
    const year = yesterday.getFullYear();
    
    const formattedDate = `${dayName}, ${monthName} ${date < 10 ? '0' + date : date}, ${year}`;
    const displayElement = document.getElementById('displayDate');
    if (displayElement) {
        displayElement.textContent = formattedDate;
    }
    
    // Update time
    updateTime();
}

// Function to update current time
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    const timeElement = document.getElementById('displayTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Call on page load
setPreviousDate();

// Update time every second
setInterval(updateTime, 1000);

let analysisData = {};
let chartInstance = null;
let agingData = {};
let columnKData = {};
let rawData = [];

// File upload handling (hidden but still functional)
const fileInput = document.getElementById('fileInput');
const uploadStatus = document.getElementById('uploadStatus');

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

function showStatus(message, type) {
    if (uploadStatus) {
        uploadStatus.innerHTML = `<div class="status ${type}">${message}</div>`;
        uploadStatus.style.display = 'block';
    }
}

function handleFile(file) {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showStatus('❌ Please select a valid Excel file (.xlsx or .xls)', 'error');
        return;
    }

    showStatus('🔄 Analyzing Excel file...', 'loading');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length === 0) {
                showStatus('❌ The Excel file appears to be empty', 'error');
                return;
            }

            // Store data in localStorage
            try {
                localStorage.setItem('rmsExcelData', JSON.stringify(jsonData));
                localStorage.setItem('rmsDataLoaded', 'true');
            } catch (storageError) {
                console.warn('Could not save to localStorage:', storageError);
            }

            // Analyze with region filter
            analyzeColumnL(jsonData);
            analyzeAgingData(jsonData);
            analyzeColumnKData(jsonData);
            
            displayResults();
            
        } catch (error) {
            showStatus('❌ Error reading Excel file: ' + error.message, 'error');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Filter data by current region
function filterDataByRegion(data, regionName) {
    if (!regionName || !data || !Array.isArray(data)) {
        return data;
    }
    
    const filteredData = [data[0]]; // Keep header row
    
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row && Array.isArray(row) && row.length > 3) {
            const region = row[3]; // Column D is index 3
            const regionStr = region ? String(region).trim() : '';
            
            // Match region - handle both "Jacob Abad" and "Jacobabad" variations
            if (regionStr === regionName || 
                (regionName === 'Jacob Abad' && (regionStr === 'Jacobabad' || regionStr === 'Jacob Abad')) ||
                (regionName === 'Jacobabad' && (regionStr === 'Jacob Abad' || regionStr === 'Jacobabad'))) {
                filteredData.push(row);
            }
        }
    }
    
    console.log(`Filtered data for ${regionName}:`, filteredData.length - 1, 'rows');
    return filteredData;
}

function analyzeColumnL(data) {
    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid data format or empty dataset');
        }
        
        // Filter data by current region if CURRENT_REGION is defined
        let filteredData = data;
        if (typeof CURRENT_REGION !== 'undefined' && CURRENT_REGION) {
            filteredData = filterDataByRegion(data, CURRENT_REGION);
        }
        
        rawData = filteredData;
        let enfraCount = 0;
        let smsLdCount = 0;
        let otherCount = 0;
        let emptyCount = 0;
        
        for (let i = 1; i < filteredData.length; i++) {
            const row = filteredData[i];
            
            if (!row || !Array.isArray(row)) {
                emptyCount++;
                continue;
            }
            
            const columnLValue = row[11]; // Column L is index 11
            
            if (!columnLValue || columnLValue === '' || columnLValue === null) {
                emptyCount++;
            } else {
                const valueStr = String(columnLValue).trim().toUpperCase();
                
                if (valueStr.includes('ENFRA')) {
                    enfraCount++;
                } else if (valueStr.includes('SMS LD') || valueStr.includes('SMS-LD') || valueStr.includes('SMSLD')) {
                    smsLdCount++;
                } else {
                    otherCount++;
                }
            }
        }
        
        analysisData = {
            enfra: enfraCount,
            smsLd: smsLdCount,
            others: otherCount,
            empty: emptyCount,
            total: filteredData.length - 1
        };
        
        console.log('Analysis results:', analysisData);
        // Status message removed as requested
        
    } catch (error) {
        console.error('Analysis error:', error);
        showStatus('❌ Error analyzing data: ' + error.message, 'error');
    }
}

function analyzeAgingData(data) {
    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return;
        }
        
        // Filter by region
        let filteredData = data;
        if (typeof CURRENT_REGION !== 'undefined' && CURRENT_REGION) {
            filteredData = filterDataByRegion(data, CURRENT_REGION);
        }
        
        agingData = {
            enfra: {},
            smsLd: {},
            others: {}
        };
        
        for (let i = 1; i < filteredData.length; i++) {
            const row = filteredData[i];
            
            if (!row || !Array.isArray(row) || row.length < 12) {
                continue;
            }
            
            const aging = row[8]; // Column I is index 8
            const columnLValue = row[11]; // Column L is index 11
            
            if (!aging || !columnLValue) continue;
            
            const agingStr = String(aging).trim();
            const valueStr = String(columnLValue).trim().toUpperCase();
            
            if (!agingStr || !valueStr) continue;
            
            let category = 'others';
            if (valueStr.includes('ENFRA')) {
                category = 'enfra';
            } else if (valueStr.includes('SMS LD') || valueStr.includes('SMS-LD') || valueStr.includes('SMSLD')) {
                category = 'smsLd';
            }
            
            if (!agingData[category][agingStr]) {
                agingData[category][agingStr] = 0;
            }
            agingData[category][agingStr]++;
        }
        
        console.log('Aging analysis complete:', agingData);
        
    } catch (error) {
        console.error('Aging analysis error:', error);
        agingData = { enfra: {}, smsLd: {}, others: {} };
    }
}

function analyzeColumnKData(data) {
    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return;
        }
        
        // Filter by region
        let filteredData = data;
        if (typeof CURRENT_REGION !== 'undefined' && CURRENT_REGION) {
            filteredData = filterDataByRegion(data, CURRENT_REGION);
        }
        
        columnKData = {};
        
        for (let i = 1; i < filteredData.length; i++) {
            const row = filteredData[i];
            
            if (!row || !Array.isArray(row) || row.length < 11) {
                continue;
            }
            
            const columnKValue = row[10]; // Column K is index 10 (0-based)
            
            if (!columnKValue) continue;
            
            const valueStr = String(columnKValue).trim();
            
            if (!valueStr) continue;
            
            if (!columnKData[valueStr]) {
                columnKData[valueStr] = 0;
            }
            columnKData[valueStr]++;
        }
        
        console.log('Column K analysis complete:', columnKData);
        
    } catch (error) {
        console.error('Column K analysis error:', error);
        columnKData = {};
    }
}

function displayResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'block';
    }
    
    const totalRmsOffline = analysisData.enfra + analysisData.smsLd;
    
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        const regionName = typeof CURRENT_REGION !== 'undefined' ? CURRENT_REGION : '';
        statsGrid.innerHTML = `
            <div class="stat-card" onclick="openTableView('card', 'enfra')" style="cursor: pointer;" title="Click to view detailed data">
                <div class="stat-number">${analysisData.enfra}</div>
                <div class="stat-label">Total Offline on<br>Enfra Domain</div>
            </div>
            <div class="stat-card" onclick="openTableView('card', 'smsld')" style="cursor: pointer;" title="Click to view detailed data">
                <div class="stat-number">${analysisData.smsLd}</div>
                <div class="stat-label">Total Offline on<br>SMS LD Domain</div>
            </div>
            <div class="stat-card" onclick="openTableView('card', 'all')" style="cursor: pointer;" title="Click to view detailed data">
                <div class="stat-number">${totalRmsOffline}</div>
                <div class="stat-label">Total RMS Offline${regionName ? '<br>(' + regionName + ')' : ''}</div>
            </div>
            <div class="stat-card" onclick="openTableView('card', 'total')" style="cursor: pointer;" title="Click to view detailed data">
                <div class="stat-number">${analysisData.total}</div>
                <div class="stat-label">Total Sites${regionName ? '<br>(' + regionName + ')' : ''}</div>
            </div>
        `;
    }
    
    create3DPieChart();
    createEnfraAgingBarChart();
    createSmsLdAgingBarChart();
    createColumnKBarChart();
    
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function create3DPieChart() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const data = {
        labels: ['Enfra', 'SMS LD'],
        datasets: [{
            data: [analysisData.enfra, analysisData.smsLd],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 3,
            hoverOffset: 15
        }]
    };
    
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: false },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: 2,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white'
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeInOutElastic',
                onComplete: function() {
                    // Play sweet sound when pie chart animation completes
                    if (typeof soundManager !== 'undefined' && soundManager) {
                        setTimeout(() => soundManager.playGraphSound(), 100);
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements && elements.length > 0) {
                    const elementIndex = elements[0].index;
                    const domainName = data.labels[elementIndex].toLowerCase();
                    console.log('Pie chart clicked:', domainName);
                    if (domainName === 'enfra') {
                        openTableView('card', 'enfra');
                    } else if (domainName === 'sms ld') {
                        openTableView('card', 'smsld');
                    }
                }
            }
        },
        plugins: [{
            id: 'textInside',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.data || meta.data.length === 0) return;
                    
                    meta.data.forEach((element, index) => {
                        const dataValue = dataset.data[index];
                        const startAngle = element.startAngle;
                        const endAngle = element.endAngle;
                        const midAngle = (startAngle + endAngle) / 2;
                        const radius = (element.outerRadius - element.innerRadius) * 0.6 + element.innerRadius;
                        const x = element.x + Math.cos(midAngle) * radius;
                        const y = element.y + Math.sin(midAngle) * radius;
                        
                        ctx.fillStyle = 'white';
                        ctx.font = 'bold 20px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(dataValue, x, y);
                    });
                });
                
                ctx.restore();
            }
        }]
    };
    
    chartInstance = new Chart(ctx, config);
}

function generateColorfulColors(count) {
    const colors = [
        'rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)', 'rgba(83, 102, 255, 0.8)', 'rgba(255, 99, 255, 0.8)',
        'rgba(99, 255, 132, 0.8)'
    ];
    
    const borderColors = colors.map(c => c.replace('0.8', '1'));
    
    const bgColors = [];
    const bdColors = [];
    
    for (let i = 0; i < count; i++) {
        bgColors.push(colors[i % colors.length]);
        bdColors.push(borderColors[i % borderColors.length]);
    }
    
    return { backgroundColor: bgColors, borderColor: bdColors };
}

function sortAgingCategories(agingArray) {
    const agingOrder = {
        '1 - 05 Days': 1, '1-05 Days': 1, '6 - 15 Days': 2, '6-15 Days': 2,
        '16 - 30 Days': 3, '16-30 Days': 3, '31 - 100 Days': 4, '31-100 Days': 4,
        '> 100 Days': 5, '>100 Days': 5
    };
    
    return agingArray.sort((a, b) => {
        const orderA = agingOrder[a[0]] || 999;
        const orderB = agingOrder[b[0]] || 999;
        return orderA - orderB;
    });
}

let enfraAgingBarChartInstance = null;

function createEnfraAgingBarChart() {
    const canvas = document.getElementById('enfraAgingBarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (enfraAgingBarChartInstance) {
        enfraAgingBarChartInstance.destroy();
    }
    
    try {
        if (!agingData || !agingData.enfra) {
            return;
        }
        
        let allAging = Object.entries(agingData.enfra)
            .filter(([aging, count]) => aging && count > 0);
        
        allAging = sortAgingCategories(allAging);
        
        if (allAging.length === 0) return;
        
        const agingLabels = allAging.map(item => item[0]);
        const agingCounts = allAging.map(item => item[1]);
        const colors = generateColorfulColors(agingLabels.length);
        
        const config = {
            type: 'bar',
            data: {
                labels: agingLabels,
                datasets: [{
                    label: 'Enfra Count',
                    data: agingCounts,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
                    x: { ticks: { font: { size: 12, weight: 'bold' }, maxRotation: 45, minRotation: 45 } }
                },
                layout: { padding: { top: 25, bottom: 5, left: 5, right: 5 } },
                animation: { 
                    duration: 1500, 
                    easing: 'easeOutBounce',
                    onComplete: function() {
                        if (typeof soundManager !== 'undefined' && soundManager) {
                            setTimeout(() => soundManager.playGraphSound(), 100);
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements && elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const agingValue = agingLabels[elementIndex];
                        console.log('Enfra aging chart clicked:', agingValue);
                        openTableView('aging', agingValue, 'enfra');
                    }
                }
            },
            plugins: [{
                id: 'barLabels',
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            ctx.fillStyle = '#333';
                            ctx.font = 'bold 14px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(data, bar.x, bar.y - 5);
                        });
                    });
                }
            }]
        };
        
        enfraAgingBarChartInstance = new Chart(ctx, config);
        
    } catch (error) {
        console.error('Error creating Enfra aging chart:', error);
    }
}

let smsLdAgingBarChartInstance = null;

function createSmsLdAgingBarChart() {
    const canvas = document.getElementById('smsLdAgingBarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (smsLdAgingBarChartInstance) {
        smsLdAgingBarChartInstance.destroy();
    }
    
    try {
        if (!agingData || !agingData.smsLd) {
            return;
        }
        
        let allAging = Object.entries(agingData.smsLd)
            .filter(([aging, count]) => aging && count > 0);
        
        allAging = sortAgingCategories(allAging);
        
        if (allAging.length === 0) return;
        
        const agingLabels = allAging.map(item => item[0]);
        const agingCounts = allAging.map(item => item[1]);
        const colors = generateColorfulColors(agingLabels.length);
        
        const config = {
            type: 'bar',
            data: {
                labels: agingLabels,
                datasets: [{
                    label: 'SMS LD Count',
                    data: agingCounts,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
                    x: { ticks: { font: { size: 12, weight: 'bold' }, maxRotation: 45, minRotation: 45 } }
                },
                layout: { padding: { top: 25, bottom: 5, left: 5, right: 5 } },
                animation: { 
                    duration: 1500, 
                    easing: 'easeOutBounce',
                    onComplete: function() {
                        if (typeof soundManager !== 'undefined' && soundManager) {
                            setTimeout(() => soundManager.playGraphSound(), 100);
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements && elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const agingValue = agingLabels[elementIndex];
                        console.log('SMS LD aging chart clicked:', agingValue);
                        openTableView('aging', agingValue, 'smsld');
                    }
                }
            },
            plugins: [{
                id: 'barLabels',
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            ctx.fillStyle = '#333';
                            ctx.font = 'bold 14px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(data, bar.x, bar.y - 5);
                        });
                    });
                }
            }]
        };
        
        smsLdAgingBarChartInstance = new Chart(ctx, config);
        
    } catch (error) {
        console.error('Error creating SMS LD aging chart:', error);
    }
}

let columnKBarChartInstance = null;

function createColumnKBarChart() {
    const canvas = document.getElementById('columnKBarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (columnKBarChartInstance) {
        columnKBarChartInstance.destroy();
    }
    
    try {
        if (!columnKData || typeof columnKData !== 'object') {
            return;
        }
        
        const allCategories = Object.entries(columnKData)
            .filter(([category, count]) => category && count > 0)
            .sort((a, b) => b[1] - a[1]);
        
        if (allCategories.length === 0) return;
        
        const categoryLabels = allCategories.map(item => item[0]);
        const categoryCounts = allCategories.map(item => item[1]);
        const colors = generateColorfulColors(categoryLabels.length);
        
        const config = {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'RMS Offline Reasons',
                    data: categoryCounts,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
                    x: { ticks: { font: { size: 12, weight: 'bold' }, maxRotation: 45, minRotation: 45 } }
                },
                layout: { padding: { top: 25, bottom: 5, left: 5, right: 5 } },
                animation: { 
                    duration: 1500, 
                    easing: 'easeOutBounce',
                    onComplete: function() {
                        if (typeof soundManager !== 'undefined' && soundManager) {
                            setTimeout(() => soundManager.playGraphSound(), 100);
                        }
                    }
                },
                onClick: function(event, elements) {
                    if (elements && elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const reasonName = categoryLabels[elementIndex];
                        console.log('Column K chart clicked:', reasonName);
                        openTableView('reason', reasonName);
                    }
                }
            },
            plugins: [{
                id: 'barLabels',
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            ctx.fillStyle = '#333';
                            ctx.font = 'bold 14px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(data, bar.x, bar.y - 5);
                        });
                    });
                }
            }]
        };
        
        columnKBarChartInstance = new Chart(ctx, config);
        
    } catch (error) {
        console.error('Error creating Column K chart:', error);
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    // Add click event to logo for file upload
    const logo = document.querySelector('.header .logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function() {
            // Create a temporary file input if one doesn't exist
            let tempFileInput = document.getElementById('tempFileInput');
            if (!tempFileInput) {
                tempFileInput = document.createElement('input');
                tempFileInput.type = 'file';
                tempFileInput.id = 'tempFileInput';
                tempFileInput.accept = '.xlsx,.xls';
                tempFileInput.style.display = 'none';
                document.body.appendChild(tempFileInput);
                
                tempFileInput.addEventListener('change', function(e) {
                    if (e.target.files.length > 0) {
                        handleFile(e.target.files[0]);
                    }
                });
            }
            tempFileInput.click();
        });
    }

    // Check localStorage for saved data
    const storedData = localStorage.getItem('rmsExcelData');
    const dataLoaded = localStorage.getItem('rmsDataLoaded');
    
    if (storedData && dataLoaded === 'true') {
        try {
            console.log('Loading data from localStorage...');
            const jsonData = JSON.parse(storedData);
            
            if (jsonData && jsonData.length > 0) {
                // Status message removed
                analyzeColumnL(jsonData);
                analyzeAgingData(jsonData);
                analyzeColumnKData(jsonData);
                displayResults();
                
                return;
            }
        } catch (error) {
            console.warn('Error loading from localStorage:', error);
            localStorage.removeItem('rmsExcelData');
            localStorage.removeItem('rmsDataLoaded');
        }
    }
    
    // Try auto-load DB.xlsx
    fetch('DB.xlsx')
        .then(response => {
            if (!response.ok) throw new Error('DB.xlsx not found');
            return response.arrayBuffer();
        })
        .then(data => {
            // Status message removed
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length > 0) {
                try {
                    localStorage.setItem('rmsExcelData', JSON.stringify(jsonData));
                    localStorage.setItem('rmsDataLoaded', 'true');
                } catch (storageError) {
                    console.warn('Could not save to localStorage:', storageError);
                }
                
                analyzeColumnL(jsonData);
                analyzeAgingData(jsonData);
                analyzeColumnKData(jsonData);
                displayResults();
            }
        })
        .catch(error => {
            console.log('DB.xlsx not found, data will load from localStorage if available');
        });
});

// Function to open table view with filters
function openTableView(type, param1, param2) {
    let url = 'table_view.html?';
    
    // Get current region if defined
    const currentRegion = typeof CURRENT_REGION !== 'undefined' ? CURRENT_REGION : null;
    
    if (type === 'card') {
        url += `type=card&domain=${encodeURIComponent(param1)}`;
        // Add region filter for regional pages
        if (currentRegion) {
            url += `&region=${encodeURIComponent(currentRegion)}`;
        }
    } else if (type === 'region') {
        url += `type=region&region=${encodeURIComponent(param1)}&domain=${encodeURIComponent(param2)}`;
    } else if (type === 'aging') {
        url += `type=aging&aging=${encodeURIComponent(param1)}&domain=${encodeURIComponent(param2)}`;
        // Add region filter for regional pages
        if (currentRegion) {
            url += `&region=${encodeURIComponent(currentRegion)}`;
        }
    } else if (type === 'reason') {
        url += `type=reason&reason=${encodeURIComponent(param1)}`;
        // Add region filter for regional pages
        if (currentRegion) {
            url += `&region=${encodeURIComponent(currentRegion)}`;
        }
        console.log('Opening table view for reason:', param1);
        console.log('Generated URL:', url);
    }
    
    console.log('Opening table view with URL:', url);
    // Open in same window
    window.location.href = url;
}
