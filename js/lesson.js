// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive components
    initLessonNavigation();
    initDecisionHelper();
    initWordCloud();
    initCodeTabs();
    initQuiz();
    initSidebarToggle();
    updateProgressBar();
    
    // Initialize tooltips
    initTooltips();
    
    // Add event listener for theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Add event listener for back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', toggleBackToTop);
        backToTopBtn.addEventListener('click', scrollToTop);
    }
});

// Lesson Navigation
function initLessonNavigation() {
    const steps = document.querySelectorAll('.lesson-step');
    const navItems = [];
    
    // Create navigation items
    steps.forEach((step, index) => {
        const stepId = step.id;
        const stepTitle = step.querySelector('h2')?.textContent || `Step ${index + 1}`;
        const navItem = document.createElement('li');
        navItem.innerHTML = `
            <a href="#${stepId}" data-step="${index + 1}">
                <span class="step-number">${index + 1}</span>
                <span class="step-title">${stepTitle}</span>
            </a>
        `;
        navItems.push(navItem);
    });
    
    // Add navigation items to the sidebar
    const navList = document.getElementById('lessonNav');
    if (navList) {
        navList.append(...navItems);
        
        // Set up click handlers for navigation
        navList.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link) {
                const stepId = link.getAttribute('href').substring(1);
                showStep(stepId);
            }
        });
    }
    
    // Set up next/previous buttons
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const nextStep = button.getAttribute('data-next');
            showStep(`step-${nextStep}`);
        });
    });
    
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const prevStep = button.getAttribute('data-prev');
            showStep(`step-${prevStep}`);
        });
    });
    
    // Show first step by default
    if (steps.length > 0) {
        showStep(steps[0].id);
    }
}

function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.lesson-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show the selected step
    const activeStep = document.getElementById(stepId);
    if (activeStep) {
        activeStep.classList.add('active');
        
        // Update active navigation item
        document.querySelectorAll('#lessonNav a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${stepId}`);
        });
        
        // Update progress bar
        updateProgressBar();
        
        // Scroll to top of the step
        activeStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Decision Helper
function initDecisionHelper() {
    const checkboxes = document.querySelectorAll('.decision-option input[type="checkbox"]');
    const resultDiv = document.getElementById('decision-result');
    
    if (!checkboxes.length || !resultDiv) return;
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDecisionResult);
    });
    
    function updateDecisionResult() {
        const selected = document.querySelectorAll('.decision-option input[type="checkbox"]:checked');
        let agentCount = 0;
        let scriptCount = 0;
        
        selected.forEach(checkbox => {
            if (checkbox.value === 'agent') agentCount++;
            if (checkbox.value === 'script') scriptCount++;
        });
        
        // Determine the result
        if (selected.length === 0) {
            resultDiv.textContent = 'Select characteristics to see a recommendation.';
            resultDiv.className = 'decision-result';
        } else if (agentCount > scriptCount) {
            resultDiv.innerHTML = `
                <h4>Recommended: Agentic Approach</h4>
                <p>Based on your selections, an agentic approach would be more suitable. This approach allows for dynamic decision-making and adaptation to changing requirements.</p>
            `;
            resultDiv.className = 'decision-result agent';
        } else if (scriptCount > agentCount) {
            resultDiv.innerHTML = `
                <h4>Recommended: Scripted Approach</h4>
                <p>Based on your selections, a scripted approach would be more efficient. This works well for well-defined, predictable tasks with clear steps.</p>
            `;
            resultDiv.className = 'decision-result script';
        } else {
            resultDiv.innerHTML = `
                <h4>It's a Tie!</h4>
                <p>Your selections are evenly split between agentic and scripted characteristics. Consider the specific requirements of your project to make the best choice.</p>
            `;
            resultDiv.className = 'decision-result neutral';
        }
    }
}

// Word Cloud
function initWordCloud() {
    const wordCloud = document.getElementById('wordCloud');
    const definitionPanel = document.getElementById('wordDefinition');
    const definitionTerm = document.getElementById('definitionTerm');
    const definitionText = document.getElementById('definitionText');
    const closeDefinition = document.getElementById('closeDefinition');
    
    if (!wordCloud) return;
    
    // Word cloud data
    const words = [
        { text: 'Artificial Intelligence', size: 5, category: 'ai', definition: 'The simulation of human intelligence processes by machines, especially computer systems.' },
        { text: 'Machine Learning', size: 5, category: 'ml', definition: 'A branch of AI that enables systems to learn and improve from experience without being explicitly programmed.' },
        { text: 'Neural Network', size: 4, category: 'dl', definition: 'A series of algorithms that attempt to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.' },
        { text: 'Deep Learning', size: 4, category: 'dl', definition: 'A subset of machine learning that uses neural networks with many layers to analyze various factors with a structure similar to the human neural system.' },
        { text: 'Algorithm', size: 3, category: 'general', definition: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.' },
        { text: 'Data Mining', size: 3, category: 'ml', definition: 'The process of discovering patterns and knowledge from large amounts of data.' },
        { text: 'Natural Language Processing', size: 3, category: 'nlp', definition: 'A field of AI that gives computers the ability to understand, interpret, and generate human language.' },
        { text: 'Computer Vision', size: 3, category: 'cv', definition: 'A field of AI that enables computers to interpret and make decisions based on visual data.' },
        { text: 'Reinforcement Learning', size: 3, category: 'ml', definition: 'A type of machine learning where an agent learns to make decisions by taking actions in an environment to achieve maximum cumulative reward.' },
        { text: 'Supervised Learning', size: 2, category: 'ml', definition: 'A type of machine learning where the model is trained on labeled data.' },
        { text: 'Unsupervised Learning', size: 2, category: 'ml', definition: 'A type of machine learning that looks for patterns in unlabeled data.' },
        { text: 'TensorFlow', size: 2, category: 'framework', definition: 'An open-source machine learning framework developed by Google.' },
        { text: 'PyTorch', size: 2, category: 'framework', definition: 'An open-source machine learning library developed by Facebook\'s AI Research lab.' },
        { text: 'Chatbot', size: 2, category: 'application', definition: 'A software application used to conduct an online chat conversation via text or text-to-speech.' },
        { text: 'Bias', size: 1, category: 'ethics', definition: 'Systematic and unfair discrimination in the results of an algorithm.' },
        { text: 'Ethics', size: 1, category: 'ethics', definition: 'The moral principles that govern the behavior of AI systems and their developers.' },
        { text: 'AGI', size: 1, category: 'ai', definition: 'Artificial General Intelligence - AI with the ability to understand, learn, and apply knowledge in a way similar to human intelligence.' },
        { text: 'API', size: 1, category: 'general', definition: 'Application Programming Interface - A set of rules that allows different software entities to communicate with each other.' },
        { text: 'Big Data', size: 1, category: 'general', definition: 'Extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations.' },
        { text: 'Blockchain', size: 1, category: 'emerging', definition: 'A distributed ledger technology that enables secure, transparent, and tamper-proof transactions.' }
    ];
    
    // Category colors
    const categoryColors = {
        'ai': '#3b82f6',
        'ml': '#10b981',
        'dl': '#8b5cf6',
        'nlp': '#ec4899',
        'cv': '#f59e0b',
        'framework': '#6366f1',
        'application': '#14b8a6',
        'ethics': '#ef4444',
        'general': '#6b7280',
        'emerging': '#f97316'
    };
    
    // Shuffle array function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Create word cloud items
    function createWordCloud() {
        wordCloud.innerHTML = '';
        const shuffledWords = shuffleArray([...words]);
        
        shuffledWords.forEach(word => {
            const wordElement = document.createElement('span');
            wordElement.className = `word-cloud-word word-size-${word.size}`;
            wordElement.textContent = word.text;
            wordElement.style.color = categoryColors[word.category] || '#6b7280';
            wordElement.dataset.definition = word.definition;
            wordElement.dataset.term = word.text;
            
            wordElement.addEventListener('click', (e) => {
                e.stopPropagation();
                showDefinition(word.text, word.definition);
                
                // Highlight the clicked word
                document.querySelectorAll('.word-cloud-word').forEach(w => {
                    w.classList.remove('active');
                });
                wordElement.classList.add('active');
            });
            
            wordCloud.appendChild(wordElement);
        });
    }
    
    // Show definition panel
    function showDefinition(term, definition) {
        definitionTerm.textContent = term;
        definitionText.textContent = definition;
        definitionPanel.classList.add('visible');
    }
    
    // Hide definition panel
    function hideDefinition() {
        definitionPanel.classList.remove('visible');
        document.querySelectorAll('.word-cloud-word').forEach(w => {
            w.classList.remove('active');
        });
    }
    
    // Close definition when clicking outside
    document.addEventListener('click', (e) => {
        if (!wordCloud.contains(e.target) && !definitionPanel.contains(e.target)) {
            hideDefinition();
        }
    });
    
    // Close button event
    if (closeDefinition) {
        closeDefinition.addEventListener('click', hideDefinition);
    }
    
    // Initialize word cloud
    createWordCloud();
    
    // Add animation to words
    gsap.from('.word-cloud-word', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: wordCloud,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

// Code Tabs
function initCodeTabs() {
    const tabButtons = document.querySelectorAll('.code-tab');
    const tabPanes = document.querySelectorAll('.code-pane');
    const copyButton = document.getElementById('copyCode');
    const runButton = document.getElementById('runCode');
    
    if (!tabButtons.length) return;
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('data-pane') === tabName) {
                    pane.classList.add('active');
                }
            });
            
            // Update button states
            if (runButton) {
                runButton.disabled = tabName !== 'result';
            }
        });
    });
    
    // Copy code button
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const activeTab = document.querySelector('.code-tab.active');
            if (activeTab) {
                const tabName = activeTab.getAttribute('data-tab');
                const activePane = document.querySelector(`.code-pane[data-pane="${tabName}"]`);
                
                if (activePane) {
                    const code = activePane.querySelector('code')?.textContent || '';
                    if (code) {
                        navigator.clipboard.writeText(code).then(() => {
                            // Show copied feedback
                            const originalText = copyButton.innerHTML;
                            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            setTimeout(() => {
                                copyButton.innerHTML = originalText;
                            }, 2000);
                        });
                    }
                }
            }
        });
    }
    
    // Run code button (for demo purposes)
    if (runButton) {
        runButton.addEventListener('click', () => {
            const resultGreeting = document.getElementById('resultGreeting');
            const resultChangeBtn = document.getElementById('resultChangeBtn');
            
            if (resultGreeting && resultChangeBtn) {
                let isChanged = false;
                
                resultChangeBtn.addEventListener('click', () => {
                    if (isChanged) {
                        resultGreeting.textContent = 'Hello, World!';
                        resultChangeBtn.textContent = 'Change Text';
                    } else {
                        resultGreeting.textContent = 'Text Changed!';
                        resultChangeBtn.textContent = 'Revert';
                    }
                    isChanged = !isChanged;
                });
                
                // Show success message
                const originalText = runButton.innerHTML;
                runButton.innerHTML = '<i class="fas fa-check"></i> Running...';
                setTimeout(() => {
                    runButton.innerHTML = originalText;
                }, 1000);
            }
        });
    }
}

// Quiz
function initQuiz() {
    const checkButton = document.getElementById('checkQuiz');
    const feedbackDiv = document.getElementById('quizFeedback');
    
    if (!checkButton || !feedbackDiv) return;
    
    // Quiz answers (question index: correct answer)
    const answers = {
        'q1': 'a',
        'q2': 'c'
    };
    
    // Check answers
    checkButton.addEventListener('click', () => {
        let score = 0;
        let total = Object.keys(answers).length;
        let feedback = [];
        
        // Check each question
        Object.entries(answers).forEach(([question, correctAnswer]) => {
            const selected = document.querySelector(`input[name="${question}"]:checked`);
            
            if (selected) {
                if (selected.value === correctAnswer) {
                    score++;
                } else {
                    // Add incorrect feedback
                    feedback.push(`Question ${question.substring(1)}: Incorrect. The correct answer is ${getAnswerText(question, correctAnswer)}.`);
                }
                
                // Disable all options after submission
                document.querySelectorAll(`input[name="${question}"]`).forEach(option => {
                    option.disabled = true;
                });
            } else {
                feedback.push(`Question ${question.substring(1)}: Not answered.`);
            }
        });
        
        // Display feedback
        if (score === total) {
            feedbackDiv.innerHTML = `
                <div class="quiz-feedback correct">
                    <h4>🎉 Perfect Score! (${score}/${total})</h4>
                    <p>Great job! You've answered all questions correctly.</p>
                </div>
            `;
        } else if (score > 0) {
            feedbackDiv.innerHTML = `
                <div class="quiz-feedback ${score === total ? 'correct' : 'incorrect'}">
                    <h4>${score === total ? '🎉 Perfect!' : '📝 Results: ' + score + '/' + total}</h4>
                    ${feedback.map(f => `<p>${f}</p>`).join('')}
                </div>
            `;
        } else {
            feedbackDiv.innerHTML = `
                <div class="quiz-feedback incorrect">
                    <h4>📝 Results: ${score}/${total}</h4>
                    <p>Don't worry! Review the material and try again.</p>
                    ${feedback.map(f => `<p>${f}</p>`).join('')}
                </div>
            `;
        }
        
        feedbackDiv.style.display = 'block';
        
        // Disable check button after submission
        checkButton.disabled = true;
    });
    
    // Helper function to get answer text
    function getAnswerText(question, answer) {
        const questions = {
            'q1': {
                'a': 'It\'s more engaging and helps with retention',
                'b': 'It requires less effort than traditional learning',
                'c': 'It\'s always faster than other methods'
            },
            'q2': {
                'a': 'A static image',
                'b': 'A block of text',
                'c': 'A clickable quiz with feedback'
            }
        };
        
        return questions[question]?.[answer] || '';
    }
}

// Sidebar Toggle for Mobile
function initSidebarToggle() {
    const sidebar = document.getElementById('lessonSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('visible');
            document.body.style.overflow = '';
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('visible');
            document.body.style.overflow = '';
        }
    });
}

// Progress Bar
function updateProgressBar() {
    const progressBar = document.getElementById('lessonProgress');
    const progressText = document.getElementById('progressText');
    const steps = document.querySelectorAll('.lesson-step');
    const activeStep = document.querySelector('.lesson-step.active');
    
    if (!progressBar || !progressText || !steps.length || !activeStep) return;
    
    const currentStep = parseInt(activeStep.dataset.step) || 1;
    const totalSteps = steps.length;
    const progress = Math.round((currentStep / totalSteps) * 100);
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}% Complete`;
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const updatePosition = (e) => {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        };
        
        element.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
            updatePosition();
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
        
        element.addEventListener('mousemove', updatePosition);
    });
}

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Back to Top Button
function toggleBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize GSAP animations
document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        const animation = el.getAttribute('data-animate');
        const delay = el.getAttribute('data-delay') || 0;
        const duration = el.getAttribute('data-duration') || 0.6;
        
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: parseFloat(duration),
            delay: parseFloat(delay),
            ease: 'power2.out'
        });
    });
    
    // Animate lesson steps
    document.querySelectorAll('.lesson-step').forEach((step, index) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });
});
