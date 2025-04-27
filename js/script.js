// Sidebar Toggle for Mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

// Submenu Toggle
function toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    const icon = submenu.previousElementSibling.querySelector('.submenu-icon');
    submenu.classList.toggle('hidden');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

// Notifications Panel Toggle
function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.toggle('translate-x-full');
    // Mock update notification count
    const countElement = document.getElementById('notificationCount');
    if (!panel.classList.contains('translate-x-full')) {
        countElement.textContent = '0'; // Reset count when viewed
    }
}

// ExchangeRate-API Key
const EXCHANGE_RATE_API_KEY = 'acbd73a9340c6cb441af209a';

// Store live rates globally for the Quick Converter
let liveRates = {};

// Fetch Live Exchange Rates from ExchangeRate-API
async function fetchExchangeRates() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`);
        const data = await response.json();
        
        if (data.result !== 'success') {
            throw new Error('Failed to fetch exchange rates');
        }

        // Store live rates for Quick Converter
        liveRates = data.conversion_rates;

        // Update Exchange Rates Widget
        document.getElementById('usd-cad').textContent = liveRates.CAD.toFixed(3);
        document.getElementById('usd-aud').textContent = liveRates.AUD.toFixed(3);
        document.getElementById('usd-inr').textContent = liveRates.INR.toFixed(2);
        document.getElementById('usd-brl').textContent = liveRates.BRL.toFixed(3);
        document.getElementById('usd-mxn').textContent = liveRates.MXN.toFixed(2);
        document.getElementById('usd-jpy').textContent = liveRates.JPY.toFixed(2);

        // Add a flash animation to indicate update
        const exchangeRatesList = document.getElementById('exchangeRates');
        exchangeRatesList.classList.add('flash');
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        document.getElementById('usd-cad').textContent = 'Error';
        document.getElementById('usd-aud').textContent = 'Error';
        document.getElementById('usd-inr').textContent = 'Error';
        document.getElementById('usd-brl').textContent = 'Error';
        document.getElementById('usd-mxn').textContent = 'Error';
        document.getElementById('usd-jpy').textContent = 'Error';
    }
}

// Fetch Live Crypto Prices from CoinGecko API
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        
        // Update BTC Price and Value
        const btcPrice = data.bitcoin.usd;
        const btcBalance = parseFloat(document.getElementById('btcBalance')?.textContent || 0);
        document.getElementById('btcPrice').textContent = btcPrice.toLocaleString();
        document.getElementById('btcValue').textContent = (btcBalance * btcPrice).toLocaleString();

        // Update ETH Price and Value
        const ethPrice = data.ethereum.usd;
        const ethBalance = parseFloat(document.getElementById('ethBalance')?.textContent || 0);
        document.getElementById('ethPrice').textContent = ethPrice.toLocaleString();
        document.getElementById('ethValue').textContent = (ethBalance * ethPrice).toLocaleString();

        // Update Total Portfolio Value
        const totalValue = (btcBalance * btcPrice) + (ethBalance * ethPrice);
        document.getElementById('totalValue').textContent = totalValue.toLocaleString();
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        document.getElementById('btcPrice').textContent = 'Error';
        document.getElementById('ethPrice').textContent = 'Error';
        document.getElementById('btcValue').textContent = 'Error';
        document.getElementById('ethValue').textContent = 'Error';
        document.getElementById('totalValue').textContent = 'Error';
    }
}

// Initialize Chart.js for the Spending Trends chart (from dashboard.html)
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('spendingChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Spending',
                    data: [300, 450, 200, 600, 400],
                    borderColor: '#9333ea',
                    backgroundColor: 'rgba(147, 51, 234, 0.2)',
                    fill: true,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount ($)',
                            color: '#4a5568'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month',
                            color: '#4a5568'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#4a5568'
                        }
                    }
                }
            }
        });
    }

    // Fetch exchange rates on page load and refresh every 30 seconds
    if (document.getElementById('exchangeRates')) {
        fetchExchangeRates();
        setInterval(fetchExchangeRates, 30000); // Refresh every 30 seconds
    }

    // Fetch crypto prices on page load and refresh every 30 seconds
    if (document.getElementById('btcPrice')) {
        fetchCryptoPrices();
        setInterval(fetchCryptoPrices, 30000); // Refresh every 30 seconds
    }

    // Mock Notification for Quick Actions (from dashboard.html)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim();
            alert(`Success! You clicked "${action}". This is a mock action.`);
        });
    });

    // Quick Converter Logic (from dashboard.html) - Now using live rates
    document.getElementById('convertAmount')?.addEventListener('input', () => {
        const amount = document.getElementById('convertAmount').value || 0;
        const currency = document.getElementById('convertCurrency').value.toUpperCase();
        if (liveRates[currency]) {
            const converted = (amount * liveRates[currency]).toFixed(2);
            document.getElementById('convertResult').textContent = `${converted} ${currency}`;
        } else {
            document.getElementById('convertResult').textContent = 'Rate not available';
        }
    });
});

// Transfer Form Logic (from transfer.html)
document.getElementById('transferForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const country = document.querySelector('select').value;
    let currency = '';
    if (country === 'us') currency = 'USD';
    if (country === 'eu') currency = 'EUR';
    if (country === 'br') currency = 'BRL';
    if (country === 'au') currency = 'AUD';
    alert(`Success! You sent $${amount} to ${country.toUpperCase()} (${currency}).`);
});

// Mock Exchange Rate Calculation (from transfer.html) - Using live rates
document.querySelector('select')?.addEventListener('change', () => {
    const amount = document.getElementById('amount').value || 0;
    const country = document.querySelector('select').value;
    let currency = '';
    if (country === 'us') currency = 'USD';
    if (country === 'eu') currency = 'EUR';
    if (country === 'br') currency = 'BRL';
    if (country === 'au') currency = 'AUD';
    
    if (liveRates[currency]) {
        const converted = (amount * liveRates[currency]).toFixed(2);
        document.getElementById('convertedAmount').textContent = `${converted} ${currency}`;
    } else {
        document.getElementById('convertedAmount').textContent = 'Rate not available';
    }
});

// Mock Voice Command (from transfer.html)
document.getElementById('voiceCommand')?.addEventListener('click', () => {
    alert('Voice feature coming soon! Please use the form to send money.');
});

// Savings Goals Logic (from savings.html)
document.getElementById('savingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const goalName = document.getElementById('goalName').value;
    const targetAmount = document.getElementById('targetAmount').value;

    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const newGoal = { name: goalName, target: targetAmount, current: 0 };
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));

    displayGoals();
    alert(`Goal "${goalName}" set for $${targetAmount}!`);
});

// Mock function to add to savings (from savings.html)
function addToSavings(goalIndex, amount) {
    const goals = JSON.parse(localStorage.getItem('goals'));
    goals[goalIndex].current = parseFloat(goals[goalIndex].current) + parseFloat(amount);
    localStorage.setItem('goals', JSON.stringify(goals));

    const progress = (goals[goalIndex].current / goals[goalIndex].target) * 100;
    if (progress >= 50) {
        alert('🎉 Congrats! You earned the "Saver Star" badge for reaching 50% of your goal!');
    }
    displayGoals();
}

// Display Goals (from savings.html)
function displayGoals() {
    const goalsList = document.getElementById('goalsList');
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goalsList.innerHTML = '<h3 class="text-xl font-semibold text-gray-800 mb-4">Your Goals</h3>';

    goals.forEach((goal, index) => {
        const progress = (goal.current / goal.target) * 100;
        const goalElement = document.createElement('div');
        goalElement.className = 'border-b py-4';
        goalElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-gray-800 font-semibold">${goal.name}</p>
                    <p class="text-gray-600">$${goal.current} / $${goal.target}</p>
                    <div class="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div class="bg-purple-600 h-4 rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <input type="number" id="addAmount-${index}" class="p-2 border rounded-lg w-24" placeholder="Add $">
                    <button onclick="addToSavings(${index}, document.getElementById('addAmount-${index}').value)" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add</button>
                </div>
            </div>
        `;
        goalsList.appendChild(goalElement);
    });
}

// Load goals on page load (from savings.html)
if (document.getElementById('goalsList')) {
    displayGoals();
}

// Crypto Wallet Logic (from crypto.html)
function buyCrypto(crypto, amount) {
    const balanceElement = document.getElementById(`${crypto.toLowerCase()}Balance`);
    let balance = parseFloat(balanceElement.textContent);
    balance += amount;
    balanceElement.textContent = balance.toFixed(1);
    fetchCryptoPrices(); // Refresh prices to update the value
    alert(`You bought ${amount} ${crypto}! New balance: ${balance} ${crypto}.`);
}

function sellCrypto(crypto, amount) {
    const balanceElement = document.getElementById(`${crypto.toLowerCase()}Balance`);
    let balance = parseFloat(balanceElement.textContent);
    if (balance < amount) {
        alert(`Insufficient ${crypto} balance!`);
        return;
    }
    balance -= amount;
    balanceElement.textContent = balance.toFixed(1);
    fetchCryptoPrices(); // Refresh prices to update the value
    alert(`You sold ${amount} ${crypto}! New balance: ${balance} ${crypto}.`);
}

// Dark Mode Toggle (from settings.html)
document.getElementById('darkModeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load theme on page load (from settings.html)
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Language Selection (Mock) (from settings.html)
document.getElementById('languageSelect')?.addEventListener('change', (e) => {
    const lang = e.target.value;
    alert(`Language changed to ${lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'French'}! (Mock feature)`);
});