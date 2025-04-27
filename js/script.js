function toggleSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
    } catch (error) {
        console.error('Error toggling sidebar:', error);
    }
}

function closeSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
    } catch (error) {
        console.error('Error closing sidebar:', error);
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

// Show skeleton loader on page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }

        // Skeleton loader for balance card
        const balanceSkeleton = document.getElementById('balanceSkeleton');
        const balanceContent = document.getElementById('balanceContent');
        if (balanceSkeleton && balanceContent) {
            balanceSkeleton.classList.remove('hidden');
            balanceContent.classList.add('hidden');
            setTimeout(() => {
                balanceSkeleton.classList.add('hidden');
                balanceContent.classList.remove('hidden');
            }, 1000); // Simulate 1-second loading
        }

        const sidebar = document.getElementById('sidebar');
        const menuLinks = sidebar.querySelectorAll('nav a, nav .submenu a');

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // Only on mobile
                    closeSidebar();
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const toggleButton = document.querySelector('.md\\:hidden.text-gray-800'); // Hamburger button
                if (!sidebar.contains(event.target) && !toggleButton.contains(event.target) && sidebar.classList.contains('open')) {
                    closeSidebar();
                }
            }
        });
    } catch (error) {
        console.error('Error initializing:', error);
    }
});