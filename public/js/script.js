// script.js

async function findTable() {
    const name = document.getElementById('guestName').value.trim();
    const result = document.getElementById('result');
    
    if (name === '') {
        result.innerHTML = 'Please enter a name';
        return;
    }
    
    result.innerHTML = '🔍 Searching...';
    
    try {
        const response = await fetch(`/api/guests/search/${encodeURIComponent(name)}`);
        const guests = await response.json();
        
        if (guests.length > 0) {
            let html = '';
            guests.forEach(guest => {
                // Use table_name if available, otherwise fall back to table_number
                const tableDisplay = guest.table_name || `Table ${guest.table_number}`;
                
                html += `
                    <div style="margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 10px; border-left: 5px solid #e91e63;">
                        <div style="font-size: 18px; margin-bottom: 5px;"> ${guest.full_name}</div>
                        <div style="color: #e91e63; font-size: 22px; font-weight: bold;">${tableDisplay}</div>
                    </div>
                `;
            });
            result.innerHTML = html;
        } else {
            result.innerHTML = '😢 Sorry, we cannot find your name on the guest list.';
        }
    } catch (error) {
        console.error('Error:', error);
        result.innerHTML = '❌ Error searching. Please try again.';
    }
}

// Add enter key support
document.getElementById('guestName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        findTable();
    }
});

// Add a function to show all tables (optional)
async function showAllTables() {
    const result = document.getElementById('result');
    result.innerHTML = '🔍 Loading all guests...';
    
    try {
        const response = await fetch('/api/guests');
        const guests = await response.json();
        
        // Group guests by table
        const tables = {};
        guests.forEach(guest => {
            const tableDisplay = guest.table_name || `Table ${guest.table_number}`;
            if (!tables[tableDisplay]) {
                tables[tableDisplay] = [];
            }
            tables[tableDisplay].push(guest.full_name);
        });
        
        // Display grouped by table
        let html = '<h3 style="color: #e91e63; margin-bottom: 15px;">Guest List by Table</h3>';
        
        // Sort tables in the order you want
        const tableOrder = ['VIP 1', 'VIP 2', 'TABLE 1 (VIP 3)', 'TABLE 2', 'TABLE 3', 'TABLE 4', 'TABLE 5', 'TABLE 6', 'TABLE 7', 'TABLE 8', 'TABLE 9', 'TABLE 10', 'TABLE 11'];
        
        tableOrder.forEach(tableName => {
            if (tables[tableName]) {
                html += `
                    <div style="margin: 20px 0; padding: 15px; background: #fff; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <div style="background: #e91e63; color: white; padding: 10px; border-radius: 5px; margin-bottom: 10px; font-weight: bold; font-size: 18px;">
                            ${tableName} (${tables[tableName].length} guests)
                        </div>
                `;
                
                tables[tableName].sort().forEach(name => {
                    html += `<div style="padding: 5px 10px; border-bottom: 1px solid #eee;">${name}</div>`;
                });
                
                html += `</div>`;
            }
        });
        
        result.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        result.innerHTML = '❌ Error loading guests.';
    }
}