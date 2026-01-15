import { WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage,
    OnGatewayDisconnect,
    OnGatewayConnection,
    MessageBody,
    ConnectedSocket 
} from "@nestjs/websockets"
import { Server, Socket } from 'socket.io';
import { ChatsService } from "../chats/chats.service";
import { audit } from "rxjs";

interface ActiveRoom {
    roomId: string,
    userOneId: string,
    userTwoId: string,
    userOneLeft: boolean,
    userTwoLeft: boolean
}

interface ActiveUser {
    userId: string,
    socketId: string
}

@WebSocketGateway({
    cors: {origin: "*"},
    namespace: "/threads"
})
export class ThreadsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    activeRooms: ActiveRoom[] = [];
    activeUsers: ActiveUser[] = [];

    @WebSocketServer()
    server: Server;

    constructor(private readonly chatsService: ChatsService) {}

    async handleConnection(client: Socket) {
        client.emit("connected", { id: client.id });
    }

    handleDisconnect(client: Socket) {
        const linkedUser = this.activeUsers.find((user) => user.socketId == client.id);
        if(!linkedUser) {
            return;
        }
        this.activeRooms.forEach((room) => {
            if(room.userOneId == linkedUser.userId) {
                room.userOneLeft = true;
            } else {
                room.userTwoLeft = true;
            }
        });

        this.activeRooms = this.activeRooms.filter((room) => {
            if(linkedUser.userId == room.userOneId && room.userTwoLeft) {
                return false;
            }
            if(linkedUser.userId == room.userTwoId && room.userOneLeft) {
                return false;
            }

            return true;
        });
        const uId = linkedUser.userId;
        this.activeUsers = this.activeUsers.filter((user) => user.userId != uId);
    }

    @SubscribeMessage("load")
    async onLoad(@ConnectedSocket() client: Socket, @MessageBody() data: { currentUserId: string, socketId: string, secondUserId: string }) {
        const userExists = this.activeUsers.find((user) => user.socketId == data.socketId && user.userId == data.currentUserId);

        if(!userExists) {
            this.activeUsers.push({
                userId: data.currentUserId,
                socketId: data.socketId
            });
        }

        let activeRoom = this.activeRooms.find((room) => {
            const idsInRoom = [room.userOneId, room.userTwoId];

            return idsInRoom.includes(data.currentUserId) && idsInRoom.includes(data.secondUserId);
        });

        if(!activeRoom) {
            activeRoom = this.createRoom(data.currentUserId, data.secondUserId);
            this.activeRooms.push(activeRoom);
        } else {
            if(activeRoom.userOneId == data.currentUserId) {
                activeRoom.userOneLeft = false;
            } else {
                activeRoom.userTwoLeft = false;
            }
        }
        await client.join(activeRoom.roomId);

        return { success: true };
    }

    @SubscribeMessage("messages") 
    async onMessages(@ConnectedSocket() client: Socket, @MessageBody() data: { currentUserId: string, secondUserId: string }) {
        const thread = this.chatsService.threads.find((thread) => {
            const idsInThread = [thread.firstUserId, thread.secondUserId];

            return idsInThread.includes(data.currentUserId) && idsInThread.includes(data.secondUserId);
        });

        return { thread: thread };
    }

    @SubscribeMessage("send")
    async onSend(@ConnectedSocket() client: Socket, @MessageBody() data: {message: string, author: string, secondUserId: string}) {
        const thread = this.chatsService.threads.find((thread) => {
            const idsInThread = [thread.firstUserId, thread.secondUserId];

            return idsInThread.includes(data.author) && idsInThread.includes(data.secondUserId);
        });

        if(!thread) {
            return { success: false };
        }

        thread.messages.push({
            message: data.message,
            authorId: data.author,
            createdDate: Date.now()
        });
        const room = this.activeRooms.find((room) => {
            const roomIds = [room.userOneId, room.userTwoId];

            return roomIds.includes(data.author) && roomIds.includes(data.secondUserId);
        })
 
        if(!room) {
            return { success: false };
        }
        this.server.to(room.roomId).emit("refresh", {thread: thread});
        
        return { success: true };
    }

    createRoom(userOneId: string, userTwoId: string) : ActiveRoom {
        return {
            userOneId: userOneId,
            userTwoId: userTwoId,
            roomId: crypto.randomUUID(),
            userOneLeft: false,
            userTwoLeft: true
        };
    }
}
