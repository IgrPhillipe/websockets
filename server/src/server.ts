import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

interface Room {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  lastName: string;
  room: Room;
}

interface Message {
  id: string;
  message: string;
  room: Room;
  user: User;
}

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const rooms: Room[] = [];

const users: User[] = [];

const messages: Message[] = [];

httpServer.listen(3001, () => {
  console.log('🚀 Server is running on port 3001');

  io.on('connection', (socket) => {
    socket.emit('connected', 'You are connected to the server.');

    socket.on('join-room', (data) => {
      const { room, user } = data;

      if (room) {
        socket.join(room.id);

        const selectedRoom = rooms.find((item: Room) => item.id === room.id);
        const selectedUserInRoom = users.find(
          (item: User) => item.id === user.id && item.room.id === room.id,
        );

        if (!selectedRoom) {
          rooms.push(room);
        }

        if (!selectedUserInRoom) {
          users.push({ ...user, ...room });
        }

        socket.broadcast.emit('all-rooms', rooms.map(
          (item: Room) => ({
            ...(item),
            messages: messages.filter((aux: Message) => aux.room.id === item.id),
          }),
        ));

        socket.emit('all-rooms', rooms.map(
          (item: Room) => ({
            ...(item),
            messages: messages.filter((aux: Message) => aux.room.id === item.id),
          }),
        ));
      }
    });

    socket.on('new-message', (data) => {
      const {
        id,
        message,
        room,
        user,
      } = data;

      const messageData = {
        id,
        message,
        room,
        user,
      };

      messages.push(messageData);

      socket.broadcast.emit('all-rooms', rooms.map(
        (item: Room) => ({
          ...(item),
          messages: messages.filter((aux: Message) => aux.room.id === item.id),
        }),
      ));
    });

    socket.emit('all-rooms', rooms.map(
      (item: Room) => ({
        ...(item),
        messages: messages.filter((aux: Message) => aux.room.id === item.id),
      }),
    ));
  });
});
