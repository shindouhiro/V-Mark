'use client';

import { useCheckinStore, Lesson } from '@/store/useCheckinStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Lock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LessonGridProps {
  onSelectLesson: (lesson: Lesson) => void;
}

export function LessonGrid({ onSelectLesson }: LessonGridProps) {
  const { lessons } = useCheckinStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border border-white/10 glass-card p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {lessons.map((lesson) => {
          const isCompleted = lesson.status === 'completed';
          const isInProgress = lesson.status === 'in_progress';

          return (
            <Card
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={cn(
                'relative flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 hover:scale-105',
                isCompleted ? 'bg-primary/20 border-primary/50' : 'bg-secondary/50',
                isInProgress ? 'pulse-border ring-2 ring-primary' : ''
              )}
            >
              <div className="text-center">
                <h4 className="text-sm font-semibold">{lesson.title}</h4>
                <div className="mt-2 flex justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : isInProgress ? (
                    <PlayCircle className="h-6 w-6 text-blue-400" />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </div>
              {isCompleted && (
                <Badge variant="default" className="absolute -top-2 -right-2 px-1 py-0 text-[10px]">
                  已学
                </Badge>
              )}
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
