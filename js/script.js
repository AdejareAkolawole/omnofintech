function toggleSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    } catch (error) {
        console.error('Error toggling sidebar:', error);
    }
}

function toggleNotifications() {
    try {
        const notificationsPanel = document.getElementById('notificationsPanel');
        notificationsPanel.classList.toggle('open');
    } catch (error) {
        console.error('Error toggling notifications:', error);
    }
}

function toggleSubmenu(submenuId) {
    try {
        const submenu = document.getElementById(submenuId);
        submenu.classList.toggle('open');
        const button = submenu.previousElementSibling;
        const icon = button.querySelector('.submenu-icon');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    } catch (error) {
        console.error('Error toggling submenu:', error);
    }
}

function toggleDarkMode() {
    try {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    } catch (error) {
        console.error('Error toggling dark mode:', error);
    }
}

function addPaymentMethod(type) {
    try {
        const paymentMethodsList = document.getElementById('paymentMethodsList');
        const li = document.createElement('li');
        li.className = 'py-2 border-b flex justify-between';
        li.innerHTML = type === 'card' ? 
            `<span>Visa **** 1234</span><button onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700">Remove</button>` :
            `<span>Bank Account **** 5678</span><button onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700">Remove</button>`;
        paymentMethodsList.appendChild(li);
    } catch (error) {
        console.error('Error adding payment method:', error);
    }
}

function submitContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! Our team will get back to you soon.');
    document.getElementById('contactForm').reset();
}

function updateProfile(event) {
    event.preventDefault();
    alert('Profile updated successfully!');
}

function filterTransactions(type) {
    try {
        const transactions = document.querySelectorAll('.transaction');
        transactions.forEach(tx => {
            tx.style.display = type === 'all' ? 'flex' : 
                              tx.classList.contains(type) ? 'flex' : 'none';
        });
    } catch (error) {
        console.error('Error filtering transactions:', error);
    }
}

function setBudget() {
    try {
        const budget = prompt('Enter your monthly budget ($):');
        if (budget && !isNaN(budget)) {
            document.getElementById('monthlyBudget').textContent = `$${budget}`;
            const spent = parseFloat(document.getElementById('spentAmount').textContent.replace('$', ''));
            const percentage = (spent / budget) * 100;
            document.getElementById('budgetProgress').style.width = `${Math.min(percentage, 100)}%`;
        }
    } catch (error) {
        console.error('Error setting budget:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    } catch (error) {
        console.error('Error initializing dark mode:', error);
    }
});