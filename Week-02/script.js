// GLOBAL STATE VARIABLES
let salary = 0;
let expenses = [];
let currentCurrency = 'INR';
let exchangeRate = 1;
let chart = null;



// DOM ELEMENTS
const salaryInput = document.getElementById('salary-input');
const setSalaryBtn = document.getElementById('set-salary-btn');
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const displaySalary = document.getElementById('display-salary');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');
const expenseList = document.getElementById('expense-list');
const currencySelect = document.getElementById('currency');
const exchangeRateDisplay = document.getElementById('exchange-rate');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const budgetAlert = document.getElementById('budget-alert');


//BASIC FUNCTIONALITY

// Set Salary Function
function setSalary() {
    const value = parseFloat(salaryInput.value);
    
    // Validation: Check if value is valid and positive
    if (isNaN(value) || value < 0) {
        alert('Please enter a valid positive salary amount!');
        return;
    }
    
    salary = value;
    salaryInput.value = '';
    
    // Save to localStorage (Level 2)
    saveToLocalStorage();
    
    // Update display
    updateDisplay();
}

// Add Expense Function
function addExpense(e) {
    e.preventDefault();
    
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    
    // Level 1 Validation: Check for empty or negative values
    if (name === '') {
        alert('Please enter an expense name!');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive amount!');
        return;
    }
    
    // Create expense object
    const expense = {
        id: Date.now(),
        name: name,
        amount: amount
    };
    
    // Add to expenses array
    expenses.push(expense);
    
    // Clear inputs
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    
    // Save to localStorage (Level 2)
    saveToLocalStorage();
    
    // Update display
    updateDisplay();
    renderExpenseList();
}

// Calculate Total Expenses
function calculateTotalExpenses() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Calculate Remaining Balance
function calculateBalance() {
    return salary - calculateTotalExpenses();
}

// Update Display Function
function updateDisplay() {
    const totalExpenses = calculateTotalExpenses();
    const balance = calculateBalance();
    
    // Convert values based on currency
    const convertedSalary = salary * exchangeRate;
    const convertedExpenses = totalExpenses * exchangeRate;
    const convertedBalance = balance * exchangeRate;
    
    // Display values with currency symbol
    displaySalary.textContent = formatCurrency(convertedSalary);
    displayExpenses.textContent = formatCurrency(convertedExpenses);
    displayBalance.textContent = formatCurrency(convertedBalance);
    
    // Level 3: Budget Alert - Check if balance is below 10%
    checkBudgetAlert(balance);
    
    // Level 2: Update Chart
    updateChart();
}

// Format Currency
function formatCurrency(amount) {
    const symbols = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    };
    
    return `${symbols[currentCurrency] || ''} ${amount.toFixed(2)}`;
}

// LEVEL 2: DELETE FUNCTIONALITY

// Delete Expense Function
function deleteExpense(id) {
    // Find expense index
    const index = expenses.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
        // Remove from array
        expenses.splice(index, 1);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Update display
        updateDisplay();
        renderExpenseList();
    }
}

// Render Expense List
function renderExpenseList() {
    // Clear current list
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseList.innerHTML = '<p class="empty-message">No expenses added yet</p>';
        return;
    }
    
    // Create expense items
    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        
        const convertedAmount = expense.amount * exchangeRate;
        
        expenseItem.innerHTML = `
            <div class="expense-info">
                <div class="expense-name">${expense.name}</div>
                <div class="expense-amount">${formatCurrency(convertedAmount)}</div>
            </div>
            <button class="btn btn-delete" onclick="deleteExpense(${expense.id})">
                🗑️ Delete
            </button>
        `;
        
        expenseList.appendChild(expenseItem);
    });
}

// LEVEL 2: LOCAL STORAGE PERSISTENCE

// Save to LocalStorage
function saveToLocalStorage() {
    const data = {
        salary: salary,
        expenses: expenses
    };
    
    localStorage.setItem('cashFlowData', JSON.stringify(data));
}

// Load from LocalStorage
function loadFromLocalStorage() {
    const data = localStorage.getItem('cashFlowData');
    
    if (data) {
        const parsed = JSON.parse(data);
        salary = parsed.salary || 0;
        expenses = parsed.expenses || [];
        
        updateDisplay();
        renderExpenseList();
    }
}

// LEVEL 2: CHART VISUALIZATION

// Update Chart Function
function updateChart() {
    const totalExpenses = calculateTotalExpenses();
    const balance = calculateBalance();
    
    const ctx = document.getElementById('expense-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    // Create new chart
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Remaining Balance', 'Total Expenses'],
            datasets: [{
                data: [Math.max(0, balance), totalExpenses],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',  // Success green
                    'rgba(239, 68, 68, 0.8)'   // Danger red
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8fafc',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed * exchangeRate;
                            label += formatCurrency(value);
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// LEVEL 3: BUDGET ALERT

// Check Budget Alert Function
function checkBudgetAlert(balance) {
    const threshold = salary * 0.1; // 10% of salary
    
    if (salary > 0 && balance < threshold && balance >= 0) {
        // Show alert
        budgetAlert.classList.remove('hidden');
        displayBalance.classList.add('low-balance');
        
        // Show browser alert (only once per session)
        if (!sessionStorage.getItem('alertShown')) {
            alert('⚠️ Warning: Your remaining balance is below 10% of your salary!');
            sessionStorage.setItem('alertShown', 'true');
        }
    } else {
        // Hide alert
        budgetAlert.classList.add('hidden');
        displayBalance.classList.remove('low-balance');
    }
}

// LEVEL 3: CURRENCY CONVERTER

// Fetch Exchange Rate from API
async function fetchExchangeRate(currency) {
    try {
        // Using Frankfurter API (free, no API key required)
        const response = await fetch(`https://api.frankfurter.app/latest?from=INR&to=${currency}`);
        const data = await response.json();
        
        if (data.rates && data.rates[currency]) {
            exchangeRate = data.rates[currency];
            exchangeRateDisplay.textContent = `1 INR = ${exchangeRate.toFixed(4)} ${currency}`;
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        exchangeRateDisplay.textContent = 'Rate unavailable';
        
        // Fallback rates if API fails
        const fallbackRates = {
            INR: 1,
            USD: 0.012,
            EUR: 0.011,
            GBP: 0.0095,
            JPY: 1.85
        };
        exchangeRate = fallbackRates[currency] || 1;
    }
}

// Handle Currency Change
async function handleCurrencyChange() {
    currentCurrency = currencySelect.value;
    
    if (currentCurrency === 'INR') {
        exchangeRate = 1;
        exchangeRateDisplay.textContent = '';
    } else {
        await fetchExchangeRate(currentCurrency);
    }
    
    // Update all displays
    updateDisplay();
    renderExpenseList();
}

// LEVEL 3: PDF EXPORT

// Download PDF Report Function
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Cash-Flow Report', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
    
    // Currency Info
    doc.setFontSize(10);
    doc.text(`Currency: ${currentCurrency}`, 105, 35, { align: 'center' });
    
    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Financial Summary', 20, 50);
    
    doc.setFontSize(11);
    const totalExpenses = calculateTotalExpenses();
    const balance = calculateBalance();
    
    doc.text(`Total Salary: ${formatCurrency(salary * exchangeRate)}`, 20, 60);
    doc.text(`Total Expenses: ${formatCurrency(totalExpenses * exchangeRate)}`, 20, 68);
    doc.text(`Remaining Balance: ${formatCurrency(balance * exchangeRate)}`, 20, 76);
    
    // Expense List
    doc.setFontSize(14);
    doc.text('Expense Details', 20, 90);
    
    let yPosition = 100;
    doc.setFontSize(10);
    
    if (expenses.length === 0) {
        doc.text('No expenses recorded', 20, yPosition);
    } else {
        expenses.forEach((expense, index) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            const convertedAmount = expense.amount * exchangeRate;
            doc.text(`${index + 1}. ${expense.name}`, 20, yPosition);
            doc.text(`${formatCurrency(convertedAmount)}`, 150, yPosition);
            yPosition += 8;
        });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Save PDF
    doc.save(`CashFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}

// EVENT LISTENERS

// Salary Button
setSalaryBtn.addEventListener('click', setSalary);

// Allow Enter key to set salary
salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setSalary();
    }
});

// Expense Form
expenseForm.addEventListener('submit', addExpense);

// Currency Selector
currencySelect.addEventListener('change', handleCurrencyChange);

// PDF Download Button
downloadPdfBtn.addEventListener('click', downloadPDF);

// INITIALIZATION

// Load data when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateDisplay();
    renderExpenseList();
});