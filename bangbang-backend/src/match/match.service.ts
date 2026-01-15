import { Injectable } from '@nestjs/common';
import { Response } from "express";
import { Match,User } from '../types/types';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class MatchService {
    public matches : Array<Match> = [];

    getAvailableMatches(allUsers: Array<User>, currentUserId: string, res: Response) {
        const currentUser = allUsers.find((user) => currentUserId == user.id);
        if(!currentUser) {
            return res.status(500);
        }

        const availableUsers = allUsers.filter((user) => user.id!=currentUserId);
        if(!availableUsers.length) {
            return res.status(200).json({users: []});
        }

        const excludedUserIds = this.prepareExcludedUsers(currentUserId);
        excludedUserIds.add(currentUserId);
        const usersFiltered = allUsers.filter((user) => !excludedUserIds.has(user.id));

        return res.status(200).json({users: usersFiltered});
    }

    createMatch(currentUserId: string, secondUserId: string, resolved: boolean, res: Response, chatsService: ChatsService) {
        const relatedExistingMatch = this.findExistingMatch(currentUserId, secondUserId);
        if(!relatedExistingMatch) {
            const status = resolved ? 'declined' : 'accepted';

            this.matches.push({
                userOneId: currentUserId,
                userTwoId: secondUserId,
                userOneStatus: status,
                userTwoStatus: 'none',
                resolved: false
            });
        } else {
            const isUserFirstUser = relatedExistingMatch.userOneId === currentUserId;
            const status = resolved ? 'declined' : 'accepted';

            relatedExistingMatch.resolved = true;
            if(isUserFirstUser) {
                relatedExistingMatch.userOneStatus = status;
            } else {
                relatedExistingMatch.userTwoStatus = status;
            }

            if(relatedExistingMatch.userOneStatus == 'accepted' && relatedExistingMatch.userTwoStatus == 'accepted') {
                chatsService.threads.push({
                    firstUserId: currentUserId,
                    secondUserId: secondUserId,
                    messages: []
                });
            }
        }

        return res.status(200).json({success: true});
    }

    findExistingMatch(firstUserId: string, secondUserId: string) : Match | undefined {
        return this.matches.find((match) => {
            const idsInMatch = [match.userOneId, match.userTwoId];

            return idsInMatch.includes(firstUserId) && idsInMatch.includes(secondUserId);
        })
    }

    prepareExcludedUsers(currentUserId: string): Set<string> {
        const ids = new Set<string>();
        
        this.matches.forEach((match) => {
            const idsInMatch = [match.userOneId, match.userTwoId];
            if(idsInMatch.includes(currentUserId) && (match.resolved || this.checkIfOppositeUserDeclinedMatch(match, currentUserId))) {
                ids.add(match.userOneId);
                ids.add(match.userTwoId);
                return;
            }
        });

        return ids;
    }

    checkIfOppositeUserDeclinedMatch(match: Match, currentUserId: string) {
        const isFirstUser = match.userOneId == currentUserId;

        return isFirstUser ? match.userTwoStatus == "declined" : match.userOneStatus == "declined";
    }
}