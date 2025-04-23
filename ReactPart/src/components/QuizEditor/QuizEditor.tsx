import React, { useEffect, useState } from "react";
import styles from "./QuizEditor.module.css";
import { useUser } from "../../context/UserProvider";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Answer[];
}

interface Quiz {
  title: string;
  questions: Question[];
}

export default function QuizEditor({ charityId }: { charityId: string }) {
  const { getCsrfToken } = useUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://localhost:8080/getQuiz?charityId=${encodeURIComponent(charityId)}`
    )
      .then((res) => {
        if (res.status === 204) {
          setHasQuiz(false);
          setEditorVisible(false);
          setQuiz(null);
          setIsLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;

        const convertedQuestions: Question[] = data.questions.map(
          (q, qIndex) => ({
            id: `q-${qIndex}-${Date.now()}`,
            text: q.question,
            options: q.answers.map((a, aIndex) => ({
              id: `q-${qIndex}-a-${aIndex}-${Date.now()}`,
              text: a.text,
              isCorrect: a.correct,
            })),
          })
        );

        setQuiz({
          title: data.title || "",
          questions: convertedQuestions,
        });
        setHasQuiz(true);
        setEditorVisible(true);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [charityId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!quiz) return;
    setQuiz({ ...quiz, title: e.target.value });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      options: [
        { id: `${Date.now()}-1`, text: "", isCorrect: false },
        { id: `${Date.now()}-2`, text: "", isCorrect: false },
      ],
    };
    setQuiz((prev) =>
      prev ? { ...prev, questions: [...prev.questions, newQuestion] } : null
    );
  };

  const updateQuestionText = (id: string, text: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q) => (q.id === id ? { ...q, text } : q)),
    });
  };

  const updateAnswerText = (qid: string, aid: string, text: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === aid ? { ...opt, text } : opt
              ),
            }
          : q
      ),
    });
  };

  const setCorrectAnswer = (qid: string, aid: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt) => ({
                ...opt,
                isCorrect: opt.id === aid,
              })),
            }
          : q
      ),
    });
  };

  const removeQuestion = (id: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((q) => q.id !== id),
    });
  };

  const addAnswerOption = (qid: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: [
                ...q.options,
                { id: Date.now().toString(), text: "", isCorrect: false },
              ],
            }
          : q
      ),
    });
  };

  const removeAnswerOption = (qid: string, aid: string) => {
    if (!quiz) return;
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== aid),
            }
          : q
      ),
    });
  };

  const handleSaveQuiz = async () => {
    if (!quiz) return;

    const hasValidQuestions = quiz.questions.length > 0;
    const hasValidAnswers = quiz.questions.every(
      (q) =>
        q.text.trim() &&
        q.options.length >= 2 &&
        q.options.every((opt) => opt.text.trim()) &&
        q.options.some((opt) => opt.isCorrect)
    );

    if (!hasValidQuestions) {
      alert("You must have at least one question.");
      return;
    }

    if (!hasValidAnswers) {
      alert(
        "Each question must have at least two answers and one correct answer."
      );
      return;
    }

    setIsSaving(true);

    const payload = {
      charityId,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        text: q.text,
        answers: q.options.map((opt) => ({
          text: opt.text,
          correct: opt.isCorrect,
        })),
      })),
    };

    const endpoint = hasQuiz
      ? "http://127.0.0.1:8080/updateQuiz"
      : "http://127.0.0.1:8080/createQuiz";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCsrfToken() || "",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to save quiz");
        alert("Failed to save quiz");
      } else {
        alert("Quiz saved successfully!");
        setHasQuiz(true);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading quiz...</div>;

  if (!editorVisible) {
    return (
      <div className={styles.editorContainer}>
        <h2>No quiz found for this charity.</h2>
        <button
          onClick={() => {
            setQuiz({ title: "", questions: [] });
            setEditorVisible(true);
          }}
        >
          Create Quiz
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editorContainer}>
      <h1>Charity Quiz Editor</h1>

      <input
        type="text"
        value={quiz?.title || ""}
        onChange={handleTitleChange}
        placeholder="Quiz Title"
        className={styles.quizTitleInput}
      />
      <h2>Questions</h2>
      {quiz?.questions.length === 0 && <p>No questions yet. Add one!</p>}
      {quiz?.questions.map((q, i) => (
        <div key={q.id} className={styles.questionBlock}>
          <input
            type="text"
            placeholder={`Question ${i + 1}`}
            value={q.text}
            onChange={(e) => updateQuestionText(q.id, e.target.value)}
          />
          {q.options.map((opt) => (
            <div key={opt.id} className={styles.optionRow}>
              <input
                type="radio"
                name={`correct-${q.id}`}
                checked={opt.isCorrect}
                onChange={() => setCorrectAnswer(q.id, opt.id)}
              />
              <input
                type="text"
                value={opt.text}
                onChange={(e) => updateAnswerText(q.id, opt.id, e.target.value)}
              />
              <button onClick={() => removeAnswerOption(q.id, opt.id)}>
                X
              </button>
            </div>
          ))}
          <button onClick={() => addAnswerOption(q.id)}>Add Answer</button>
          <button
            onClick={() => removeQuestion(q.id)}
            className={styles.removeQuestion}
          >
            Remove Question
          </button>
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={handleSaveQuiz} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Quiz"}
      </button>
    </div>
  );
}
