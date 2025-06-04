
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MoodRegistration } from '@/components/MoodRegistration';

const Calendar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadEntries();
  }, [isAuthenticated, navigate, user?.id]);

  const loadEntries = () => {
    const savedEntries = JSON.parse(localStorage.getItem(`moodr-entries-${user?.id}`) || '[]');
    setEntries(savedEntries);
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

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      happy: 'bg-mood-happy',
      sad: 'bg-mood-sad',
      anxious: 'bg-mood-anxious',
      calm: 'bg-mood-calm',
      angry: 'bg-mood-angry',
      excited: 'bg-mood-excited'
    };
    return moodColors[mood] || 'bg-gray-300';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEntryForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date === dateString);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold">Calendário de Humor</h1>
          <Button onClick={() => setShowMoodForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Humor
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  if (!date) {
                    return <div key={index} className="p-2 h-12"></div>;
                  }
                  
                  const entry = getEntryForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedEntry(entry)}
                      className={`p-2 h-12 rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        isToday ? 'border-primary bg-primary/10' : 'border-border'
                      } ${entry ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className={isToday ? 'text-primary font-bold' : ''}>{date.getDate()}</span>
                        {entry && (
                          <div className={`w-2 h-2 rounded-full mt-1 ${getMoodColor(entry.mood)}`}></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Entry Details */}
          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Detalhes do Dia</CardTitle>
              <CardDescription>
                {selectedEntry ? 'Informações do humor registrado' : 'Selecione um dia com registro'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEntry ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getMoodEmoji(selectedEntry.mood)}</div>
                    <h3 className="text-lg font-semibold capitalize mb-1">{selectedEntry.mood}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedEntry.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {selectedEntry.note && (
                    <div>
                      <h4 className="font-medium mb-2">Anotação:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {selectedEntry.note}
                      </p>
                    </div>
                  )}
                  
                  {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedEntry.tags.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Clique em um dia que tenha um registro de humor para ver os detalhes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mood Registration Modal */}
      {showMoodForm && (
        <MoodRegistration onClose={() => {
          setShowMoodForm(false);
          loadEntries();
        }} />
      )}
    </div>
  );
};

export default Calendar;
