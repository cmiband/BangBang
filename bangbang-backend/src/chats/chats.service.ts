import { Injectable } from '@nestjs/common';
import { User, Match } from "../types/types";
import { Response } from 'express';

@Injectable()
export class ChatsService {

    getUsersToChats(currentId: string, allUsers: User[], allMatches: Match[], res: Response) {
        const matchedUsers = allMatches.filter((match) => (match.userOneId == currentId || match.userTwoId == currentId) && match.resolved && match.successful);
        if(!matchedUsers.length) {
            return res.status(200).json({chats: []});
        }
        const userIds = this.getUserIds(currentId, allMatches);
        const validUsers = this.getUsers(userIds, allUsers);
        
        return res.status(200).json({chats: validUsers});
    }

    getUserIds(currentUserId: string, matches: Match[]) {
        const userIds = new Set<string>();

        matches.forEach((match) => {
            if(!match.resolved) {
                return;
            }

            if(match.userOneId != currentUserId) {
                userIds.add(match.userOneId);
            } else {
                userIds.add(match.userTwoId);
            }
        });

        return userIds;
    }

    getUsers(userIds: Set<string>, allUsers: User[]) {
        return allUsers.filter((user) => userIds.has(user.id));
    }
}