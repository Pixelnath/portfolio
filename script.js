document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize projects
    const rpsGame = new RPSGame();
    const passwordGenerator = new PasswordGenerator();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
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
    }
    
    // Modal functionality
    const rpsGameModal = document.getElementById('rpsGameModal');
    const passwordGeneratorModal = document.getElementById('passwordGeneratorModal');
    const openRPSGameBtn = document.getElementById('openRPSGame');
    const openPasswordGeneratorBtn = document.getElementById('openPasswordGenerator');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (openRPSGameBtn) {
        openRPSGameBtn.addEventListener('click', () => {
            rpsGameModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    if (openPasswordGeneratorBtn) {
        openPasswordGeneratorBtn.addEventListener('click', () => {
            passwordGeneratorModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
    
    // Back to top button functionality
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
    }
});

// Rock Paper Scissors Game Class
class RPSGame {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.init();
    }

    init() {
        const buttons = document.querySelectorAll("#rpsGameModal button[id]");
        const resultEl = document.querySelector("#rpsGameModal #result");
        const playerScoreEl = document.querySelector("#rpsGameModal #user-score");
        const computerScoreEl = document.querySelector("#rpsGameModal #computer-score");

        if (buttons && resultEl && playerScoreEl && computerScoreEl) {
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    const result = this.playRound(button.id, this.computerPlay());
                    resultEl.textContent = result;
                    playerScoreEl.textContent = this.playerScore;
                    computerScoreEl.textContent = this.computerScore;
                });
            });
        }
    }

    computerPlay() {
        const choices = ["rock", "paper", "scissors"];
        const randomChoice = Math.floor(Math.random() * choices.length);
        return choices[randomChoice];
    }

    playRound(playerSelection, computerSelection) {
        if (playerSelection === computerSelection) {
            return "It's a tie!";
        } else if (
            (playerSelection === "rock" && computerSelection === "scissors") ||
            (playerSelection === "paper" && computerSelection === "rock") ||
            (playerSelection === "scissors" && computerSelection === "paper")
        ) {
            this.playerScore++;
            return `You win! ${this.capitalizeFirstLetter(playerSelection)} beats ${this.capitalizeFirstLetter(computerSelection)}`;
        } else {
            this.computerScore++;
            return `You lose! ${this.capitalizeFirstLetter(computerSelection)} beats ${this.capitalizeFirstLetter(playerSelection)}`;
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Password Generator Class
class PasswordGenerator {
    constructor() {
        this.init();
    }

    init() {
        const btnEl = document.querySelector("#passwordGeneratorModal .btn");
        const inputEl = document.querySelector("#passwordGeneratorModal #password-input");
        const copyIconEl = document.querySelector("#passwordGeneratorModal .fa-copy");
        const alertContainerEl = document.querySelector("#passwordGeneratorModal .alert-container");

        if (btnEl && inputEl && copyIconEl && alertContainerEl) {
            btnEl.addEventListener("click", () => {
                this.createPassword();
            });

            copyIconEl.addEventListener("click", () => {
                this.copyPassword();
                if (inputEl.value) {
                    alertContainerEl.classList.remove("active");
                    setTimeout(() => {
                        alertContainerEl.classList.add("active");
                    }, 2000);
                }
            });
        }
    }

    createPassword() {
        const chars = "0123456789abcdefghijklmnopqrstuvwxtz!@#$%^&*()_+?:{}[]ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const passwordLength = 14;
        let password = "";
        const inputEl = document.querySelector("#passwordGeneratorModal #password-input");
        const alertContainerEl = document.querySelector("#passwordGeneratorModal .alert-container");

        for (let index = 0; index < passwordLength; index++) {
            const randomNum = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNum, randomNum + 1);
        }
        inputEl.value = password;
        alertContainerEl.innerText = "Password copied to clipboard!";
    }

    copyPassword() {
        const inputEl = document.querySelector("#passwordGeneratorModal #password-input");
        if (inputEl.value) {
            inputEl.select();
            inputEl.setSelectionRange(0, 9999);
            navigator.clipboard.writeText(inputEl.value)
                .then(() => {
                    console.log("Password copied to clipboard");
                })
                .catch(err => {
                    console.error("Failed to copy password: ", err);
                });
        }
    }
}