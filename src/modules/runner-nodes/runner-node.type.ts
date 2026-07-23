export interface RunnerNode {
  id: string;
  name: string;
  runtimeVersion: string;
  capacity: number;
  lastHeartbeatAt: Date;
  draining: boolean;
}

