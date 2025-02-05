import { writeable } from 'svelete/store';

const messageStore = writeable('');

const socket = new WebSocket('ws://10.0.0.163:8080/ws')
