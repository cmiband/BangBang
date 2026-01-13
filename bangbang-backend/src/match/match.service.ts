import { Injectable } from '@nestjs/common';
import { Response } from "express";
import { Match,User } from '../types/types';

@Injectable()
export class MatchService {
    public matches : Array<Match> = [];

    getAvailableMatches(allUsers: Array<User>, currentUserId: string, res: Response) {
        const currentUser = allUsers.find((user) => currentUserId == user.id);
        if(!currentUser) {
            return res.status(500);
        }

        const availableUsers = allUsers.filter((user) => user.id!=currentUserId && currentUser.gender!=user.gender);
        if(!availableUsers.length) {
            return res.status(200).json({users: []});
        }

        const excludedUserIds = this.prepareExcludedUsers(currentUserId);
        excludedUserIds.add(currentUserId);
        const usersFiltered = allUsers.filter((user) => !excludedUserIds.has(user.id));
        console.log(excludedUserIds);
        console.log(usersFiltered);
        return res.status(200).json({users: usersFiltered});
    }

    createMatch(matchAuthor: string, secondUserId: string, resolved: boolean, res: Response) {
        const relatedExistingMatch = this.findExistingMatch(matchAuthor, secondUserId);
        if(!relatedExistingMatch) {
            this.matches.push({
                userOneId: matchAuthor,
                userTwoId: secondUserId,
                userOneAccepted: true,
                userTwoAccepted: false,
                resolved: resolved,
                successful: false
            });
        } else {
            const isExistingMatchResolved = relatedExistingMatch.resolved;
            
            if(!isExistingMatchResolved) {
                relatedExistingMatch.successful = true;
                relatedExistingMatch.resolved = true;
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
            if((match.resolved && (match.userOneId == currentUserId || match.userTwoId == currentUserId))) {
                ids.add(match.userOneId);
                ids.add(match.userTwoId);
                return;
            }
        });

        return ids;
    }
}