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

    createMatch(firstUserId: string, secondUserId: string, res: Response) {
        this.matches.push({
            userOneId: firstUserId,
            userTwoId: secondUserId,
            resolved: false,
            successful: false
        });

        return res.status(200);
    }

    prepareMatchIds(currentUserId: string): Set<string> {
        const ids = new Set<string>();
        
        this.matches.forEach((match) => {
            if(!match.resolved) {
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