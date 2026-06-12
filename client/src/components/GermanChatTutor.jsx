import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Volume2, Sparkles, Send, Award, Compass, Coffee, Briefcase, RefreshCw } from 'lucide-react';

const SCENARIOS = {
  cafe: {
    title: 'At the Café ("Im Café")',
    description: 'Practice ordering drinks and snacks, asking for the bill, and conversing with a waiter.',
    icon: Coffee,
    startMessage: 'Hallo! Willkommen im Café Berlin. Was darf ich Ihnen heute bringen?',
    startMessageEn: 'Hello! Welcome to Cafe Berlin. What can I bring you today?',
    steps: {
      start: {
        options: [
          {
            text: 'Hallo! Ich möchte einen Kaffee und ein Stück Kuchen, bitte.',
            textEn: 'Hello! I would like a coffee and a piece of cake, please.',
            grammarTip: 'Notice the accusative: "einen Kaffee" (masculine direct object).',
            nextStep: 'milch_zucker'
          },
          {
            text: 'Guten Tag. Haben Sie auch eine Speisekarte auf Englisch?',
            textEn: 'Good day. Do you also have a menu in English?',
            grammarTip: 'Using "haben Sie" is the polite formal way to ask questions.',
            nextStep: 'english_menu'
          }
        ]
      },
      milch_zucker: {
        botReply: 'Sehr gerne. Möchten Sie Milch und Zucker in Ihren Kaffee?',
        botReplyEn: 'With pleasure. Would you like milk and sugar in your coffee?',
        options: [
          {
            text: 'Ja, bitte. Mit viel Milch aber ohne Zucker.',
            textEn: 'Yes, please. With lots of milk but without sugar.',
            grammarTip: '"Mit" (with) and "ohne" (without) are prepositions.',
            nextStep: 'bill_please'
          },
          {
            text: 'Nein, danke. Schwarz ist perfekt für mich.',
            textEn: 'No, thank you. Black is perfect for me.',
            grammarTip: '"Schwarz" is the adjective meaning black.',
            nextStep: 'bill_please'
          }
        ]
      },
      english_menu: {
        botReply: 'Ja, natürlich! Bitte schön. Haben Sie schon eine Wahl getroffen?',
        botReplyEn: 'Yes, of course! Here you go. Have you made a choice yet?',
        options: [
          {
            text: 'Ja, ich nehme ein Mineralwasser und die Tagessuppe.',
            textEn: 'Yes, I will take a mineral water and the soup of the day.',
            grammarTip: '"ein Mineralwasser" (neuter) and "die Tagessuppe" (feminine) are accusative.',
            nextStep: 'bill_please'
          }
        ]
      },
      bill_please: {
        botReply: 'Hier ist Ihre Bestellung. Guten Appetit! Benötigen Sie sonst noch etwas?',
        botReplyEn: 'Here is your order. Enjoy your meal! Do you need anything else?',
        options: [
          {
            text: 'Nein, danke. Ich möchte jetzt zahlen. Die Rechnung, bitte.',
            textEn: 'No, thank you. I would like to pay now. The bill, please.',
            grammarTip: '"zahlen" means to pay. "Die Rechnung, bitte" is the standard phrase.',
            nextStep: 'final_step'
          }
        ]
      },
      final_step: {
        botReply: 'Das macht zusammen 7,80 Euro. Vielen Dank für Ihren Besuch und einen schönen Tag noch!',
        botReplyEn: 'That comes to 7.80 Euros in total. Thank you for your visit and have a nice day!',
        options: [] // Ends conversation
      }
    }
  },
  directions: {
    title: 'Asking Directions ("Wegbeschreibung")',
    description: 'Ask for directions to the station, find local sights, and understand navigational instructions.',
    icon: Compass,
    startMessage: 'Entschuldigung, kann ich Ihnen helfen? Sie sehen ein bisschen verloren aus.',
    startMessageEn: 'Excuse me, can I help you? You look a bit lost.',
    steps: {
      start: {
        options: [
          {
            text: 'Ja, bitte! Wo ist der nächste Bahnhof?',
            textEn: 'Yes, please! Where is the nearest train station?',
            grammarTip: '"Bahnhof" is masculine (der), so "der nächste Bahnhof" is nominative here.',
            nextStep: 'station_directions'
          },
          {
            text: 'Entschuldigung, ich suche das Goethe-Museum. Ist das weit?',
            textEn: 'Excuse me, I am looking for the Goethe Museum. Is it far?',
            grammarTip: '"suchen" (to search/look for) takes the accusative case.',
            nextStep: 'museum_directions'
          }
        ]
      },
      station_directions: {
        botReply: 'Der Bahnhof ist ganz in der Nähe. Gehen Sie geradeaus und biegen Sie nach rechts ab.',
        botReplyEn: 'The station is very nearby. Go straight ahead and then turn right.',
        options: [
          {
            text: 'Vielen Dank! Ist das weit zu Fuß?',
            textEn: 'Thank you very much! Is it far on foot?',
            grammarTip: '"zu Fuß" is the set phrase for "on foot".',
            nextStep: 'final_directions'
          }
        ]
      },
      museum_directions: {
        botReply: 'Ah, das Goethe-Museum! Das ist zu weit zu Fuß. Nehmen Sie am besten die U-Bahn Linie 2.',
        botReplyEn: 'Ah, the Goethe Museum! That is too far on foot. Best to take the Subway Line 2.',
        options: [
          {
            text: 'Verstehe. Wo kann ich eine Fahrkarte kaufen?',
            textEn: 'I understand. Where can I buy a ticket?',
            grammarTip: '"Fahrkarte" is the German word for travel ticket.',
            nextStep: 'final_directions'
          }
        ]
      },
      final_directions: {
        botReply: 'Am Ticketautomaten dort drüben. Gute Fahrt und viel Spaß in Berlin!',
        botReplyEn: 'At the ticket machine over there. Have a good trip and have fun in Berlin!',
        options: []
      }
    }
  },
  interview: {
    title: 'Job Interview ("Vorstellungsgespräch")',
    description: 'Prepare for professional settings by practicing questions about experience, skills, and goals.',
    icon: Briefcase,
    startMessage: 'Guten Tag! Schön, dass Sie da sind. Erzählen Sie mir bitte etwas über sich.',
    startMessageEn: 'Good day! Nice that you are here. Please tell me a bit about yourself.',
    steps: {
      start: {
        options: [
          {
            text: 'Guten Tag. Ich habe Informatik studiert und suche eine neue Herausforderung.',
            textEn: 'Good day. I studied computer science and am looking for a new challenge.',
            grammarTip: '"studieren" is used for academic studies, "lernen" for general learning.',
            nextStep: 'skills_question'
          },
          {
            text: 'Hallo. Ich bewerbe mich um diese Stelle, weil ich viel Arbeitserfahrung habe.',
            textEn: 'Hello. I am applying for this position because I have a lot of work experience.',
            grammarTip: '"bewerben um" is a reflexive verb: "ich bewerbe mich".',
            nextStep: 'skills_question'
          }
        ]
      },
      skills_question: {
        botReply: 'Interessant. Was würden Sie sagen, sind Ihre größten Stärken im Beruf?',
        botReplyEn: 'Interesting. What would you say are your greatest strengths at work?',
        options: [
          {
            text: 'Ich bin sehr zuverlässig, flexibel und arbeite gerne im Team.',
            textEn: 'I am very reliable, flexible, and enjoy working in a team.',
            grammarTip: '"im Team arbeiten" means to work in a team.',
            nextStep: 'why_company'
          },
          {
            text: 'Meine Stärke ist die Problemlösung und ich lerne sehr schnell neue Technologien.',
            textEn: 'My strength is problem solving and I learn new technologies very quickly.',
            grammarTip: '"Problemlösung" is a compound noun: Problem + Lösung.',
            nextStep: 'why_company'
          }
        ]
      },
      why_company: {
        botReply: 'Das klingt hervorragend. Warum möchten Sie ausgerechnet bei unserer Firma arbeiten?',
        botReplyEn: 'That sounds excellent. Why do you want to work for our company in particular?',
        options: [
          {
            text: 'Ich denke, dass Ihre Firma zukunftsorientiert und sehr erfolgreich ist.',
            textEn: 'I think that your company is future-oriented and very successful.',
            grammarTip: 'The subordinate clause starting with "dass" kicks the verb "ist" to the end.',
            nextStep: 'final_interview'
          }
        ]
      },
      final_interview: {
        botReply: 'Vielen Dank für Ihre Antworten. Wir melden uns nächste Woche bei Ihnen. Auf Wiedersehen!',
        botReplyEn: 'Thank you very much for your answers. We will get in touch with you next week. Goodbye!',
        options: []
      }
    }
  }
};

export default function GermanChatTutor({ addXp }) {
  const [activeScenarioKey, setActiveScenarioKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentStepKey, setCurrentStepKey] = useState('start');
  const [lastTip, setLastTip] = useState('');
  const [completed, setCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  const activeScenario = SCENARIOS[activeScenarioKey];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakGerman = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const selectScenario = (key) => {
    setActiveScenarioKey(key);
    setMessages([
      {
        sender: 'bot',
        text: SCENARIOS[key].startMessage,
        textEn: SCENARIOS[key].startMessageEn
      }
    ]);
    setCurrentStepKey('start');
    setLastTip('');
    setCompleted(false);
  };

  const handleOptionSelect = (option) => {
    // 1. Add User response
    const userMsg = {
      sender: 'user',
      text: option.text,
      textEn: option.textEn
    };
    
    // 2. Determine bot response
    const nextStepKey = option.nextStep;
    const nextStep = activeScenario.steps[nextStepKey];

    let botMsg = null;
    if (nextStep && nextStep.botReply) {
      botMsg = {
        sender: 'bot',
        text: nextStep.botReply,
        textEn: nextStep.botReplyEn
      };
    }

    setMessages(prev => botMsg ? [...prev, userMsg, botMsg] : [...prev, userMsg]);
    setCurrentStepKey(nextStepKey);
    setLastTip(option.grammarTip);

    // Check if next step has no options (end of dialogue)
    if (!nextStep || !nextStep.options || nextStep.options.length === 0) {
      setCompleted(true);
      // Award XP
      addXp(30);
    }
  };

  const resetScenario = () => {
    if (activeScenarioKey) {
      selectScenario(activeScenarioKey);
    }
  };

  return (
    <div className="w-full space-y-6">
      {!activeScenarioKey ? (
        // SCENARIOS SELECTOR
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">AI Conversation Tutor</h2>
            <p className="text-xs text-slate-500 mt-1">
              Simulate realistic everyday dialogues with Klaus, your German tutor, and gain conversational confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(SCENARIOS).map(([key, scenario]) => {
              const Icon = scenario.icon;
              return (
                <Card 
                  key={key} 
                  className="border-slate-900 bg-slate-950/20 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
                >
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-200">{scenario.title}</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button onClick={() => selectScenario(key)} className="w-full text-xs">
                      Start Conversation
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        // ACTIVE CHAT VIEW
        <div className="flex flex-col h-[520px] bg-slate-950/20 border border-slate-900 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-900 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm relative">
                K
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Klaus (German Tutor)</h4>
                <p className="text-[10px] text-slate-400">Scenario: {activeScenario.title}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setActiveScenarioKey(null)} className="text-slate-400 hover:text-slate-200">
              Change Scenario
            </Button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0 bg-slate-900/5">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 border space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 border-indigo-600/50 text-white rounded-br-none'
                    : 'bg-slate-900/40 border-slate-800 text-slate-100 rounded-bl-none'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakGerman(msg.text)}
                        className="p-1 text-slate-500 hover:text-indigo-400 rounded-md cursor-pointer shrink-0"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className={`text-[10px] ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'} italic`}>
                    {msg.textEn}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Grammar tip callout */}
            {lastTip && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-2 max-w-md mx-auto"
              >
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[10px] text-indigo-300">
                  <span className="font-bold">Grammar Insight:</span> {lastTip}
                </div>
              </motion.div>
            )}

            {/* Completion Banner */}
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-6 border border-emerald-500/25 bg-emerald-500/[0.02] rounded-2xl text-center space-y-3 max-w-sm mx-auto"
              >
                <Award className="h-8 w-8 text-emerald-400 animate-bounce" />
                <div>
                  <h5 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Conversation Finished</h5>
                  <p className="text-[11px] text-slate-400 mt-1">Excellent work! You handled the dialogue successfully.</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                  +30 XP Earned
                </div>
                <Button size="sm" onClick={resetScenario} className="flex items-center space-x-1 text-[10px]">
                  <RefreshCw className="h-3 w-3" />
                  <span>Restart Scenario</span>
                </Button>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* User Reply Selector / Options footer */}
          <div className="p-4 bg-slate-950/60 border-t border-slate-900 shrink-0">
            {completed ? (
              <div className="flex justify-center">
                <Button size="sm" onClick={() => setActiveScenarioKey(null)}>
                  Go Back to Scenarios
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Select your response:
                </div>
                <div className="flex flex-col gap-2">
                  {activeScenario.steps[currentStepKey]?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(opt)}
                      className="w-full text-left p-3 rounded-xl border border-slate-900 bg-slate-900/20 hover:border-slate-800 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-900/40 transition-all duration-200 cursor-pointer flex justify-between items-center gap-2 group"
                    >
                      <div className="space-y-0.5">
                        <span className="block">{opt.text}</span>
                        <span className="block text-[10px] text-slate-500 font-normal italic">{opt.textEn}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
