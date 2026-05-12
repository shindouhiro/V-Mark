'use client';

import { ProgressDashboard } from '@/components/ProgressDashboard';
import { LessonGrid } from '@/components/LessonGrid';
import { CheckInDialog } from '@/components/CheckInDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useState } from 'react';
import { Lesson } from '@/store/useCheckinStore';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      
      <main className="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
        <header className="mb-12 text-center space-y-4 relative">
          <div className="absolute right-0 top-0 z-50">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                console.log('Settings clicked');
                setIsSettingsOpen(true);
              }}
              className="hover:bg-primary/20 rounded-full transition-all active:scale-95"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
            Vue 3 源码学习
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            系统学习 Mini-Vue，每日打卡，记录你的每一次源码解析进步。
          </p>
        </header>

        <ProgressDashboard />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📚 课时大纲
          </h2>
          <LessonGrid onSelectLesson={handleSelectLesson} />
        </div>

        <CheckInDialog 
          lesson={selectedLesson} 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />

        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </main>
    </div>
  );
}
