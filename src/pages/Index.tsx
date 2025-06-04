
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Heart, Calendar, Smile, Moon, Sun } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Moodr
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Seu diário de humor pessoal. Acompanhe suas emoções, descubra padrões e cultive bem-estar mental.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/register">
                Começar agora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/login">
                Já tenho conta
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 animate-scale-in border-primary/20">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-mood-happy to-mood-excited rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Registre seu Humor</h3>
              <p className="text-muted-foreground">
                Capture suas emoções diárias com emojis intuitivos e anotações pessoais.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 animate-scale-in border-primary/20" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visualize Padrões</h3>
              <p className="text-muted-foreground">
                Acompanhe seu bem-estar ao longo do tempo com um calendário visual colorido.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 animate-scale-in border-primary/20" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-mood-calm to-mood-anxious rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cultive Bem-estar</h3>
              <p className="text-muted-foreground">
                Receba frases motivacionais diárias e insights sobre sua jornada emocional.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Theme Demo */}
        <Card className="max-w-2xl mx-auto p-8 text-center bg-gradient-to-br from-card to-card/50 border-primary/20">
          <CardContent>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Sun className="h-8 w-8 text-mood-happy" />
              <span className="text-2xl">🌗</span>
              <Moon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Modo Claro & Escuro</h3>
            <p className="text-muted-foreground mb-6">
              Escolha o tema que combina com seu humor. Interface adaptável para qualquer momento do dia.
            </p>
            <p className="text-sm text-muted-foreground">
              Experimente o botão de tema no canto superior direito! 
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Moodr. Cuide do seu bem-estar mental.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
