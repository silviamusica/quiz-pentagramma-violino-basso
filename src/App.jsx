import React, { useState } from 'react';
import { Play, RotateCcw, Settings, Check, Music } from 'lucide-react';

const trebleQuestions = [
    { text: "La nota sulla terza linea", answer: "Si", pos: 5, type: 'line' },
    { text: "La nota sulla quinta linea", answer: "Fa", pos: 9, type: 'line' },
    { text: "La nota sulla seconda linea", answer: "Sol", pos: 3, type: 'line' },
    { text: "La nota sulla quarta linea", answer: "Re", pos: 7, type: 'line' },
    { text: "La nota sulla prima linea", answer: "Mi", pos: 1, type: 'line' },
    { text: "La nota sul primo spazio", answer: "Fa", pos: 2, type: 'space' },
    { text: "La nota sul quarto spazio", answer: "Mi", pos: 8, type: 'space' },
    { text: "La nota sul terzo spazio", answer: "Do", pos: 6, type: 'space' },
    { text: "La nota sul secondo spazio", answer: "La", pos: 4, type: 'space' }
];

const bassQuestions = [
    { text: "La nota sulla prima linea", answer: "Sol", pos: 1, type: 'line' },
    { text: "La nota sulla seconda linea", answer: "Si", pos: 3, type: 'line' },
    { text: "La nota sulla terza linea", answer: "Re", pos: 5, type: 'line' },
    { text: "La nota sulla quarta linea", answer: "Fa", pos: 7, type: 'line' },
    { text: "La nota sulla quinta linea", answer: "La", pos: 9, type: 'line' },
    { text: "La nota sul primo spazio", answer: "La", pos: 2, type: 'space' },
    { text: "La nota sul secondo spazio", answer: "Do", pos: 4, type: 'space' },
    { text: "La nota sul terzo spazio", answer: "Mi", pos: 6, type: 'space' },
    { text: "La nota sul quarto spazio", answer: "Sol", pos: 8, type: 'space' }
];

const StaffVisualizer = ({ notePos, showNote, clef }) => {
    const calculateY = (pos) => 150 - (pos * 10);

    return (
        <div className="flex justify-center my-6">
            <svg width="300" height="200" viewBox="0 0 300 200" className="bg-white rounded-lg shadow-inner border border-gray-200 select-none">
                {clef === 'treble' ? (
                    <text x="10" y="142" fontSize="120" fontFamily="serif" fill="#374151">𝄞</text>
                ) : (
                    <image href="/bass_clef.svg" x="10" y="60" width="50" height="60" />
                )}
                {[60, 80, 100, 120, 140].map((y, i) => (
                    <line key={i} x1="20" y1={y} x2="280" y2={y} className="stroke-gray-700 stroke-2" />
                ))}
                {showNote && (
                    <g className="animate-[fadeIn_0.5s_ease-in]">
                        <ellipse cx="150" cy={calculateY(notePos)} rx="10" ry="8" className="fill-gray-800 stroke-gray-800" />
                        <line 
                            x1={notePos < 5 ? 158 : 142} 
                            y1={calculateY(notePos)} 
                            x2={notePos < 5 ? 158 : 142} 
                            y2={calculateY(notePos) + (notePos < 5 ? -35 : 35)} 
                            stroke="#1f2937" 
                            strokeWidth="2" 
                        />
                    </g>
                )}
            </svg>
        </div>
    );
};

const App = () => {
    const [gameState, setGameState] = useState('setup');
    const [config, setConfig] = useState({ clef: 'treble', mode: 'random', count: 5 });
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const startQuiz = () => {
        let allQuestions = [];
        if (config.clef === 'treble') {
            allQuestions = trebleQuestions;
        } else if (config.clef === 'bass') {
            allQuestions = bassQuestions;
        } else {
            allQuestions = [
                ...trebleQuestions.map(q => ({ ...q, clef: 'treble' })),
                ...bassQuestions.map(q => ({ ...q, clef: 'bass' }))
            ];
        }
        let pool = config.mode === 'lines' ? allQuestions.filter(q => q.type === 'line')
            : config.mode === 'spaces' ? allQuestions.filter(q => q.type === 'space')
            : [...allQuestions];
        const generated = [];
        for (let i = 0; i < config.count; i++) {
            generated.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        setQuizQuestions(generated);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
        setGameState('playing');
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowAnswer(false);
        } else {
            setGameState('finished');
        }
    };

    const resetToMenu = () => { setGameState('setup'); setShowAnswer(false); };

    const Footer = () => (
        <div className="mt-8 pb-6">
            <img src="/Logo sip orizzontale nero.png" alt="Sognandoilpiano" className="h-8 mx-auto opacity-60 hover:opacity-90 transition-opacity" />
        </div>
    );

    if (gameState === 'setup') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 font-sans">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden p-8">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-cyan-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Music className="w-8 h-8 text-cyan-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Configura Esercizio</h1>
                        <p className="text-gray-500 mt-2">Personalizza il tuo allenamento di lettura</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Quale chiave?</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[{v:'treble',l:'Violino'},{v:'bass',l:'Basso'},{v:'mixed',l:'Miste'}].map(({v,l})=>(
                                    <button key={v} onClick={()=>setConfig({...config,clef:v})}
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${config.clef===v?'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700':'border-gray-200 hover:border-cyan-200 text-gray-600'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Cosa vuoi allenare?</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[{v:'lines',l:'Solo Righe'},{v:'spaces',l:'Solo Spazi'},{v:'random',l:'Misto'}].map(({v,l})=>(
                                    <button key={v} onClick={()=>setConfig({...config,mode:v})}
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${config.mode===v?'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700':'border-gray-200 hover:border-cyan-200 text-gray-600'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Quante domande?</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[5,10,15,20].map(num=>(
                                    <button key={num} onClick={()=>setConfig({...config,count:num})}
                                        className={`py-2 rounded-lg text-sm font-bold transition-all ${config.count===num?'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4">
                            <button onClick={startQuiz} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-2">
                                <Play size={20}/> Inizia Esercizio
                            </button>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

    if (gameState === 'playing') {
        const question = quizQuestions[currentQuestionIndex];
        const currentClef = question.clef || config.clef;
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 font-sans">
                <div className="w-full max-w-xl">
                    <div className="flex justify-between text-xs font-semibold text-cyan-800 mb-2 uppercase tracking-wider">
                        <span>Domanda {currentQuestionIndex+1}</span>
                        <span>{quizQuestions.length} Totali</span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2.5 mb-6 backdrop-blur-sm">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 shadow" 
                            style={{width:`${((currentQuestionIndex+1)/quizQuestions.length)*100}%`}}></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white,transparent_50%)]"></div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight relative z-10">
                                {question.text}
                                {config.clef==='mixed'&&<span className="block text-sm text-cyan-300 mt-2">(Chiave di {currentClef==='treble'?'violino':'basso'})</span>}
                            </h2>
                            {!showAnswer&&<p className="mt-4 text-cyan-300 italic text-sm animate-pulse font-medium relative z-10">Chiudi gli occhi e visualizza...</p>}
                        </div>
                        <div className="p-6">
                            <StaffVisualizer notePos={question.pos} showNote={showAnswer} clef={currentClef}/>
                            <div className="h-16 text-center mb-4">
                                {showAnswer?(
                                    <div className="animate-[fadeIn_0.5s_ease-in]">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Risposta</p>
                                        <p className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{question.answer}</p>
                                    </div>
                                ):(
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl font-bold">?</div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                {!showAnswer?(
                                    <button onClick={()=>setShowAnswer(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition active:scale-95">
                                        Mostra Risposta
                                    </button>
                                ):(
                                    <button onClick={handleNext} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95">
                                        {currentQuestionIndex<quizQuestions.length-1?"Prossima":"Concludi"} <span className="text-xl">→</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={resetToMenu} className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-cyan-800/60 hover:text-cyan-800 transition mx-auto">
                        <RotateCcw size={14}/> Interrompi e torna al menu
                    </button>
                </div>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 font-sans">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-cyan-600" strokeWidth={3}/>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Ottimo lavoro!</h2>
                <p className="text-gray-500 mb-8">Hai completato il tuo esercizio di visualizzazione con {config.count} domande.</p>
                <div className="space-y-3">
                    <button onClick={startQuiz} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2">
                        <RotateCcw size={18}/> Ripeti Stesso Esercizio
                    </button>
                    <button onClick={resetToMenu} className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2">
                        <Settings size={18}/> Cambia Impostazioni
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default App;
