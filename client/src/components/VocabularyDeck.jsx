import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Volume2, Plus, Trash2, RefreshCw, FileText, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { lessonsData } from '../data/lessonsData';

// Flatten lessons data to get all vocabulary
const ALL_VOCAB = lessonsData.reduce((acc, curr) => {
  return [...acc, ...curr.vocab.map(v => ({ ...v, sourceLesson: curr.title }))];
}, []);

export default function VocabularyDeck({ starredVocab, addStarredVocab, removeStarredVocab, toggleCompleteVocab, loadingVocab }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'starred'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom word state
  const [customGerman, setCustomGerman] = useState('');
  const [customEnglish, setCustomEnglish] = useState('');
  const [customExampleDe, setCustomExampleDe] = useState('');
  const [customExampleEn, setCustomExampleEn] = useState('');
  const [customCategory, setCustomCategory] = useState('My Words');
  const [addingCustom, setAddingCustom] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Flashcard Study State
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const speakGerman = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddCustomWord = async (e) => {
    e.preventDefault();
    if (!customGerman.trim() || !customEnglish.trim()) return;

    setAddingCustom(true);
    try {
      await addStarredVocab({
        german: customGerman,
        english: customEnglish,
        category: customCategory,
        exampleGerman: customExampleDe || 'Kein Beispielsatz vorhanden.',
        exampleEnglish: customExampleEn || 'No example sentence available.'
      });
      // Reset form
      setCustomGerman('');
      setCustomEnglish('');
      setCustomExampleDe('');
      setCustomExampleEn('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add custom word', err);
    } finally {
      setAddingCustom(false);
    }
  };

  const startStudySession = () => {
    if (starredVocab.length === 0) return;
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setStudyMode(true);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIdx < starredVocab.length - 1) {
        setCurrentCardIdx(currentCardIdx + 1);
      } else {
        setStudyMode(false); // Study session complete
      }
    }, 200);
  };

  const handleMarkMastered = async (vocabItem) => {
    await toggleCompleteVocab(vocabItem._id, vocabItem.completed);
    handleNextCard();
  };

  // Filter Browse Vocab
  const filteredBrowse = ALL_VOCAB.filter(v => 
    v.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {studyMode ? (
        // FLASHCARD STUDY VIEW
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">Study Flashcards</h2>
            <Button variant="ghost" size="sm" onClick={() => setStudyMode(false)} className="text-slate-400 hover:text-slate-200">
              Exit Session
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Card {currentCardIdx + 1} of {starredVocab.length}
            </div>

            {/* Flashcard container */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-md h-72 cursor-pointer relative perspective"
            >
              <motion.div
                className="w-full h-full rounded-2xl relative transition-transform duration-500 transform-style"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front Side */}
                <div className="absolute inset-0 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between items-center text-center backface-hidden shadow-xl">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    German Word
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-extrabold text-indigo-400 tracking-tight">
                      {starredVocab[currentCardIdx].german}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakGerman(starredVocab[currentCardIdx].german);
                      }}
                      className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full transition-all duration-200 mx-auto block cursor-pointer"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    Click card to reveal translation
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-8 flex flex-col justify-between items-center text-center backface-hidden shadow-xl"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    English Meaning
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-100">
                      {starredVocab[currentCardIdx].english}
                    </h3>
                    <p className="text-xs text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-900 leading-relaxed max-w-xs">
                      {starredVocab[currentCardIdx].exampleGerman}
                      <span className="block text-[11px] text-slate-500 mt-1">
                        {starredVocab[currentCardIdx].exampleEnglish}
                      </span>
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    Category: {starredVocab[currentCardIdx].category || 'General'}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Flashcard Actions */}
            <div className="flex gap-4 w-full max-w-md justify-center pt-2">
              <Button 
                variant="destructive"
                className="flex-1"
                onClick={() => handleNextCard()}
              >
                Needs Review
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-550 border-emerald-600/50"
                onClick={() => handleMarkMastered(starredVocab[currentCardIdx])}
              >
                Mastered!
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // NORMAL vocabulary browsing and starred tab view
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Vocabulary Library</h2>
              <p className="text-xs text-slate-500 mt-1">
                Browse core words or review items in your saved flashcards deck.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'browse' ? 'default' : 'secondary'}
                onClick={() => { setActiveTab('browse'); setShowAddForm(false); }}
              >
                Browse All
              </Button>
              <Button 
                variant={activeTab === 'starred' ? 'default' : 'secondary'}
                className="relative"
                onClick={() => { setActiveTab('starred'); }}
              >
                Starred Deck
                {starredVocab.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 bg-indigo-600 border border-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                    {starredVocab.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {activeTab === 'browse' ? (
            // BROWSE DICTIONARY
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-950/20 border border-slate-900 rounded-xl px-3 py-1">
                <Input
                  type="text"
                  placeholder="Search German words, English translation or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent px-0 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent placeholder:text-slate-650 text-slate-200 flex-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredBrowse.map((v, i) => {
                  const isStarred = starredVocab.some(sv => sv.german === v.german);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-900/10 border border-slate-900/40 hover:border-slate-800 rounded-xl hover:bg-slate-950/20 transition-all duration-300 group"
                    >
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-100">{v.german}</span>
                          <button
                            onClick={() => speakGerman(v.german)}
                            className="p-1 rounded text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                            title="Hear pronunciation"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-400">
                          <span className="font-semibold text-indigo-400/80 mr-2 uppercase tracking-wide text-[10px] bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.5 rounded">
                            {v.category}
                          </span>
                          {v.english}
                        </div>
                        <div className="text-[11px] text-slate-500 italic">
                          "{v.exampleGerman}"
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 hover:bg-indigo-500/10 transition-all rounded-lg shrink-0 ${
                          isStarred ? 'text-amber-400 hover:text-amber-500' : 'text-slate-500 hover:text-amber-400'
                        }`}
                        onClick={() => {
                          if (isStarred) {
                            const match = starredVocab.find(sv => sv.german === v.german);
                            if (match) removeStarredVocab(match._id);
                          } else {
                            addStarredVocab(v);
                          }
                        }}
                      >
                        <Star className={`h-4.5 w-4.5 ${isStarred ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  );
                })}
                {filteredBrowse.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No matching words found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            // STARRED REVIEW DECK
            <div className="space-y-6">
              {showAddForm ? (
                // CUSTOM WORD FORM
                <Card className="border-indigo-500/20 bg-indigo-950/[0.01]">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold text-slate-100">Add a Custom Word</CardTitle>
                    <CardDescription className="text-xs text-slate-500">Add custom German words to save and practice in your study sessions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddCustomWord} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1">German Word/Phrase</label>
                          <Input
                            placeholder="e.g. Das Auto"
                            value={customGerman}
                            onChange={(e) => setCustomGerman(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1">English Translation</label>
                          <Input
                            placeholder="e.g. The car"
                            value={customEnglish}
                            onChange={(e) => setCustomEnglish(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1">Example Sentence (German)</label>
                          <Input
                            placeholder="e.g. Das Auto ist schnell."
                            value={customExampleDe}
                            onChange={(e) => setCustomExampleDe(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-1">Example Sentence (English)</label>
                          <Input
                            placeholder="e.g. The car is fast."
                            value={customExampleEn}
                            onChange={(e) => setCustomExampleEn(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" type="button" onClick={() => setShowAddForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addingCustom}>
                          {addingCustom ? 'Saving...' : 'Add Word'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      disabled={starredVocab.length === 0}
                      onClick={startStudySession}
                      className="bg-indigo-600 hover:bg-indigo-550 text-white flex items-center space-x-1.5"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Study Flashcards ({starredVocab.length})</span>
                    </Button>
                  </div>
                  
                  <Button variant="outline" onClick={() => setShowAddForm(true)} className="flex items-center space-x-1.5">
                    <Plus className="h-4 w-4" />
                    <span>Custom Word</span>
                  </Button>
                </div>
              )}

              {loadingVocab ? (
                <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
                  Loading your review deck...
                </div>
              ) : starredVocab.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-slate-900 rounded-2xl bg-slate-950/5">
                  <Star className="h-10 w-10 text-slate-700 mb-3" />
                  <h4 className="text-sm font-bold text-slate-350">Your review deck is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                    Star words from the "Browse All" list or add your own custom words to build a personalized study deck.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-[420px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {starredVocab.map((vocabItem) => (
                      <motion.div
                        key={vocabItem._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center justify-between p-4 bg-slate-950/10 border border-slate-900/40 hover:border-slate-800 hover:bg-slate-950/20 rounded-xl transition-all duration-300 group ${
                          vocabItem.completed ? 'opacity-55 border-emerald-500/10 bg-emerald-500/[0.005]' : ''
                        }`}
                      >
                        <div 
                          className="space-y-1.5 flex-1 pr-4 cursor-pointer select-none"
                          onClick={() => toggleCompleteVocab(vocabItem._id, vocabItem.completed)}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-bold transition-all duration-200 ${
                              vocabItem.completed ? 'line-through text-slate-500' : 'text-slate-100'
                            }`}>
                              {vocabItem.german}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakGerman(vocabItem.german);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                              title="Hear pronunciation"
                            >
                              <Volume2 className="h-4 w-4" />
                            </button>
                            {vocabItem.completed && (
                              <span className="text-emerald-500 flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                                <CheckCircle2 className="h-3 w-3" /> Mastered
                              </span>
                            )}
                          </div>
                          <div className={`text-xs ${vocabItem.completed ? 'text-slate-550' : 'text-slate-400'}`}>
                            <span className="font-semibold text-indigo-400/80 mr-2 uppercase tracking-wide text-[10px] bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.5 rounded">
                              {vocabItem.category || 'General'}
                            </span>
                            {vocabItem.english}
                          </div>
                          <div className={`text-[11px] italic ${vocabItem.completed ? 'text-slate-600' : 'text-slate-500'}`}>
                            "{vocabItem.exampleGerman}"
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeStarredVocab(vocabItem._id);
                            }}
                            title="Remove Star"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
