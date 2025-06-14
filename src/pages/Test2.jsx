import React, { useState, useEffect, useCallback } from 'react';

const wilayasData = [
    { code: '01', name: "Wilaya d'Adrar" }, { code: '02', name: "Wilaya de Chlef" }, { code: '03', name: "Wilaya de Laghouat" },
    { code: '04', name: "Wilaya d'Oum El Bouaghi" }, { code: '05', name: "Wilaya de Batna" }, { code: '06', name: "Wilaya de Béjaïa" },
    { code: '07', name: "Wilaya de Biskra" }, { code: '08', name: "Wilaya de Béchar" }, { code: '09', name: "Wilaya de Blida" },
    { code: '10', name: "Wilaya de Bouira" }, { code: '11', name: "Wilaya de Tamanrasset" }, { code: '12', name: "Wilaya de Tébessa" },
    { code: '13', name: "Wilaya de Tlemcen" }, { code: '14', name: "Wilaya de Tiaret" }, { code: '15', name: "Wilaya de Tizi-Ouzou" },
    { code: '16', name: "Wilaya d'Alger" }, { code: '17', name: "Wilaya de Djelfa" }, { code: '18', name: "Wilaya de Jijel" },
    { code: '19', name: "Wilaya de Sétif" }, { code: '20', name: "Wilaya de Saida" }, { code: '21', name: "Wilaya de Skikda" },
    { code: '22', name: "Wilaya de Sidi-Bel-Abbès" }, { code: '23', name: "Wilaya d'Annaba" }, { code: '24', name: "Wilaya de Guelma" },
    { code: '25', name: "Wilaya de Constantine" }, { code: '26', name: "Wilaya de Médéa" }, { code: '27', name: "Wilaya de Mostaganem" },
    { code: '28', name: "Wilaya de M'Sila" }, { code: '29', name: "Wilaya de Mascara" }, { code: '30', name: "Wilaya d'Ouargla" },
    { code: '31', name: "Wilaya d'Oran" }, { code: '32', name: "Wilaya d'El-Bayadh" }, { code: '33', name: "Wilaya d'Illizi" },
    { code: '34', name: "Wilaya de Bordj-Bou-Arreridj" }, { code: '35', name: "Wilaya de Boumerdès" }, { code: '36', name: "Wilaya d'El-Tarf" },
    { code: '37', name: "Wilaya de Tindouf" }, { code: '38', name: "Wilaya de Tissemsilt" }, { code: '39', name: "Wilaya d'El-Oued" },
    { code: '40', name: "Wilaya de Khenchela" }, { code: '41', name: "Wilaya de Souk-Ahras" }, { code: '42', name: "Wilaya de Tipaza" },
    { code: '43', name: "Wilaya de Mila" }, { code: '44', name: "Wilaya de Aïn-Defla" }, { code: '45', name: "Wilaya de Naâma" },
    { code: '46', name: "Wilaya de Aïn-Témouchent" }, { code: '47', name: "Wilaya de Ghardaia" }, { code: '48', name: "Wilaya de Relizane" },
];

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const Test = () => {
    const [rangeStart, setRangeStart] = useState(1);
    const [rangeEnd, setRangeEnd] = useState(48);
    const [questionType, setQuestionType] = useState('nameFromCode');
    const [quizStarted, setQuizStarted] = useState(false);
    const [filteredWilayas, setFilteredWilayas] = useState([]);
    const [questionQueue, setQuestionQueue] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [questionsAsked, setQuestionsAsked] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const generateQuestion = useCallback(() => {
        if (!quizStarted) return;
        let currentInternalQueue = [...questionQueue];
        if (currentInternalQueue.length === 0) {
            if (filteredWilayas.length === 0) {
                setFeedback("No Wilayas available in the selected range. Quiz ended.");
                setQuizStarted(false); setCurrentQuestion(null); return;
            }
            currentInternalQueue = shuffleArray([...filteredWilayas]);
            if (currentInternalQueue.length === 0) {
                setFeedback("Failed to regenerate question queue. Quiz ended.");
                setQuizStarted(false); setCurrentQuestion(null); return;
            }
        }
        const correctWilaya = currentInternalQueue.pop();
        setQuestionQueue(currentInternalQueue);
        if (!correctWilaya) {
            setFeedback("Error getting next Wilaya from queue. Quiz ended.");
            setQuizStarted(false); setCurrentQuestion(null); return;
        }
        const actualQuestionType = questionType === 'mixed' ? (Math.random() < 0.5 ? 'nameFromCode' : 'codeFromName') : questionType;
        let questionText, correctAnswerValue;
        let allPossibleOptionValuesForType;
        if (actualQuestionType === 'nameFromCode') {
            questionText = `What is the Wilaya for code ${correctWilaya.code}?`;
            correctAnswerValue = correctWilaya.name;
            allPossibleOptionValuesForType = Array.from(new Set(filteredWilayas.map(w => w.name)));
        } else {
            questionText = `What is the code for ${correctWilaya.name}?`;
            correctAnswerValue = correctWilaya.code;
            allPossibleOptionValuesForType = Array.from(new Set(filteredWilayas.map(w => w.code)));
        }
        const optionsSet = new Set([correctAnswerValue]);
        const desiredNumOptions = 4;
        const distractorPool = shuffleArray(allPossibleOptionValuesForType.filter(opt => opt !== correctAnswerValue));
        let distractorIdx = 0;
        while (optionsSet.size < Math.min(desiredNumOptions, 1 + distractorPool.length) && distractorIdx < distractorPool.length) {
            optionsSet.add(distractorPool[distractorIdx]);
            distractorIdx++;
        }
        if (optionsSet.size === 0 && correctAnswerValue) optionsSet.add(correctAnswerValue);
        if (optionsSet.size < 1) {
            setFeedback("Not enough unique Wilayas in the selected range to form distinct options. Quiz ended.");
            setCurrentQuestion(null); setQuizStarted(false); return;
        }
        setCurrentQuestion({
            text: questionText,
            options: shuffleArray(Array.from(optionsSet)),
            answer: correctAnswerValue,
            type: actualQuestionType
        });
        setFeedback(''); setAnswered(false); setSelectedAnswer(null);
    }, [quizStarted, filteredWilayas, questionType, questionQueue, setQuestionQueue, setCurrentQuestion, setQuizStarted, setFeedback, setAnswered, setSelectedAnswer]);

    useEffect(() => {
        if (quizStarted && filteredWilayas.length > 0 && !currentQuestion) {
            generateQuestion();
        }
    }, [quizStarted, filteredWilayas, currentQuestion, generateQuestion]);

    const handleStartQuiz = () => {
        const start = parseInt(rangeStart, 10); const end = parseInt(rangeEnd, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > 48 || start > end) {
            alert("Please enter a valid range (1-48, start <= end)."); return;
        }
        const currentFiltered = wilayasData.filter(w => parseInt(w.code) >= start && parseInt(w.code) <= end);
        if (currentFiltered.length < 1) {
            alert("Selected range has no Wilayas. Please broaden your range."); return;
        }
        const uniqueNames = new Set(currentFiltered.map(w => w.name)).size;
        const uniqueCodes = new Set(currentFiltered.map(w => w.code)).size;
        let canProceed = false; const minOptionsNeeded = 1;
        if (questionType === 'nameFromCode' && uniqueNames >= minOptionsNeeded) canProceed = true;
        else if (questionType === 'codeFromName' && uniqueCodes >= minOptionsNeeded) canProceed = true;
        else if (questionType === 'mixed' && (uniqueNames >= minOptionsNeeded || uniqueCodes >= minOptionsNeeded)) canProceed = true;
        if (!canProceed) {
            alert("The selected range does not have enough unique Wilaya names/codes to start the quiz. Please broaden your range or change question type."); return;
        }
        setFilteredWilayas(currentFiltered);
        setQuestionQueue(shuffleArray([...currentFiltered]));
        setScore(0); setQuestionsAsked(0); setCurrentQuestion(null);
        setQuizStarted(true); setFeedback(''); setSelectedAnswer(null);
    };

    const handleAnswer = (selectedOption) => {
        if (answered) return;
        setAnswered(true); setSelectedAnswer(selectedOption);
        const newQuestionsAsked = questionsAsked + 1; setQuestionsAsked(newQuestionsAsked);
        let newScore = score;
        if (selectedOption === currentQuestion.answer) {
            newScore = score + 1; setScore(newScore); setFeedback('Correct!');
        } else {
            setFeedback(`Incorrect. The correct answer was: ${currentQuestion.answer}`);
        }
        setTimeout(() => { if (quizStarted) generateQuestion(); }, 2000);
    };

    const handleResetAndEndQuiz = () => {
        const finalScore = score; const finalQuestionsAsked = questionsAsked;
        setQuizStarted(false); setCurrentQuestion(null); setScore(0); setQuestionsAsked(0);
        if (finalQuestionsAsked > 0) {
            setFeedback(`Quiz ended. Your score: ${finalScore} / ${finalQuestionsAsked}. Settings reset.`);
        } else {
            setFeedback('Quiz settings reset.');
        }
        setRangeStart(1); setRangeEnd(48); setQuestionType('nameFromCode');
        setSelectedAnswer(null); setFilteredWilayas([]); setQuestionQueue([]);
    };

    const inputBaseClasses = "p-2.5 mt-1 border border-slate-600 rounded-md bg-slate-700 text-slate-100 text-base w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none";
    const buttonBaseClasses = "font-semibold py-2.5 px-6 rounded-md text-lg cursor-pointer transition-all active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed";
    const primaryButtonClasses = `${buttonBaseClasses} bg-sky-500 text-slate-900 hover:bg-sky-400`;
    const dangerButtonClasses = `${buttonBaseClasses} bg-red-500 text-slate-100 hover:bg-red-400`;
    const optionButtonBase = `${buttonBaseClasses} text-base p-3.5 text-left w-full bg-slate-700 text-slate-100 border border-slate-600 hover:bg-slate-600 hover:border-slate-500`;

    if (!quizStarted || !currentQuestion) {
        return (
            <div className='w-full bg-black h-screen flex items-center justify-center p-4'>
                <div className="bg-slate-800 text-slate-100 p-6 md:p-8 rounded-xl w-full max-w-2xl mx-auto text-center shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-6 md:mb-8">Algerian Wilaya Quiz</h1>
                    {feedback && (
                        <p className={`mb-5 p-3 rounded-md text-lg font-semibold ${feedback.includes('score:') ? 'bg-sky-900/50 border border-sky-700 text-sky-300' : feedback.startsWith('Correct') ? 'bg-green-900/50 border border-green-700 text-green-300' : feedback.startsWith('Incorrect') ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-yellow-900/50 border border-yellow-700 text-yellow-300'}`}>
                            {feedback}
                        </p>
                    )}
                    <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
                        <label className="flex flex-col items-start text-sm text-slate-300"> Range Start (1-48):
                            <input type="number" value={rangeStart} min="1" max="48" onChange={(e) => setRangeStart(Math.max(1, Math.min(48, parseInt(e.target.value) || 1)))} className={inputBaseClasses} />
                        </label>
                        <label className="flex flex-col items-start text-sm text-slate-300"> Range End (1-48):
                            <input type="number" value={rangeEnd} min="1" max="48" onChange={(e) => setRangeEnd(Math.max(1, Math.min(48, parseInt(e.target.value) || 48)))} className={inputBaseClasses} />
                        </label>
                        <label className="flex flex-col items-start text-sm text-slate-300"> Question Type:
                            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className={inputBaseClasses}>
                                <option value="nameFromCode">Code to Name</option> <option value="codeFromName">Name to Code</option> <option value="mixed">Mixed</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={handleStartQuiz} className={`${primaryButtonClasses} w-full sm:w-auto`}>Start Quiz</button>
                        <button onClick={handleResetAndEndQuiz} className={`${dangerButtonClasses} w-full sm:w-auto`}>Reset Settings</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full bg-black h-screen flex items-center justify-center p-4'>
            <div className="bg-slate-800 text-slate-100 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-sky-400 mb-4">Algerian Wilaya Quiz</h1>
                <div className="text-lg md:text-xl mb-5 text-green-400">Score: {score} / {questionsAsked}</div>
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl mb-6 text-slate-200 leading-relaxed min-h-[3em] flex items-center justify-center px-2">{currentQuestion.text}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                        {currentQuestion.options.map((option, index) => {
                            const isCorrect = option === currentQuestion.answer;
                            const isSelected = option === selectedAnswer;
                            let optionSpecificClasses = "";
                            if (answered) {
                                if (isCorrect) optionSpecificClasses = "!bg-green-500 !text-slate-900 !border-green-600";
                                else if (isSelected && !isCorrect) optionSpecificClasses = "!bg-red-500 !text-slate-100 !border-red-600";
                                else optionSpecificClasses = "opacity-60 cursor-not-allowed";
                            }
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    disabled={answered} // Once answered, all options are non-interactive for new selection
                                    className={`${optionButtonBase} ${optionSpecificClasses} group`} // Added 'group' for hover effect
                                >
                                    <span className={`inline-block w-full transition-colors duration-150 ease-in-out
                                        ${answered 
                                            ? 'text-inherit' // Inherit color from button's specific classes (e.g., !text-slate-900)
                                            : 'text-slate-700 group-hover:text-slate-100' // "Hides" text by matching bg, reveals to slate-100 on hover
                                        }
                                    `}>
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                {feedback && (
                    <p className={`mt-5 p-3 rounded-md text-lg font-semibold ${feedback.startsWith('Correct') ? 'bg-green-900/50 border border-green-700 text-green-300' : feedback.startsWith('Incorrect') ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-sky-900/50 border border-sky-700 text-sky-300'}`}>
                        {feedback}
                    </p>
                )}
                <button onClick={handleResetAndEndQuiz} className={`${dangerButtonClasses} mt-6 block mx-auto`}>End Quiz & Reset</button>
            </div>
        </div>
    );
};

export default Test;