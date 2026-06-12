import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Flame, Trophy, Award, Sparkles, BookOpen, Star, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GRAMMAR_FACTS = [
  'German nouns are always capitalized (e.g., das Buch, der Mann).',
  'There are three genders for nouns in German: masculine (der), feminine (die), and neuter (das).',
  'In a statement sentence, the verb is always in the second position.',
  'Compound nouns are written as one word (e.g., der Hauptbahnhof = main train station).',
  'Prepositions can trigger accusative, dative, or both cases depending on context.',
  'Subordinate clauses kick the conjugated verb to the very end of the sentence.'
];

const CONJUGATION_ITEMS = [
  { verb: 'sein (to be)', pronoun: 'ich', correct: 'bin', options: ['bin', 'bist', 'ist', 'sind'] },
  { verb: 'sein (to be)', pronoun: 'du', correct: 'bist', options: ['bin', 'bist', 'ist', 'sind'] },
  { verb: 'sein (to be)', pronoun: 'er/sie/es', correct: 'ist', options: ['bin', 'ist', 'sind', 'seid'] },
  { verb: 'sein (to be)', pronoun: 'wir', correct: 'sind', options: ['sind', 'seid', 'ist', 'bin'] },
  { verb: 'sein (to be)', pronoun: 'ihr', correct: 'seid', options: ['seid', 'sind', 'ist', 'bist'] },
  { verb: 'haben (to have)', pronoun: 'ich', correct: 'habe', options: ['habe', 'hast', 'hat', 'haben'] },
  { verb: 'haben (to have)', pronoun: 'du', correct: 'hast', options: ['habe', 'hast', 'hat', 'haben'] },
  { verb: 'haben (to have)', pronoun: 'er/sie/es', correct: 'hat', options: ['habe', 'hast', 'hat', 'haben'] },
  { verb: 'haben (to have)', pronoun: 'wir', correct: 'haben', options: ['habe', 'haben', 'hat', 'habt'] },
  { verb: 'haben (to have)', pronoun: 'ihr', correct: 'habt', options: ['habt', 'haben', 'hast', 'hat'] },
  { verb: 'lernen (to learn)', pronoun: 'ich', correct: 'lerne', options: ['lerne', 'lernst', 'lernt', 'lernen'] },
  { verb: 'lernen (to learn)', pronoun: 'du', correct: 'lernst', options: ['lerne', 'lernst', 'lernt', 'lernen'] },
  { verb: 'lernen (to learn)', pronoun: 'er/sie/es', correct: 'lernt', options: ['lerne', 'lernst', 'lernt', 'lernen'] },
  { verb: 'lernen (to learn)', pronoun: 'wir', correct: 'lernen', options: ['lerne', 'lernen', 'lernt', 'lernt'] },
  { verb: 'sprechen (to speak)', pronoun: 'ich', correct: 'spreche', options: ['spreche', 'sprichst', 'spricht', 'sprechen'] },
  { verb: 'sprechen (to speak)', pronoun: 'du', correct: 'sprichst', options: ['spreche', 'sprichst', 'spricht', 'sprechen'] },
  { verb: 'sprechen (to speak)', pronoun: 'er/sie/es', correct: 'spricht', options: ['spreche', 'sprichst', 'spricht', 'sprechen'] }
];

export default function Dashboard({ xp, addXp, completedLessons, starredVocab, setView }) {
  // Streak calculations
  const [streak, setStreak] = useState(1);
  const [currentConjugation, setCurrentConjugation] = useState(null);
  const [selectedConjugationOpt, setSelectedConjugationOpt] = useState(null);
  const [conjugationSubmitted, setConjugationSubmitted] = useState(false);
  const [conjugationFeedback, setConjugationFeedback] = useState(null); // 'correct' | 'incorrect'
  const [tipIndex, setTipIndex] = useState(0);

  // Level computation
  const level = Math.floor(xp / 100) + 1;
  const currentXpInLevel = xp % 100;
  const xpNeededForNextLevel = 100;

  useEffect(() => {
    // Pick random conjugation game item on mount
    loadNewConjugation();
    // Rotate grammar facts index
    setTipIndex(Math.floor(Math.random() * GRAMMAR_FACTS.length));
    
    // Set mock streak
    const savedStreak = localStorage.getItem('deutsch_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    } else {
      localStorage.setItem('deutsch_streak', '3');
      setStreak(3);
    }
  }, []);

  const loadNewConjugation = () => {
    const randomItem = CONJUGATION_ITEMS[Math.floor(Math.random() * CONJUGATION_ITEMS.length)];
    // Shuffle options
    const shuffledOptions = [...randomItem.options].sort(() => Math.random() - 0.5);
    setCurrentConjugation({
      ...randomItem,
      options: shuffledOptions
    });
    setSelectedConjugationOpt(null);
    setConjugationSubmitted(false);
    setConjugationFeedback(null);
  };

  const handleConjugationSubmit = (opt) => {
    if (conjugationSubmitted) return;
    setSelectedConjugationOpt(opt);
    setConjugationSubmitted(true);
    if (opt === currentConjugation.correct) {
      setConjugationFeedback('correct');
      addXp(10); // Reward 10 XP
    } else {
      setConjugationFeedback('incorrect');
    }
  };

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % GRAMMAR_FACTS.length);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Willkommen zurück! <Sparkles className="h-5 w-5 text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">Keep studying to hit your daily goal and unlock new milestones.</p>
        </div>
      </div>

      {/* Level & Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak card */}
        <Card className="border-slate-900 bg-slate-950/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Flame className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Day Streak</p>
              <p className="text-2xl font-black text-slate-100">{streak} Days</p>
            </div>
          </CardContent>
        </Card>

        {/* Level card */}
        <Card className="border-slate-900 bg-slate-950/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level {level}</p>
              <p className="text-2xl font-black text-slate-100">{xp} XP</p>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentXpInLevel / xpNeededForNextLevel) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wide">
                {100 - currentXpInLevel} XP to Level {level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saved Vocab card */}
        <Card className="border-slate-900 bg-slate-950/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Starred Words</p>
              <p className="text-2xl font-black text-slate-100">{starredVocab.length} Words</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Conjugation Trainer & Grammar Fact */}
        <div className="md:col-span-2 space-y-6">
          {/* Mini-Game: Conjugation Trainer */}
          {currentConjugation && (
            <Card className="border-slate-900 bg-slate-950/20">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <Award className="h-4.5 w-4.5 text-indigo-400" />
                    Conjugation Practice
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">Conjugate the verb correctly for +10 XP.</CardDescription>
                </div>
                {conjugationSubmitted && (
                  <Button variant="ghost" size="sm" onClick={loadNewConjugation} className="h-8 w-8 p-0 text-slate-500 hover:text-slate-350 rounded-lg">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verb: {currentConjugation.verb}</span>
                  <div className="text-xl font-bold text-slate-100">
                    <span className="text-indigo-400 mr-2">{currentConjugation.pronoun}</span>
                    ___________
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {currentConjugation.options.map((opt, idx) => {
                    const isSelected = selectedConjugationOpt === opt;
                    const isCorrect = opt === currentConjugation.correct;

                    let btnVariant = 'secondary';
                    let borderStyle = '';
                    
                    if (conjugationSubmitted) {
                      if (isCorrect) {
                        btnVariant = 'default'; // will use indigo
                        borderStyle = '!border-emerald-500/50 !bg-emerald-500/10 !text-emerald-400';
                      } else if (isSelected) {
                        borderStyle = '!border-red-500/50 !bg-red-500/10 !text-red-400';
                      }
                    }

                    return (
                      <Button
                        key={idx}
                        variant={btnVariant}
                        disabled={conjugationSubmitted}
                        className={`normal-case text-xs h-10 border border-slate-950 font-bold cursor-pointer transition-all ${borderStyle}`}
                        onClick={() => handleConjugationSubmit(opt)}
                      >
                        {opt}
                      </Button>
                    );
                  })}
                </div>

                {/* Feedback Panel */}
                <AnimatePresence>
                  {conjugationSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-3 rounded-lg flex items-center gap-2 border text-xs font-semibold ${
                        conjugationFeedback === 'correct'
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/25 text-red-400'
                      }`}
                    >
                      {conjugationFeedback === 'correct' ? (
                        <>
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                          <span>Correct! You earned +10 XP. Well done!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                          <span>Incorrect. The correct answer was "{currentConjugation.correct}".</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )}

          {/* Quick Fact rotation */}
          <Card className="border-slate-900 bg-slate-950/20">
            <CardHeader className="pb-1 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Grammar Fact of the Day
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={nextTip} className="h-7 w-7 p-0 text-slate-650 hover:text-slate-400 rounded-lg">
                <RefreshCw className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-xs font-medium text-slate-350 leading-relaxed italic">
                "{GRAMMAR_FACTS[tipIndex]}"
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Quick Learning Path and Activity */}
        <div className="space-y-6">
          {/* Streak Tracker Calendar */}
          <Card className="border-slate-900 bg-slate-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Flame className="h-4.5 w-4.5 text-orange-400" />
                Study Calendar
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">Your study streak status this week.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  // highlight Mon, Tue, Wed as streak=3
                  const isActive = idx < streak;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{day}</span>
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-sm'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}>
                        {isActive ? '✓' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick learning link */}
          <Card className="border-slate-900 bg-indigo-950/10 border-indigo-500/5">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
                  Ready to study?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You have completed {completedLessons.length} lessons. Head to the Lessons dashboard to start your next course!
                </p>
              </div>
              <Button onClick={() => setView('lessons')} className="w-full text-xs">
                Open Lessons
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
