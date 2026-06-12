import React, { useState } from 'react';
import { lessonsData } from '../data/lessonsData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Volume2, Award, CheckCircle2, ArrowRight, ArrowLeft, GraduationCap, Star, ListChecks } from 'lucide-react';
import api from '../api';

export default function Lessons({ addXp, completedLessons, markLessonComplete, starredVocab, toggleStarVocab }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab'); // 'vocab' | 'grammar' | 'quiz'
  
  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const speakGerman = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any active speaking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85; // slightly slower for language learners
      window.speechSynthesis.speak(utterance);
    }
  };

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('vocab');
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizFinished(false);
    setQuizScore(0);
  };

  const handleOptionSelect = (option) => {
    if (quizSubmitted) return;
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;
    
    const currentQuestion = selectedLesson.quiz[currentQuestionIdx];
    if (selectedOption === currentQuestion.answer) {
      setQuizScore(quizScore + 1);
    }
    setQuizSubmitted(true);
  };

  const nextQuestion = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < selectedLesson.quiz.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      // Award XP
      const awardedXp = selectedLesson.quiz.length * 15;
      addXp(awardedXp);
      markLessonComplete(selectedLesson.id);
    }
  };

  if (selectedLesson) {
    const isCompleted = completedLessons.includes(selectedLesson.id);

    return (
      <div className="w-full space-y-6">
        {/* Back Button and Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="flex items-center space-x-2 text-slate-400 hover:text-slate-200" onClick={() => setSelectedLesson(null)}>
            <ArrowLeft className="h-4 w-4" />
            <span>All Lessons</span>
          </Button>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
            Level {selectedLesson.level}
          </span>
        </div>

        <Card className="w-full border-slate-900 bg-slate-950/20">
          <CardHeader className="pb-4 border-b border-slate-900/60 p-6 md:p-8">
            <CardTitle className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-indigo-500" />
              {selectedLesson.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-400 mt-1">
              {selectedLesson.description}
            </CardDescription>
          </CardHeader>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-900/60 px-4 md:px-8">
            {['vocab', 'grammar', 'quiz'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'vocab' && 'Vocabulary'}
                {tab === 'grammar' && 'Grammar'}
                {tab === 'quiz' && 'Interactive Quiz'}
              </button>
            ))}
          </div>

          <CardContent className="p-6 md:p-8">
            {/* 1. Vocabulary Tab */}
            {activeTab === 'vocab' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Vocabulary Words & Expressions ({selectedLesson.vocab.length})
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {selectedLesson.vocab.map((v, i) => {
                    const isStarred = starredVocab.some(sv => sv.german === v.german);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/20 border border-slate-900 rounded-xl hover:border-slate-800 transition-all duration-300 group"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-100">{v.german}</span>
                            <button
                              onClick={() => speakGerman(v.german)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                              title="Listen Pronunciation"
                            >
                              <Volume2 className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => toggleStarVocab(v)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isStarred ? 'text-amber-400 hover:text-amber-500' : 'text-slate-500 hover:text-amber-400'
                              }`}
                              title={isStarred ? 'Remove from review deck' : 'Add to review deck'}
                            >
                              <Star className={`h-4.5 w-4.5 ${isStarred ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-950/40 px-2 py-0.5 rounded-md mr-2">
                              {v.category}
                            </span>
                            <span className="text-sm text-slate-300">{v.english}</span>
                          </div>
                          <div className="text-xs text-slate-400 italic pl-3 border-l border-slate-800">
                            Example: "{v.exampleGerman}" &rarr; "{v.exampleEnglish}"
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={() => setActiveTab('grammar')} className="flex items-center space-x-2">
                    <span>Go to Grammar</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* 2. Grammar Tab */}
            {activeTab === 'grammar' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100">{selectedLesson.grammar.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedLesson.grammar.notes}</p>
                </div>

                <div className="overflow-hidden border border-slate-900 rounded-xl bg-slate-950/20">
                  <table className="min-w-full divide-y divide-slate-900">
                    <thead className="bg-slate-950/50">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Subject</th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Conjugation / Rule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 bg-transparent">
                      {selectedLesson.grammar.table.map((row, index) => (
                        <tr key={index} className="hover:bg-slate-900/10">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-250">{row.subject}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-indigo-400 font-mono">{row.conjugation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={() => setActiveTab('vocab')} className="flex items-center space-x-2 text-slate-400 hover:text-slate-200">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Vocab</span>
                  </Button>
                  <Button onClick={() => setActiveTab('quiz')} className="flex items-center space-x-2">
                    <span>Start Quiz</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* 3. Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {quizFinished ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 space-y-6"
                  >
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                      <Award className="h-10 w-10 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-100">Lesson Quiz Completed!</h3>
                      <p className="text-sm text-slate-400 max-w-sm">
                        You scored <span className="font-bold text-indigo-400">{quizScore}/{selectedLesson.quiz.length}</span> in this quiz. Excellent effort!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                        +{selectedLesson.quiz.length * 15} XP Earned
                      </div>
                      <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Lesson Mastered
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button onClick={() => setSelectedLesson(null)} className="px-8">
                        Done & Continue
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Question {currentQuestionIdx + 1} of {selectedLesson.quiz.length}</span>
                        <span>{Math.round(((currentQuestionIdx) / selectedLesson.quiz.length) * 100)}% Complete</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${((currentQuestionIdx + 1) / selectedLesson.quiz.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="p-6 bg-slate-900/10 border border-slate-900 rounded-2xl">
                      <h4 className="text-base font-bold text-slate-100 leading-relaxed">
                        {selectedLesson.quiz[currentQuestionIdx].question}
                      </h4>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {selectedLesson.quiz[currentQuestionIdx].options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const isCorrectAnswer = option === selectedLesson.quiz[currentQuestionIdx].answer;
                        
                        let cardStyle = 'border-slate-900 bg-slate-900/10 hover:border-slate-800';
                        if (isSelected) {
                          cardStyle = 'border-indigo-600 bg-indigo-600/5 text-indigo-400';
                        }
                        if (quizSubmitted) {
                          if (isCorrectAnswer) {
                            cardStyle = 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400';
                          } else if (isSelected) {
                            cardStyle = 'border-red-500/50 bg-red-500/5 text-red-400';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={quizSubmitted}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${cardStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && isCorrectAnswer && (
                              <span className="text-emerald-400 text-xs font-bold">Correct</span>
                            )}
                            {quizSubmitted && isSelected && !isCorrectAnswer && (
                              <span className="text-red-400 text-xs font-bold">Incorrect</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4 border-t border-slate-900/60">
                      {!quizSubmitted ? (
                        <Button
                          disabled={selectedOption === null}
                          onClick={submitAnswer}
                          className="px-6"
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <Button
                          onClick={nextQuestion}
                          className="px-6 flex items-center space-x-2"
                        >
                          <span>{currentQuestionIdx + 1 === selectedLesson.quiz.length ? 'Finish Quiz' : 'Next Question'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Lessons & Learning Path</h2>
          <p className="text-xs text-slate-500 mt-1">Structured modules to boost your German proficiency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lessonsData.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          return (
            <motion.div
              key={lesson.id}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`w-full border-slate-900 bg-slate-950/20 hover:border-slate-800 transition-all duration-300 relative overflow-hidden ${
                isCompleted ? 'border-emerald-500/20 bg-emerald-500/[0.01]' : ''
              }`}>
                {isCompleted && (
                  <div className="absolute top-0 right-0 h-16 w-16 pointer-events-none">
                    <div className="absolute transform rotate-45 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-[9px] font-bold py-1 px-4 right-[-24px] top-[14px] text-center w-[100px] uppercase tracking-wider">
                      Mastered
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        lesson.level === 'A1' ? 'bg-teal-500/10 text-teal-400' :
                        lesson.level === 'A2' ? 'bg-indigo-500/10 text-indigo-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {lesson.level}
                      </span>
                      <h3 className="text-base font-bold text-slate-100">{lesson.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-lg">{lesson.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {lesson.vocab.length} Words
                      </span>
                      <span className="flex items-center gap-1">
                        <ListChecks className="h-3.5 w-3.5" /> {lesson.quiz.length} Questions
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center">
                    <Button onClick={() => startLesson(lesson)} variant={isCompleted ? 'secondary' : 'default'} className="px-5">
                      {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
