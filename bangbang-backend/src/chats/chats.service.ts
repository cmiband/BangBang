import { Injectable } from '@nestjs/common';
import { User, Match, Thread, Message, ExportedThreadInfo } from "../types/types";
import { Response } from 'express';

@Injectable()
export class ChatsService {
    public threads: Thread[] = [];

    getThreadsToChat(currentId: string, allUsers: User[], allMatches: Match[], res: Response) {
        const relatedChats = this.getRelatedChats(currentId);
        const usersToChat = relatedChats.map((chat) => {
            const userId = chat.firstUserId == currentId ? chat.secondUserId : chat.firstUserId;

            return allUsers.find((user) => user.id == userId);
        });

        return res.status(200).json({chats: usersToChat});
    }

    getUserIds(currentUserId: string, matches: Match[]) {
        const userIds = new Set<string>();

        matches.forEach((match) => {
            if(!match.resolved) {
                return;
            }

            if(match.userOneId != currentUserId && match.userOneStatus == 'accepted') {
                userIds.add(match.userOneId);
            } else if(match.userTwoId != currentUserId && match.userTwoStatus == 'accepted') {
                userIds.add(match.userTwoId);
            }
        });

        return userIds;
    }

    getRelatedChats(currentUserId: string) {
        return this.threads.filter((thread) => [thread.firstUserId, thread.secondUserId].includes(currentUserId));
    }
}