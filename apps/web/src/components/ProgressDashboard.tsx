'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCheckinStore } from '@/store/useCheckinStore';
import { Trophy, Flame, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProgressDashboard() {
  const { getOverallProgress, getStreak } = useCheckinStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = mounted ? getOverallProgress() : { completed: 0, total: 54, percentage: 0 };
  const streak = mounted ? getStreak() : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总进度</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.completed} / {progress.total}</div>
          <Progress value={progress.percentage} className="mt-3 h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            已完成 {progress.percentage}%
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">连续打卡</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{streak} 天</div>
          <p className="text-xs text-muted-foreground mt-2">
            保持势头！
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">学习成就</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.completed >= 54 ? '🏅 结课' : '🌱 坚持'}</div>
          <p className="text-xs text-muted-foreground mt-2">
            距离 Mini-Vue 通关还差 {progress.total - progress.completed} 课
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
