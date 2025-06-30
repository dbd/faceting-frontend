import {writable} from 'svelte/store';

export interface StatusMessage {
  servoStatus: Map<string, ServoStatus>;
  gyroXAccel?: number;
  gyroYAccel?: number;
  gyroZAccel?: number;
  range?: number;
}

export interface Servo {
  id: string;
  name: string;
  presets: Array<number>;
  increments: Array<number>;
  raw: boolean;
}

export interface ServoStatus {
  moving?: boolean;
  torqueEnabled?: boolean;
  position?: number | null;
}

export const websocketStore = (url: string) => {
  const {subscribe, set, update} = writable<string>('');
  let socket: WebSocket | null = null;
  let statusMessages: Array<StatusMessage> = $state([]);
  let connected: boolean = $state(false)
  const emptyMap: Map<string, ServoStatus> = new Map<string, ServoStatus>([["height", {"moving": false, "torqueEnabled": false, "position": null}]])
  let latestStatus: StatusMessage = $state({"servoStatus": emptyMap})

  const connect = () => {
    if (socket) return; // Prevent multiple connections

    socket = new WebSocket(url);
    for (let i = 0; i < 50; i++) {
      statusMessages.push({
        "servoStatus": emptyMap,
      })
    }

    socket.onopen = () => {
      connected = true;
    };

    socket.onmessage = (event) => {
      let latestStatus: StatusMessage = JSON.parse(event.data)
      let unmarshalled = new Map(Object.entries(latestStatus.servoStatus))
      let servoStatus: Map<string, ServoStatus> = new Map<string, ServoStatus>()
      function setServoStatus(value: any, key: string, map: any) {
        let nm = new Map<string, ServoStatus>(Object.entries(value));
        for (const key of nm.keys()) {
          servoStatus.set(key, nm.get(key));
        }
      }
      unmarshalled.forEach(setServoStatus);
      latestStatus.servoStatus = servoStatus
      statusMessages.push(latestStatus)
      if (statusMessages.length > 50) {
        statusMessages.shift()

      }
    };

    socket.onclose = () => {
      connected = false;
      socket = null;
    };
  };

  const send = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  const setPositionMessage = (key: string, pos: number, raw: boolean) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let t = {
        action: "setPosition",
        args: [key, pos, raw]
      }
      let msg = JSON.stringify(t)
      console.log(msg)
      socket.send(msg);
    }
  }

  const addPositionMessage = (key: string, pos: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let msg = '{"action": "addPosition", "args":["' + key + '",' + pos + "]}";
      console.log(msg)
      socket.send(msg);
    }
  }

  connect(); // Connect on store creation

  const reconnect = () => {
    if (!socket) {
      console.log("Reconnecting to websocket")
      connect()
    }
  }

  return {
    subscribe,
    send,
    statusMessages,
    setPositionMessage,
    addPositionMessage,
    get connected() {
      return connected;
    },
    get latestStatus() {
      return latestStatus;
    },
    reconnect,
  };
};
