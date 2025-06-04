
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface MoodRegistrationProps {
  onClose: () => void;
}

const moodOptions = [
  { id: 'happy', label: 'Feliz', emoji: '😊', color: 'mood-happy' },
  { id: 'sad', label: 'Triste', emoji: '😢', color: 'mood-sad' },
  { id: 'anxious', label: 'Ansioso', emoji: '😰', color: 'mood-anxious' },
  { id: 'calm', label: 'Calmo', emoji: '😌', color: 'mood-calm' },
  { id: 'angry', label: 'Irritado', emoji: '😠', color: 'mood-angry' },
  { id: 'excited', label: 'Animado', emoji: '🤩', color: 'mood-excited' },
];

export const MoodRegistration = ({ onClose }: MoodRegistrationProps) => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um humor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const entry = {
        id: Date.now().toString(),
        date,
        mood: selectedMood,
        note: note.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        createdAt: new Date().toISOString()
      };

      const existingEntries = JSON.parse(localStorage.getItem(`moodr-entries-${user?.id}`) || '[]');
      
      // Check if entry for this date already exists
      const existingIndex = existingEntries.findIndex((e: any) => e.date === date);
      
      if (existingIndex >= 0) {
        existingEntries[existingIndex] = entry;
        toast({
          title: "Humor atualizado!",
          description: "Seu registro de humor foi atualizado para este dia.",
        });
      } else {
        existingEntries.push(entry);
        toast({
          title: "Humor registrado!",
          description: "Seu humor foi salvo com sucesso.",
        });
      }

      localStorage.setItem(`moodr-entries-${user?.id}`, JSON.stringify(existingEntries));
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar seu humor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registrar Humor</CardTitle>
              <CardDescription>Como você está se sentindo?</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Humor</Label>
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedMood === mood.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Anotação (opcional)</Label>
              <Textarea
                id="note"
                placeholder="Como foi seu dia? O que você sentiu?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (opcional)</Label>
              <Input
                id="tags"
                placeholder="trabalho, família, exercício (separado por vírgulas)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};
