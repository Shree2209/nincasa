document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Header ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Booking Form Tabs ---
  const bookingTabs = document.querySelectorAll('.booking-tab');
  const bookingPanes = document.querySelectorAll('.booking-form-pane');
  const bookingStatus = document.getElementById('booking-status');

  bookingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active states
      bookingTabs.forEach(t => t.classList.remove('active'));
      bookingPanes.forEach(p => p.classList.remove('active'));
      bookingStatus.style.display = 'none';

      // Add active state to current
      tab.classList.add('active');
      const targetPane = document.getElementById(tab.dataset.target);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Handle Form Submissions
  const diningForm = document.getElementById('pane-dining');
  const eventsForm = document.getElementById('pane-events');

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    bookingStatus.style.display = 'block';
    e.target.reset();
    
    // Smooth scroll status into view if needed
    bookingStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto hide after 8 seconds
    setTimeout(() => {
      bookingStatus.style.display = 'none';
    }, 8000);
  };

  if (diningForm) diningForm.addEventListener('submit', handleBookingSubmit);
  if (eventsForm) eventsForm.addEventListener('submit', handleBookingSubmit);

  // Set default dates to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const diningDate = document.getElementById('dining-date');
  if (diningDate) {
    diningDate.value = tomorrowStr;
    diningDate.min = tomorrowStr;
  }

  const eventDate = document.getElementById('event-date');
  if (eventDate) {
    eventDate.value = tomorrowStr;
    eventDate.min = tomorrowStr;
  }

  // --- Craft Brew Matcher (Interactive Quiz) ---
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizFooter = document.getElementById('quiz-footer');
  const quizResult = document.getElementById('quiz-result');
  const quizProgress = document.getElementById('quiz-progress');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnReset = document.getElementById('btn-reset-quiz');
  
  const matchName = document.getElementById('match-name');
  const matchDesc = document.getElementById('match-desc');

  let currentStep = 1;
  const answers = {
    flavor: null,
    abv: null,
    lifestyle: null
  };

  const pairings = {
    pilsner: {
      name: 'Golden Pilsner & Wood-Fired Flatbread',
      desc: 'Your preference for clean, crisp notes and light ABV matches perfectly with our Golden Pilsner paired with our Wood-Fired Hops Flatbread. The caramelized onions and local goat cheese on our flatbread highlight the floral hops and clean finish of our signature pilsner.'
    },
    ipa: {
      name: 'Hazy Horizon IPA & Brewmaster Ribeye',
      desc: 'You love bold, citrusy notes and robust beer. The Hazy Horizon IPA paired with our dry-aged Brewmaster Ribeye Steak is your ultimate match. The intense hop profile cut through the richness of our fire-cooked steak, creating a beautifully balanced flavor dialogue.'
    },
    stout: {
      name: 'Amber Nectar Stout & Stout-Glazed Ribs',
      desc: 'You favor rich, roasted, and dark profiles. The Amber Nectar Stout paired with our 12-hour Stout-Glazed Beef Ribs is made for you. The chocolate and espresso malts in the stout harmonize with the savory depth of our house glaze.'
    }
  };

  // Option selection logic
  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      const stepEl = this.closest('.quiz-step');
      const stepIndex = parseInt(stepEl.dataset.step);
      
      // Clear previous selections in this step
      stepEl.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
      
      // Select clicked option
      this.classList.add('selected');

      // Record answer
      const val = this.dataset.value;
      if (stepIndex === 1) answers.flavor = val;
      if (stepIndex === 2) answers.abv = val;
      if (stepIndex === 3) answers.lifestyle = val;
      
      updateQuizNav();
    });
  });

  const getStepSelectedValue = (stepNum) => {
    if (stepNum === 1) return answers.flavor;
    if (stepNum === 2) return answers.abv;
    if (stepNum === 3) return answers.lifestyle;
    return null;
  };

  const updateQuizNav = () => {
    // Enable/Disable buttons based on steps
    btnPrev.disabled = (currentStep === 1);
    
    // Check if current step has an answer selected
    const selected = getStepSelectedValue(currentStep);
    btnNext.disabled = !selected;

    // Update progress text
    if (currentStep <= 3) {
      quizProgress.textContent = `Step ${currentStep} of 3`;
      quizProgress.style.display = 'block';
    } else {
      quizProgress.style.display = 'none';
    }
  };

  const showStep = (stepNum) => {
    quizSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.dataset.step) === stepNum) {
        step.classList.add('active');
      }
    });
    
    quizResult.classList.remove('active');
    quizFooter.style.display = 'flex';
    currentStep = stepNum;
    updateQuizNav();
  };

  btnNext.addEventListener('click', () => {
    if (currentStep < 3) {
      showStep(currentStep + 1);
    } else {
      calculateAndShowResult();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });

  const calculateAndShowResult = () => {
    // Hide questions and footer
    quizSteps.forEach(step => step.classList.remove('active'));
    quizFooter.style.display = 'none';
    
    let recommendation = pairings.pilsner; // Default

    // Simple rule decision matrix
    if (answers.flavor === 'bold' || (answers.lifestyle === 'cozy' && answers.flavor !== 'crisp')) {
      recommendation = pairings.stout;
    } else if (answers.flavor === 'citrusy' || answers.abv === 'heavy') {
      recommendation = pairings.ipa;
    } else {
      recommendation = pairings.pilsner;
    }

    // Apply result to DOM
    matchName.textContent = recommendation.name;
    matchDesc.textContent = recommendation.desc;

    // Display result screen
    quizResult.classList.add('active');
  };

  btnReset.addEventListener('click', () => {
    // Reset answers
    answers.flavor = null;
    answers.abv = null;
    answers.lifestyle = null;
    
    // Reset options UI
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    
    // Go to step 1
    showStep(1);
  });

  // Initialize quiz state
  updateQuizNav();
});
