export const lessonsData = [
  {
    id: 'l1',
    level: 'A1',
    title: 'Basics & Greetings',
    description: 'Learn simple everyday greetings and basic expressions in German.',
    vocab: [
      { german: 'Hallo', english: 'Hello', category: 'Greetings', exampleGerman: 'Hallo! Wie geht es dir?', exampleEnglish: 'Hello! How are you?' },
      { german: 'Guten Morgen', english: 'Good morning', category: 'Greetings', exampleGerman: 'Guten Morgen, Herr Schmidt!', exampleEnglish: 'Good morning, Mr. Schmidt!' },
      { german: 'Auf Wiedersehen', english: 'Goodbye', category: 'Greetings', exampleGerman: 'Auf Wiedersehen! Bis bald.', exampleEnglish: 'Goodbye! See you soon.' },
      { german: 'Bitte', english: 'Please / You\'re welcome', category: 'Basics', exampleGerman: 'Ein Wasser, bitte.', exampleEnglish: 'A water, please.' },
      { german: 'Danke', english: 'Thank you', category: 'Basics', exampleGerman: 'Danke für das leckere Essen.', exampleEnglish: 'Thank you for the delicious food.' },
      { german: 'Ja', english: 'Yes', category: 'Basics', exampleGerman: 'Ja, ich spreche ein bisschen Deutsch.', exampleEnglish: 'Yes, I speak a little German.' },
      { german: 'Nein', english: 'No', category: 'Basics', exampleGerman: 'Nein, das ist nicht mein Buch.', exampleEnglish: 'No, that is not my book.' }
    ],
    grammar: {
      title: 'Subject Pronouns & the Verb "sein" (to be)',
      notes: 'In German, verbs change their endings based on the subject. The verb "sein" (to be) is irregular but extremely important.',
      table: [
        { subject: 'ich (I)', conjugation: 'bin (am)' },
        { subject: 'du (you, informal)', conjugation: 'bist (are)' },
        { subject: 'er/sie/es (he/she/it)', conjugation: 'ist (is)' },
        { subject: 'wir (we)', conjugation: 'sind (are)' },
        { subject: 'ihr (you plural, informal)', conjugation: 'seid (are)' },
        { subject: 'sie/Sie (they/you, formal)', conjugation: 'sind (are)' }
      ]
    },
    quiz: [
      {
        question: 'Translate "Hello" to German.',
        options: ['Guten Morgen', 'Hallo', 'Auf Wiedersehen', 'Danke'],
        answer: 'Hallo'
      },
      {
        question: 'Which conjugation of "sein" goes with "ich"?',
        options: ['bist', 'ist', 'sind', 'bin'],
        answer: 'bin'
      },
      {
        question: 'What is the formal German word for "Goodbye"?',
        options: ['Tschüss', 'Hallo', 'Auf Wiedersehen', 'Bitte'],
        answer: 'Auf Wiedersehen'
      }
    ]
  },
  {
    id: 'l2',
    level: 'A1',
    title: 'Introducing Yourself',
    description: 'Master the art of introducing yourself, saying where you are from and where you live.',
    vocab: [
      { german: 'Ich heiße...', english: 'My name is...', category: 'Conversational', exampleGerman: 'Ich heiße Thomas.', exampleEnglish: 'My name is Thomas.' },
      { german: 'Wie heißen Sie?', english: 'What is your name? (formal)', category: 'Conversational', exampleGerman: 'Wie heißen Sie, bitte?', exampleEnglish: 'What is your name, please?' },
      { german: 'Freut mich', english: 'Nice to meet you', category: 'Conversational', exampleGerman: 'Freut mich, Sie kennenzulernen.', exampleEnglish: 'Nice to meet you (formal).' },
      { german: 'Woher kommen Sie?', english: 'Where do you come from? (formal)', category: 'Conversational', exampleGerman: 'Woher kommen Sie, Frau Müller?', exampleEnglish: 'Where do you come from, Mrs. Müller?' },
      { german: 'Ich komme aus...', english: 'I come from...', category: 'Conversational', exampleGerman: 'Ich komme aus den USA.', exampleEnglish: 'I come from the USA.' },
      { german: 'Wo wohnen Sie?', english: 'Where do you live? (formal)', category: 'Conversational', exampleGerman: 'Wo wohnen Sie jetzt?', exampleEnglish: 'Where do you live now?' },
      { german: 'Ich wohne in...', english: 'I live in...', category: 'Conversational', exampleGerman: 'Ich wohne in Berlin.', exampleEnglish: 'I live in Berlin.' }
    ],
    grammar: {
      title: 'Regular Verb Conjugation in Present Tense (Präsens)',
      notes: 'Most German verbs follow a predictable pattern. To conjugate, drop the "-en" from the infinitive verb stem and add standard endings:',
      table: [
        { subject: 'ich (I)', conjugation: 'stem + -e (e.g., ich komme)' },
        { subject: 'du (you, informal)', conjugation: 'stem + -st (e.g., du kommst)' },
        { subject: 'er/sie/es (he/she/it)', conjugation: 'stem + -t (e.g., er kommt)' },
        { subject: 'wir (we)', conjugation: 'stem + -en (e.g., wir kommen)' },
        { subject: 'ihr (you plural)', conjugation: 'stem + -t (e.g., ihr kommt)' },
        { subject: 'sie/Sie (they/you formal)', conjugation: 'stem + -en (e.g., sie/Sie kommen)' }
      ]
    },
    quiz: [
      {
        question: 'How do you say "I live in Berlin" in German?',
        options: ['Ich wohne in Berlin.', 'Ich kommen aus Berlin.', 'Ich heiße Berlin.', 'Du wohnst in Berlin.'],
        answer: 'Ich wohne in Berlin.'
      },
      {
        question: 'What is the correct conjugation of "kommen" for the subject "du"?',
        options: ['komme', 'kommt', 'kommen', 'kommst'],
        answer: 'kommst'
      },
      {
        question: 'Translate: "Freut mich."',
        options: ['Good night', 'Nice to meet you', 'Excuse me', 'Please repeat'],
        answer: 'Nice to meet you'
      }
    ]
  },
  {
    id: 'l3',
    level: 'A2',
    title: 'Dining & Ordering',
    description: 'Learn to navigate a German restaurant, understand menus, and order food confidently.',
    vocab: [
      { german: 'das Essen', english: 'the food / meal', category: 'Restaurant', exampleGerman: 'Das Essen schmeckt lecker!', exampleEnglish: 'The food tastes delicious!' },
      { german: 'die Speisekarte', english: 'the menu', category: 'Restaurant', exampleGerman: 'Können wir die Speisekarte haben?', exampleEnglish: 'Can we have the menu?' },
      { german: 'die Rechnung', english: 'the bill / check', category: 'Restaurant', exampleGerman: 'Die Rechnung, bitte.', exampleEnglish: 'The bill, please.' },
      { german: 'Ich möchte...', english: 'I would like...', category: 'Restaurant', exampleGerman: 'Ich möchte einen Apfelsaft.', exampleEnglish: 'Ich möchte einen Apfelsaft.' },
      { german: 'Guten Appetit!', english: 'Enjoy your meal!', category: 'Restaurant', exampleGerman: 'Guten Appetit allerseits!', exampleEnglish: 'Enjoy your meal everyone!' },
      { german: 'trinken', english: 'to drink', category: 'Verbs', exampleGerman: 'Was möchten Sie trinken?', exampleEnglish: 'What would you like to drink?' },
      { german: 'bestellen', english: 'to order', category: 'Verbs', exampleGerman: 'Wir möchten jetzt bestellen.', exampleEnglish: 'We would like to order now.' }
    ],
    grammar: {
      title: 'Accusative Case (Akkusativ) - Direct Objects',
      notes: 'The direct object of a sentence takes the Accusative case. In German, only masculine articles change. Feminine, neuter, and plural remain the same.',
      table: [
        { subject: 'Masculine (der)', conjugation: 'becomes "den" / "einen" (e.g. einen Kaffee)' },
        { subject: 'Feminine (die)', conjugation: 'remains "die" / "eine" (e.g. eine Suppe)' },
        { subject: 'Neuter (das)', conjugation: 'remains "das" / "ein" (e.g. ein Wasser)' },
        { subject: 'Plural (die)', conjugation: 'remains "die" / "keine"' }
      ]
    },
    quiz: [
      {
        question: 'Which of the following is correct for: "I would like a coffee" (Coffee is masculine: der Kaffee)?',
        options: ['Ich möchte ein Kaffee.', 'Ich möchte eine Kaffee.', 'Ich möchte einen Kaffee.', 'Ich möchte den Kaffee.'],
        answer: 'Ich möchte einen Kaffee.'
      },
      {
        question: 'What is the German word for "the bill/check"?',
        options: ['die Speisekarte', 'die Rechnung', 'das Essen', 'die Gabel'],
        answer: 'die Rechnung'
      },
      {
        question: 'What does "Guten Appetit!" mean?',
        options: ['Good morning', 'Enjoy your meal', 'Have a safe trip', 'Happy birthday'],
        answer: 'Enjoy your meal'
      }
    ]
  },
  {
    id: 'l4',
    level: 'A2',
    title: 'Travel & Getting Around',
    description: 'Navigate public transport, ask for directions, and talk about travel locations.',
    vocab: [
      { german: 'der Bahnhof', english: 'the train station', category: 'Travel', exampleGerman: 'Wo ist der Bahnhof?', exampleEnglish: 'Where is the train station?' },
      { german: 'das Ticket', english: 'the ticket', category: 'Travel', exampleGerman: 'Ich muss ein Ticket kaufen.', exampleEnglish: 'Ich muss ein Ticket kaufen.' },
      { german: 'der Zug', english: 'the train', category: 'Travel', exampleGerman: 'Der Zug kommt pünktlich an.', exampleEnglish: 'The train arrives on time.' },
      { german: 'Wo ist...?', english: 'Where is...?', category: 'Directions', exampleGerman: 'Wo ist das Hotel?', exampleEnglish: 'Where is the hotel?' },
      { german: 'geradeaus', english: 'straight ahead', category: 'Directions', exampleGerman: 'Gehen Sie geradeaus.', exampleEnglish: 'Go straight ahead.' },
      { german: 'nach links / rechts', english: 'to the left / right', category: 'Directions', exampleGerman: 'Biegen Sie nach links ab.', exampleEnglish: 'Turn to the left.' },
      { german: 'die Verspätung', english: 'the delay', category: 'Travel', exampleGerman: 'Der Bus hat 10 Minuten Verspätung.', exampleEnglish: 'The bus has a 10-minute delay.' }
    ],
    grammar: {
      title: 'Dative Prepositions (Präpositionen mit Dativ)',
      notes: 'Certain prepositions always require their object to be in the Dative case. A popular mnemonic is: "mit, nach, von, zu, bei, aus, seit, gegenüber".',
      table: [
        { subject: 'mit (with)', conjugation: 'mit dem Auto (with the car - neuter dative)' },
        { subject: 'zu (to)', conjugation: 'zum Bahnhof (to the train station - masculine contraction)' },
        { subject: 'nach (after / to)', conjugation: 'nach Hause (to home) / nach dem Essen' },
        { subject: 'bei (at / with)', conjugation: 'beim Arzt (at the doctor - masculine contraction)' }
      ]
    },
    quiz: [
      {
        question: 'How do you ask "Where is the train station?" in German?',
        options: ['Wo ist der Bahnhof?', 'Wo ist der Flughafen?', 'Wie komme ich zum Strand?', 'Ist das der Bahnhof?'],
        answer: 'Wo ist der Bahnhof?'
      },
      {
        question: 'Which of the following prepositions ALWAYS triggers the Dative case?',
        options: ['für', 'ohne', 'mit', 'durch'],
        answer: 'mit'
      },
      {
        question: 'What is the German word for "straight ahead"?',
        options: ['links', 'rechts', 'zurück', 'geradeaus'],
        answer: 'geradeaus'
      }
    ]
  },
  {
    id: 'l5',
    level: 'B1',
    title: 'Professional Life & Working',
    description: 'Learn German terms related to jobs, interviews, and typical office environments.',
    vocab: [
      { german: 'der Beruf', english: 'the profession / job', category: 'Career', exampleGerman: 'Was sind Sie von Beruf?', exampleEnglish: 'What is your profession?' },
      { german: 'das Vorstellungsgespräch', english: 'the job interview', category: 'Career', exampleGerman: 'Ich habe morgen ein Vorstellungsgespräch.', exampleEnglish: 'I have a job interview tomorrow.' },
      { german: 'die Besprechung', english: 'the meeting / conference', category: 'Office', exampleGerman: 'Die Besprechung fängt um 9 Uhr an.', exampleEnglish: 'The meeting starts at 9 o\'clock.' },
      { german: 'die Arbeitserfahrung', english: 'the work experience', category: 'Career', exampleGerman: 'Haben Sie Arbeitserfahrung?', exampleEnglish: 'Do you have work experience?' },
      { german: 'sich bewerben um', english: 'to apply for', category: 'Verbs', exampleGerman: 'Ich bewerbe mich um die Stelle.', exampleEnglish: 'I am applying for the position.' },
      { german: 'der Kollege', english: 'the colleague (male)', category: 'Office', exampleGerman: 'Herr Weber ist ein netter Kollege.', exampleEnglish: 'Mr. Weber is a nice colleague.' },
      { german: 'das Gehalt', english: 'the salary', category: 'Career', exampleGerman: 'Das Gehalt wird monatlich überwiesen.', exampleEnglish: 'The salary is transferred monthly.' }
    ],
    grammar: {
      title: 'Subordinate Clauses with "weil" and "dass"',
      notes: 'In German subordinate clauses (introduced by conjunctions like "weil" or "dass"), the conjugated verb is kicked to the very end of the clause.',
      table: [
        { subject: 'Main Clause', conjugation: 'Ich lerne Deutsch. (Verb in position 2)' },
        { subject: 'Subordinate with "weil"', conjugation: '..., weil ich in Deutschland arbeiten will. (Verb at end)' },
        { subject: 'Subordinate with "dass"', conjugation: '..., dass er ein neues Auto gekauft hat. (Verb at end)' }
      ]
    },
    quiz: [
      {
        question: 'Which sentence has the correct word order?',
        options: [
          'Ich lerne Deutsch, weil ich möchte in Berlin wohnen.',
          'Ich lerne Deutsch, weil ich in Berlin wohnen möchte.',
          'Ich lerne Deutsch, weil möchte ich in Berlin wohnen.',
          'Weil ich möchte in Berlin wohnen, ich lerne Deutsch.'
        ],
        answer: 'Ich lerne Deutsch, weil ich in Berlin wohnen möchte.'
      },
      {
        question: 'What is the German word for "job interview"?',
        options: ['das Vorstellungsgespräch', 'die Besprechung', 'die Arbeitserfahrung', 'das Gehalt'],
        answer: 'das Vorstellungsgespräch'
      },
      {
        question: 'What is the translation of "die Besprechung"?',
        options: ['The interview', 'The meeting', 'The application', 'The training'],
        answer: 'The meeting'
      }
    ]
  }
];
