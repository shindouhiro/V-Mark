'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCheckinStore } from '@/store/useCheckinStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Github, CloudUpload, CloudDownload, HelpCircle, Loader2 } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { githubToken, gistId, setGithubToken, setGistId, syncWithGist, fetchFromGist, isSyncing } = useCheckinStore();
  const [token, setToken] = useState('');
  const [gid, setGid] = useState('');

  useEffect(() => {
    setToken(githubToken || '');
    setGid(gistId || '');
  }, [githubToken, gistId, open]);

  const handleSaveSettings = () => {
    setGithubToken(token);
    setGistId(gid);
    toast.success('配置已保存');
  };

  const handleSync = async () => {
    handleSaveSettings();
    try {
      await syncWithGist();
      toast.success('同步到云端成功');
    } catch (error: any) {
      toast.error(`同步失败: ${error.message}`);
    }
  };

  const handleFetch = async () => {
    handleSaveSettings();
    try {
      await fetchFromGist();
      toast.success('从云端恢复数据成功');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`获取失败: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Github className="h-5 w-5" />
            极客云同步配置
          </DialogTitle>
          <DialogDescription>
            使用 GitHub Gist 实现跨设备数据同步
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">GitHub Token (classic)</label>
              <a 
                href="https://github.com/settings/tokens/new?description=NCE1-Checkin-Sync&scopes=gist" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-primary hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-3 w-3" /> 如何获取?
              </a>
            </div>
            <Input 
              type="password" 
              placeholder="ghp_xxxxxxxxxxxx" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-background/50"
            />
            <p className="text-[10px] text-muted-foreground">
              注：Token 仅保存在您的本地浏览器中，绝不会发送给第三方。
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gist ID (可选)</label>
            <Input 
              placeholder="首次同步后将自动生成" 
              value={gid}
              onChange={(e) => setGid(e.target.value)}
              className="bg-background/50"
            />
            <p className="text-[10px] text-muted-foreground">
              如果您已经在其他地方同步过，请填入对应的 Gist ID。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button 
              onClick={handleSync} 
              disabled={isSyncing || !token}
              className="flex items-center gap-2"
            >
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
              保存并同步
            </Button>
            <Button 
              variant="outline" 
              onClick={handleFetch} 
              disabled={isSyncing || !token || !gid}
              className="flex items-center gap-2"
            >
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />}
              从云端拉取
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
