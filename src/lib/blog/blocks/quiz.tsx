"use client";

import { useState } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizBlock as QuizBlockType } from "../types";

interface Props {
    block: QuizBlockType;
}

export function QuizBlock({ block }: Props) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
        new Array(block.questions.length).fill(null)
    );
    const [showResults, setShowResults] = useState(false);
    const [checked, setChecked] = useState<boolean[]>(
        new Array(block.questions.length).fill(false)
    );

    const question = block.questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];
    const isChecked = checked[currentQuestion];
    const isCorrect = selectedAnswer === question.correctIndex;

    const handleSelect = (index: number) => {
        if (isChecked) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = index;
        setSelectedAnswers(newAnswers);
    };

    const handleCheck = () => {
        if (selectedAnswer === null) return;
        const newChecked = [...checked];
        newChecked[currentQuestion] = true;
        setChecked(newChecked);
    };

    const handleNext = () => {
        if (currentQuestion < block.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setSelectedAnswers(new Array(block.questions.length).fill(null));
        setChecked(new Array(block.questions.length).fill(false));
        setShowResults(false);
    };

    const correctCount = block.questions.filter(
        (q, i) => selectedAnswers[i] === q.correctIndex
    ).length;

    if (showResults) {
        const percentage = Math.round((correctCount / block.questions.length) * 100);
        return (
            <Card className="my-6 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        {block.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <div className="text-6xl font-bold mb-4">
                        {percentage >= 70 ? "🎉" : percentage >= 50 ? "👍" : "📚"}
                    </div>
                    <p className="text-2xl font-semibold mb-2">
                        {correctCount} / {block.questions.length}
                    </p>
                    <p className="text-muted-foreground mb-6">
                        {percentage}% poprawnych odpowiedzi
                    </p>
                    <Button onClick={handleReset}>Spróbuj ponownie</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="my-6 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        {block.title}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {currentQuestion + 1} / {block.questions.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-medium mb-4">{question.question}</p>
                <div className="space-y-2">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const showCorrect = isChecked && index === question.correctIndex;
                        const showWrong = isChecked && isSelected && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelect(index)}
                                disabled={isChecked}
                                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${showCorrect
                                        ? "border-green-500 bg-green-500/10"
                                        : showWrong
                                            ? "border-red-500 bg-red-500/10"
                                            : isSelected
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                    } ${isChecked ? "cursor-default" : "cursor-pointer"}`}
                            >
                                <span
                                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-medium shrink-0 ${showCorrect
                                            ? "border-green-500 text-green-500"
                                            : showWrong
                                                ? "border-red-500 text-red-500"
                                                : isSelected
                                                    ? "border-primary text-primary"
                                                    : "border-muted-foreground/50"
                                        }`}
                                >
                                    {showCorrect ? (
                                        <Check className="h-4 w-4" />
                                    ) : showWrong ? (
                                        <X className="h-4 w-4" />
                                    ) : (
                                        String.fromCharCode(65 + index)
                                    )}
                                </span>
                                <span>{option}</span>
                            </button>
                        );
                    })}
                </div>

                {isChecked && question.explanation && (
                    <div className={`mt-4 p-3 rounded-lg ${isCorrect ? "bg-green-500/10" : "bg-amber-500/10"}`}>
                        <p className="text-sm">{question.explanation}</p>
                    </div>
                )}

                <div className="flex gap-2 mt-6">
                    {!isChecked ? (
                        <Button onClick={handleCheck} disabled={selectedAnswer === null}>
                            Sprawdź
                        </Button>
                    ) : (
                        <Button onClick={handleNext}>
                            {currentQuestion < block.questions.length - 1 ? "Następne" : "Zobacz wynik"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
