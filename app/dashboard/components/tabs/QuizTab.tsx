'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { supabase } from '@/lib/supabase-client';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';

interface QuizOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption;
  correctAnswer: string;
  explanation: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

export function QuizTab() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    setIsLoading(true);
    setQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        getApiUrl('quiz/generate'),
        {
          difficulty: 'medium',
          questionCount: 5
        },
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      setQuiz(response.data.quiz);

      toast({
        title: "Quiz Generated!",
        description: `${response.data.quiz.questions.length} questions ready to test your knowledge.`,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);

      let errorMessage = "Failed to generate quiz. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (showResults) return; // Don't allow changes after submitting

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = () => {
    if (!quiz) return;

    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quiz.questions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: `Please answer all ${quiz.questions.length} questions before submitting.`,
      });
      return;
    }

    setShowResults(true);

    const correctCount = quiz.questions.filter((q, index) =>
      selectedAnswers[index] === q.correctAnswer
    ).length;

    toast({
      title: "Quiz Complete!",
      description: `You scored ${correctCount} out of ${quiz.questions.length}`,
    });
  };

  const getOptionClassName = (questionIndex: number, option: string, correctAnswer: string) => {
    const isSelected = selectedAnswers[questionIndex] === option;
    const isCorrect = option === correctAnswer;

    if (!showResults) {
      return isSelected
        ? "border-primary bg-primary/10"
        : "border-border hover:border-primary/50 hover:bg-accent";
    }

    // After submission
    if (isCorrect) {
      return "border-green-500 bg-green-50 dark:bg-green-950";
    }
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50 dark:bg-red-950";
    }
    return "border-border opacity-50";
  };

  return (
    <div className="h-full w-full flex flex-col p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Knowledge Check</h2>
          {quiz && !showResults && (
            <p className="text-sm text-muted-foreground mt-1">
              Answer all questions to see your results
            </p>
          )}
        </div>
        <Button
          onClick={generateQuiz}
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Quiz
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating quiz questions...</p>
          </div>
        </div>
      )}

      {!isLoading && !quiz && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-muted-foreground text-lg">
              Click "Generate New Quiz" to test your knowledge
            </p>
          </div>
        </div>
      )}

      {!isLoading && quiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {quiz.questions.map((question, qIndex) => (
            <Card key={qIndex}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {qIndex + 1}. {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(question.options).map(([option, text]) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(qIndex, option)}
                    disabled={showResults}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getOptionClassName(qIndex, option, question.correctAnswer)} ${showResults ? 'cursor-default' : 'cursor-pointer'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        {showResults && option === question.correctAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        {showResults && selectedAnswers[qIndex] === option && option !== question.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        {!showResults && selectedAnswers[qIndex] === option && (
                          <div className="h-4 w-4 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="flex-1">{text}</span>
                    </div>
                  </button>
                ))}

                {showResults && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {!showResults && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
              >
                Submit Quiz
              </Button>
            </div>
          )}

          {showResults && (
            <div className="flex justify-center pt-4">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                  <CardTitle>Quiz Results</CardTitle>
                  <CardDescription>
                    You scored {quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length} out of {quiz.questions.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={generateQuiz} size="lg">
                    Try Another Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}