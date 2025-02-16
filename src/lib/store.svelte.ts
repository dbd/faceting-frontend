import {writable} from 'svelte/store';

  export interface StatusMessage {
    tiltPos: number;
    heightPos: number;
    rotationPos: number;
    gyroXAccel: number;
    gyroYAccel: number;
    gyroZAccel: number;
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

  connect(); // Connect on store creation

  return {
    subscribe,
    send,
    statusMessages,
  };
};
