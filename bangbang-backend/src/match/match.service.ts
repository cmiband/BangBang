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

        const existingMatches = this.prepareMatchIds();
        const usersFilteredByExistingMatches = availableUsers.filter((user) => !existingMatches.has(user.id));
        return res.status(200).json({users: usersFilteredByExistingMatches});
    }

    prepareMatchIds(): Set<string> {
        const ids = new Set<string>();
        
        this.matches.forEach((match) => {
            ids.add(match.userOneId);
            ids.add(match.userTwoId);
        });

        return ids;
    }
}