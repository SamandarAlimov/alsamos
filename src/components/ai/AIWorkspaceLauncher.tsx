import { useEffect, useState } from 'react';
import { AIWorkspaceDialog } from './AIWorkspaceDialog';

type WorkspaceKey = 'projects' | 'artifacts' | 'connectors' | 'skills';

export function AIWorkspaceLauncher() {
  const [state, setState] = useState<{ open: boolean; section: WorkspaceKey }>({ open: false, section: 'projects' });
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ section?: WorkspaceKey }>).detail;
      setState({ open: true, section: detail?.section ?? 'projects' });
    };
    window.addEventListener('alsamos:open-ai-workspace', handler);
    return () => window.removeEventListener('alsamos:open-ai-workspace', handler);
  }, []);
  return <AIWorkspaceDialog open={state.open} section={state.section} onClose={() => setState((s) => ({ ...s, open: false }))} />;
}
