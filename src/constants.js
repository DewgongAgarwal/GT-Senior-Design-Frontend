  const questions = [
    "Have you been facing any drop in grades recently ?",
    "Have you been regularly going to classes ?",
    "Do you need help in succeeding in your classes ?",
    "Do you need help in building time management skills ?",
    "Are you facing any hardships in school or personal life ?", 
    "Are you facing increased levels of stress ?",
    "Are you getting enough physical activity ?",
    'Are you engaging in healthy behavior such as getting enough sleep/hydration/eating healthy ?',
    "Are your nutritional needs met ?",
    "Do you need help with eating healthily ?", 
    "I feel that I belong at my college/university.", 
    "Would you like to make more friends ?",
    'Are you a part of clubs on campus ?',
    "Are you aware of the cultural resources (LBTQIA+, Women's, Veteran's, etc.) on campus/are you connected with them ?",
    "Are you getting personal enrichment from school ?",
    "Are you happy in your major ?",
    "Are the things you are studying in alignment with your beliefs and interests ?",
    "Are you participating in things outside school that enrich you ?",  
    "Do you participate in spiritual or religious activities ?",
    "Do you feel like you have a purpose in life ?",
    "Do you practice gratitude and self-compassion ?",
    "Would you like to find ways of expanding your curiosity ?",
    "Are you curious about furthering your education ?",
    "Do you believe you have enough information about living more sustainably at Georgia Tech ?",
    "Do you have enough financial resources to have your needs met (food, books, laptop, etc.) ?",
    "Do you want to know more on how to manage your financial resources ?",
    "Have you ever received any disability accommodation in the past ?", 
    "Do you have a new disability/ difficulty that you might need academic support for ?",
    "Do you need to talk to a dean about academic issues ?"
  ];

  const choices = ["Never", "Rarely", "Occasionally", "Frequently", "Usually"];
  const numberOfQuestions = questions.length;

  const arms = ["Academic Services", "Career Exploration and Coaching", "Wellness Enhancement Opportunities",
  "Physical Wellbeing Resources", "Mindfulness Resources", "Social Wellbeing and Engagement",
  "Spiritual Engagement and Volunteering", "Disability Services", "Academic Support - Dean of Students",
  "One-on-One Consultation", "Other"];

  export {questions, choices, numberOfQuestions, arms}