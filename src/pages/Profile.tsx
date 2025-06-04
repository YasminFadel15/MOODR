
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Calendar, TrendingUp, Heart } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    mostFrequentMood: '',
    moodCounts: {} as { [key: string]: number }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    calculateStats();
  }, [isAuthenticated, navigate, user?.id]);

  const calculateStats = () => {
    const entries = JSON.parse(localStorage.getItem(`moodr-entries-${user?.id}`) || '[]');
    
    if (entries.length === 0) {
      setStats({
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        mostFrequentMood: '',
        moodCounts: {}
      });
      return;
    }

    // Count moods
    const moodCounts: { [key: string]: number } = {};
    entries.forEach((entry: any) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    // Find most frequent mood
    const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    // Calculate streaks
    const sortedEntries = entries.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedEntries.length; i++) {
      const current = new Date(sortedEntries[i].date);
      const previous = new Date(sortedEntries[i - 1].date);
      const diffTime = current.getTime() - previous.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate current streak from today backwards
    const today = new Date().toDateString();
    const reversedEntries = entries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (reversedEntries.length > 0 && new Date(reversedEntries[0].date).toDateString() === today) {
      currentStreak = 1;
      for (let i = 1; i < reversedEntries.length; i++) {
        const current = new Date(reversedEntries[i - 1].date);
        const previous = new Date(reversedEntries[i].date);
        const diffTime = current.getTime() - previous.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    setStats({
      totalEntries: entries.length,
      currentStreak,
      longestStreak,
      mostFrequentMood,
      moodCounts
    });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('moodr-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user?.id);
    
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], name, email };
      localStorage.setItem('moodr-users', JSON.stringify(users));
      
      const updatedUser = { id: user!.id, name, email };
      localStorage.setItem('moodr-user', JSON.stringify(updatedUser));
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

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

  const getMoodLabel = (mood: string) => {
    const moodLabels: { [key: string]: string } = {
      happy: 'Feliz',
      sad: 'Triste',
      anxious: 'Ansioso',
      calm: 'Calmo',
      angry: 'Irritado',
      excited: 'Animado'
    };
    return moodLabels[mood] || mood;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">Meu Perfil</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Atualizar Perfil
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Suas Estatísticas
              </CardTitle>
              <CardDescription>
                Resumo da sua jornada no Moodr
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{stats.totalEntries}</p>
                  <p className="text-sm text-muted-foreground">Total de registros</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-mood-happy/20 to-mood-happy/10 rounded-lg">
                  <Heart className="h-6 w-6 text-mood-happy mx-auto mb-2" />
                  <p className="text-2xl font-bold text-mood-happy">{stats.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Sequência atual</p>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-mood-excited/20 to-mood-excited/10 rounded-lg">
                <p className="text-2xl font-bold text-mood-excited">{stats.longestStreak}</p>
                <p className="text-sm text-muted-foreground">Maior sequência</p>
              </div>

              {stats.mostFrequentMood && (
                <div>
                  <h4 className="font-medium mb-3">Humor mais frequente</h4>
                  <div className="flex items-center justify-center space-x-2 p-4 bg-muted rounded-lg">
                    <span className="text-2xl">{getMoodEmoji(stats.mostFrequentMood)}</span>
                    <span className="font-semibold">{getMoodLabel(stats.mostFrequentMood)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.moodCounts[stats.mostFrequentMood]} vezes)
                    </span>
                  </div>
                </div>
              )}

              {Object.keys(stats.moodCounts).length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Distribuição de humor</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.moodCounts)
                      .sort(([,a], [,b]) => b - a)
                      .map(([mood, count]) => (
                        <div key={mood} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{getMoodEmoji(mood)}</span>
                            <span className="text-sm">{getMoodLabel(mood)}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
