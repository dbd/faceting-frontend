import {writable} from 'svelte/store';

export interface StatusMessage {
  tiltPos: number;
  heightPos: number;
  rotationPos: number;
  gyroXAccel: number;
  gyroYAccel: number;
  gyroZAccel: number;
  range: number;
}

export interface Servo {
  id: string;
  name: string;
  presets: Array<number>;
  increments: Array<number>;
}

export const websocketStore = (url: string) => {
  const {subscribe, set, update} = writable<string>('');
  let socket: WebSocket | null = null;
  let statusMessages: Array<StatusMessage> = $state([]);

  const connect = () => {
    if (socket) return; // Prevent multiple connections

    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      let statusMessage: StatusMessage = JSON.parse(event.data)
      statusMessages.push(statusMessage)
      if (statusMessages.length > 50) {
        statusMessages.shift()

      }
      set(event.data);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      socket = null;
    };
  };

  const send = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  const setPositionMessage = (key: string, pos: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      let msg = '{"action": "setPosition", "args":["' + key + '",' + pos + "]}";
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

  return {
    subscribe,
    send,
    statusMessages,
    setPositionMessage,
    addPositionMessage,
  };
};
