'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useCheckinStore, Lesson } from '@/store/useCheckinStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CheckInDialogProps {
  lesson: Lesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInDialog({ lesson, open, onOpenChange }: CheckInDialogProps) {
  const { checkIn, startLesson } = useCheckinStore();
  const [note, setNote] = useState('');
  const [rating, setRating] = useState([3]);

  // When opening, if it's not started, mark it as in progress
  useEffect(() => {
    if (open && lesson && lesson.status === 'not_started') {
      startLesson(lesson.id);
    }
  }, [open, lesson, startLesson]);

  // Load existing data if already completed
  useEffect(() => {
    if (lesson) {
      setNote(lesson.note || '');
      setRating(lesson.rating ? [lesson.rating] : [3]);
    }
  }, [lesson]);

  const handleCheckIn = () => {
    if (!lesson) return;
    
    checkIn(lesson.id, note, rating[0]);
    toast.success(`恭喜！成功打卡 ${lesson.title}`, {
      description: '继续保持学习热情！',
      icon: '🎉',
    });
    onOpenChange(false);
  };

  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            {lesson.title} 打卡
          </DialogTitle>
          <DialogDescription>
            Mini-Vue 源码学习 - 记录你的学习心得与源码感悟
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="aspect-video w-full rounded-md overflow-hidden bg-black/40 border border-white/10 relative group">
            {/* 模拟 B 站视频占位。在实际应用中可使用 iframe */}
            <div className="absolute inset-0 flex items-center justify-center">
              <a 
                href={`https://www.bilibili.com/video/BV1S5411r7XX?p=${lesson.id}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                去 B站 观看视频 {lesson.title.split('-')[0]}
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              掌握程度评分: {rating[0]} / 5
            </label>
            <Slider
              value={rating}
              onValueChange={setRating}
              max={5}
              min={1}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              学习笔记
            </label>
            <Textarea
              placeholder="今天学到了哪些新单词或语法？..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none h-24 bg-background/50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleCheckIn} className="bg-primary hover:bg-primary/90">
            {lesson.status === 'completed' ? '更新打卡' : '完成打卡'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
