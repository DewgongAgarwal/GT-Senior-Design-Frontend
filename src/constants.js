  const questions = [
    "Have you experienced a recent drop in grades?",
    "Have you been attending classes regularly?",
    "Do you need help in succeeding in your classes?",
    "Do you need help in developing your time management skills?",
    "Are you facing problems in your school or personal life which might benefit from some assistance?",
    "Are you experiencing a significant level of stress?",
    "Are you getting enough physical activity?",
    "Are you engaging in healthy behaviors such as getting enough sleep/hydration/nutritious eating?",
    "Are your nutritional needs met?",
    "Do you need help with healthy eating habits?",
    "I feel that I belong at my college/university.",
    "Would you like to have more friends?",
    "Do you belong to any student organizations on campus?",
    " If so, are you connected with them?",
    "Do you feel that school is enriching you personally?",
    "Are you happy in your major?",
    "Are the things you are studying in alignment with your beliefs and interests?",
    "Are you participating in opportunities outside of your academics that enrich you?",
    "Do you participate in spiritual or religious activities?",
    "Do you feel like you have a purpose in life?",
    "Do you practice gratitude and self-compassion?",
    "Would you like to find ways of expanding your curiosity?",
    "Are you curious about furthering your education?",
    "Do you believe you have enough information about living more sustainably at Georgia Tech?",
    "Do you have sufficient financial resources to meet your needs (food, books, laptop, etc.)?",
    "Do you want to know more about how to manage your financial resources?",
    "Have you received a disability accommodation in the past?",
    "Do you have a new disability/ difficulty that you might need academic support for?",
    "Do you need to talk to a dean about academic issues?"
  ];


  const questions2 = [
    "Have you experienced a recent drop in grades?",
    "Have you been attending classes regularly?",
    "Do you need help in succeeding in your classes?",
    "Do you need help in developing your time management skills?",
    "Are you facing problems in your school or personal life which might benefit from some assistance?",
  ];



  const choices = ["Never", "Rarely", "Occasionally", "Frequently", "Usually"];
  const numberOfQuestions = questions.length;
  const numberOfQuestions2 = questions2.length;

  const arms = ["Academic Services", "Career Exploration and Coaching", "Wellness Enhancement Opportunities",
  "Physical Wellbeing Resources", "Mindfulness Resources", "Social Wellbeing and Engagement",
  "Spiritual Engagement and Volunteering", "Disability Services", "Academic Support - Dean of Students",
  "One-on-One Consultation", "Other"];

  export {questions, questions2, choices, numberOfQuestions, numberOfQuestions2, arms}
