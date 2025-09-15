import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "https://si.ge3s.org", "http://si.ge3s.org/"],
            methods: ["GET", "POST"],
            credentials: true,
        },
        allowEIO3: true,
        pingTimeout: 60000,
        connectTimeout: 60000,
        transports: ['websocket', 'polling']
    });

    io.engine.on("connection_error", (err) => {
        console.error("Connection error:", {
            type: err.type,
            message: err.message,
            code: err.code,
            transport: err.transport?.name
        });
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                throw new Error('Authentication token is required');
            }

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.userId;
                socket.userId = userId;
                next();
            } catch (jwtError) {
                console.error("JWT verification failed:", jwtError.message);
                next(new Error('Invalid authentication token'));
            }
        } catch (error) {
            console.error("Authentication middleware error:", error.message);
            return next(new Error('Authentication error: ' + error.message));
        }
    });



    io.on('connection', async (socket) => {

      

        const verifyToken = async () => {
            try {
                const token = socket.handshake.auth.token;

                if (!token) {
                    throw new Error('Authentication token is required', 401);
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return decoded.userId;
            } catch (error) {
                const currentRooms = Object.keys(socket.rooms).filter(r => r !== socket.id);
                if (currentRooms.length > 0) {
                    currentRooms.forEach(room => socket.leave(room));
                }
                throw new Error('Authentication error');
            }
        };


        const targetUserId = socket.userId;
        const targetSockets = Array.from(io.sockets.sockets.values())
            .filter(s => s.userId === targetUserId);

        // Emit to all matching sockets
        targetSockets.forEach(targetSocket => {
            targetSocket.emit('userConnected', {
                userId: socket.userId,
                message: `User ${socket.userId} has connected`
            });
        });


        socket.on('error', (error) => {
            console.error("Socket error for user:", socket.userId, "Error:", error);
        });

        socket.on('disconnect', (reason) => {
            console.log("Socket disconnected. User:", socket.userId, "Reason:", reason);
        });
    });

    io.emitAIResponse = (id) => {
        io.emit('message', { message: 'success', id });
    };

    io.rejectAIResponse = (id) => {
        io.emit('message', { message: 'reject', id });
    };

    io.newMessage = (userId, newMessage) => {
     
        const targetSockets = Array.from(io.sockets.sockets.values())
            .filter(s => s.userId === userId);


        targetSockets.forEach(socket => {
            socket.emit('newMessage', newMessage);
        });
    }
    
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
