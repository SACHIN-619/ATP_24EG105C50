import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SkillQuiz() {
  const { skill }    = useParams();
  const navigate     = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/users/quiz/${skill}`)
      .then(r => setQuestions(r.data))
      .finally(() => setLoading(false));
  }, [skill]);

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions'); return;
    }
    setSubmitting(true);
    try {
      const answerArray = questions.map((_, i) => answers[i]);
      const { data } = await api.post('/users/verify-skill', { skill, answers: answerArray });
      setResult(data);
    } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)' }}><p style={{ color: 'var(--text-muted)' }}>Loading quiz...</p></div>;

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif', padding: 0, marginBottom: 24 }}>← Back</button>

        {result ? (
          /* Result screen */
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 48, border: '1px solid var(--border)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{result.passed ? '🏅' : '📚'}</div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              {result.passed ? `${skill} Verified!` : 'Not quite there'}
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 300 }}>
              You got <strong>{result.correct}/{result.total}</strong> correct.
            </p>
            {result.passed ? (
              <p style={{ fontSize: 14, color: '#059669', background: '#ECFDF5', padding: '10px 20px', borderRadius: 10, display: 'inline-block', marginBottom: 28 }}>
                ⚡ Badge added to your profile
              </p>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, fontWeight: 300 }}>
                You need 4/5 to earn the badge. Review the topic and try again.
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate(-1)} style={{ padding: '11px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {result.passed ? 'View Profile' : 'Try Again Later'}
              </button>
            </div>
          </div>
        ) : (
          /* Quiz screen */
          <div>
            <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '24px 32px', border: '1px solid var(--border)', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 28 }}>⚡</span>
                <div>
                  <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {skill} Skill Verification
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, fontWeight: 300 }}>
                    Answer 4 out of 5 correctly to earn your verified badge
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {questions.map((q, qi) => (
                <div key={qi} style={{ background: 'var(--surface)', borderRadius: 14, padding: '20px 24px', border: `1px solid ${answers[qi] !== undefined ? 'var(--accent)' : 'var(--border)'}`, boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.15s' }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                    <span style={{ color: 'var(--accent)', marginRight: 8 }}>Q{qi + 1}.</span>{q.q}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {q.options.map((opt, oi) => (
                      <button key={oi} onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))} style={{
                        padding: '10px 16px', textAlign: 'left',
                        border: `1.5px solid ${answers[qi] === oi ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 9, cursor: 'pointer', fontSize: 13,
                        fontFamily: '"DM Sans", sans-serif',
                        background: answers[qi] === oi ? 'var(--accent-light)' : 'var(--surface)',
                        color: answers[qi] === oi ? 'var(--accent)' : 'var(--text-secondary)',
                        fontWeight: answers[qi] === oi ? 600 : 400,
                        transition: 'all 0.15s',
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {Object.keys(answers).length}/{questions.length} answered
              </span>
              <button onClick={submit} disabled={submitting || Object.keys(answers).length < questions.length} style={{
                padding: '12px 32px', background: Object.keys(answers).length < questions.length ? '#A5B4FC' : 'var(--accent)',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: Object.keys(answers).length < questions.length ? 'not-allowed' : 'pointer',
                fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
              }}>
                {submitting ? 'Checking...' : 'Submit Quiz →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}