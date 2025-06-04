
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Calendar, TrendingUp, Quote } from 'lucide-react';
import { MoodRegistration } from '@/components/MoodRegistration';

interface MotivationalQuote {
  q: string;
  a: string;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [lastMood, setLastMood] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch motivational quote
    fetch('https://zenquotes.io/api/today')
      .then(response => response.json())
      .then(data => {
        if (data && data[0]) {
          setQuote(data[0]);
        }
      })
      .catch(() => {
        // Fallback quote
        setQuote({
          q: "A jornada de mil milhas começa com um único passo.",
          a: "Lao Tzu"
        });
      });

    // Get last mood entry
    const entries = JSON.parse(localStorage.getItem(`moodr-entries-${user?.id}`) || '[]');
    if (entries.length > 0) {
      setLastMood(entries[entries.length - 1]);
    }
  }, [isAuthenticated, navigate, user?.id]);

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      angry: '😠',
      excited: '🤩'
    };
    return moodEmojis[mood] || '😊';
  };

  const getMoodEntries = () => {
    return JSON.parse(localStorage.getItem(`moodr-entries-${user?.id}`) || '[]');
  };

  const getStreakCount = () => {
    const entries = getMoodEntries();
    if (entries.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toDateString();
    const sortedEntries = entries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (new Date(sortedEntries[0].date).toDateString() !== today) return 0;
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const current = new Date(sortedEntries[i - 1].date);
      const previous = new Date(sortedEntries[i].date);
      const diffTime = current.getTime() - previous.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Como você está se sentindo hoje?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Motivational Quote */}
          <Card className="lg:col-span-2 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-primary" />
                Frase do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote ? (
                <div className="space-y-2">
                  <blockquote className="text-lg italic text-foreground/90">
                    "{quote.q}"
                  </blockquote>
                  <cite className="text-sm text-muted-foreground">
                    — {quote.a}
                  </cite>
                </div>
              ) : (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Suas Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Sequência atual</p>
                <p className="text-2xl font-bold text-primary">{getStreakCount()} dias</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de registros</p>
                <p className="text-2xl font-bold">{getMoodEntries().length}</p>
              </div>
              {lastMood && (
                <div>
                  <p className="text-sm text-muted-foreground">Último humor</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {getMoodEmoji(lastMood.mood)}
                    <span className="capitalize">{lastMood.mood}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 animate-scale-in" 
                style={{ animationDelay: '0.2s' }}
                onClick={() => setShowMoodForm(true)}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="mb-2">Registrar Humor</CardTitle>
              <CardDescription>
                Como você está se sentindo agora?
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 animate-scale-in" 
                style={{ animationDelay: '0.3s' }}>
            <Link to="/calendar">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-mood-calm to-mood-happy rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="mb-2">Ver Calendário</CardTitle>
                <CardDescription>
                  Visualize seu histórico de humor
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>
      </main>

      {/* Mood Registration Modal */}
      {showMoodForm && (
        <MoodRegistration onClose={() => setShowMoodForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;
