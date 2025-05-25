document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize projects
    const taskManager = new TaskManager();
    const budgetTracker = new BudgetTracker();
    
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate name
        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (name.value.trim() === '') {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }
        
        // Validate email
        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }
        
        // Validate message
        const message = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (message.value.trim() === '') {
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }
        
        if (isValid) {
            // In a real app, you would send the form data to a server here
            contactForm.reset();
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    });
    
    // Modal functionality
    const taskManagerModal = document.getElementById('taskManagerModal');
    const budgetTrackerModal = document.getElementById('budgetTrackerModal');
    const openTaskManagerBtn = document.getElementById('openTaskManager');
    const openBudgetTrackerBtn = document.getElementById('openBudgetTracker');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    openTaskManagerBtn.addEventListener('click', () => {
        taskManagerModal.style.display = 'block';
    });
    
    openBudgetTrackerBtn.addEventListener('click', () => {
        budgetTrackerModal.style.display = 'block';
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

// Task Manager Class
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
        this.init();
    }

    init() {
        this.renderTasks();
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            const newTask = {
                id: this.taskId++,
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            taskInput.value = '';
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            taskList.innerHTML = '<p class="empty-message">No tasks yet. Add one above!</p>';
            return;
        }

        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                         onclick="taskManager.toggleTask(${task.id})">
                    <span>${task.text}</span>
                </div>
                <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            taskList.appendChild(taskElement);
        });
    }
}

// Budget Tracker Class
class BudgetTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.balance = 0;
        this.income = 0;
        this.expense = 0;
        this.init();
        this.updateBalance();
    }

    init() {
        document.getElementById('addTransactionBtn').addEventListener('click', () => this.addTransaction());
        this.renderTransactions();
    }

    addTransaction() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        if (description && !isNaN(amount)) {
            const newTransaction = {
                id: Date.now(),
                description,
                amount,
                type,
                date: new Date().toLocaleDateString()
            };

            this.transactions.push(newTransaction);
            this.saveTransactions();
            this.updateBalance();
            this.renderTransactions();

            // Clear form
            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
        }
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
        this.saveTransactions();
        this.updateBalance();
        this.renderTransactions();
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    updateBalance() {
        this.income = this.transactions
            .filter(transaction => transaction.type === 'income')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        this.expense = this.transactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        this.balance = this.income - this.expense;

        document.getElementById('balance').textContent = `$${this.balance.toFixed(2)}`;
        document.getElementById('income').textContent = `$${this.income.toFixed(2)}`;
        document.getElementById('expense').textContent = `$${this.expense.toFixed(2)}`;
    }

    renderTransactions() {
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';

        if (this.transactions.length === 0) {
            transactionList.innerHTML = '<p class="empty-message">No transactions yet. Add one above!</p>';
            return;
        }

        this.transactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = `transaction ${transaction.type}`;
            transactionElement.innerHTML = `
                <div>
                    <p class="transaction-description">${transaction.description}</p>
                    <small>${transaction.date}</small>
                </div>
                <div class="transaction-amount">$${transaction.amount.toFixed(2)}</div>
                <button class="delete-transaction" onclick="budgetTracker.deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            transactionList.appendChild(transactionElement);
        });
    }
}

// Make instances available globally for onclick handlers
const taskManager = new TaskManager();
const budgetTracker = new BudgetTracker();