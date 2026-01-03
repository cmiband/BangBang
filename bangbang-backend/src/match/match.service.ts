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

        const existingMatches = this.prepareMatchIds(currentUserId);
        const usersFilteredByExistingMatches = availableUsers.filter((user) => !existingMatches.has(user.id));
        return res.status(200).json({users: usersFilteredByExistingMatches});
    }

    createMatch(firstUserId: string, secondUserId: string, resolved: boolean, res: Response) {
        const relatedExistingMatch = this.findExistingMatch(firstUserId, secondUserId);
        console.log(relatedExistingMatch);
        if(!relatedExistingMatch) {
            this.matches.push({
                userOneId: firstUserId,
                userTwoId: secondUserId,
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
        console.log('if or else');

        return res.status(200).json({success: true});
    }

    findExistingMatch(firstUserId: string, secondUserId: string) : Match | undefined {
        return this.matches.find((match) => {
            const idsInMatch = [match.userOneId, match.userTwoId];

            return idsInMatch.includes(firstUserId) && idsInMatch.includes(secondUserId);
        })
    }

    prepareMatchIds(currentUserId: string): Set<string> {
        const ids = new Set<string>();
        
        this.matches.forEach((match) => {
            if(match.resolved) {
                return;
            }
            
            if(currentUserId != match.userOneId) {
                ids.add(match.userOneId);
            }
            if(currentUserId != match.userTwoId) {
                ids.add(match.userTwoId);
            }
        });

        return ids;
    }
}