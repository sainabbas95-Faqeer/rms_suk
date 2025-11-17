// Simple script to check the current visit count in localStorage
console.log('Checking visit count in localStorage...');

try {
    const visitCount = localStorage.getItem('visitCount') || 0;
    console.log('Current visit count:', visitCount);
    
    const visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
    console.log('Visit history length:', visitHistory.length);
    
    if (visitHistory.length > 0) {
        console.log('Last visit:', visitHistory[visitHistory.length - 1]);
    }
} catch (error) {
    console.error('Error accessing localStorage:', error);
}