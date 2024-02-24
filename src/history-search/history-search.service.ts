import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHistorySearchDto } from './dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class HistorySearchService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
    ) {}

    async getHistorySearch(userId: number) {
        return await this.prismaService.historySearch.findMany({
            take: 10,
            orderBy: {
                updated_at: 'desc',
            },
            where: {
                user_id: userId,
            },
            select: {
                id: true,
                search_content: true,
            },
        });
    }

    async createHistorySearch(
        userId: number,
        createHistorySearchDto: CreateHistorySearchDto,
    ) {
        const { content } = createHistorySearchDto;

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new BadRequestException('User does not exist');
        }

        const isExist = await this.findByContent(content);
        if (!isExist) {
            const isCreated = await this.prismaService.historySearch.create({
                data: {
                    user_id: userId,
                    search_content: content,
                },
            });

            return {
                is_success: isCreated ? true : false,
            };
        }

        await this.prismaService.historySearch.update({
            where: {
                id: isExist.id,
                user_id: userId,
            },
            data: {
                updated_at: new Date(),
            },
        });

        return {
            is_success: true,
        };
    }

    async deleteHistorySearch(searchId: number, userId: number) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new BadRequestException('User does not exist');
        }

        if (!searchId) {
            throw new BadRequestException('Missing search id');
        }

        const isExist = await this.findById(searchId);
        if (!isExist) {
            throw new NotFoundException('Search id does not exist');
        }
        const isDeleted = await this.prismaService.historySearch.delete({
            where: {
                id: searchId,
                user_id: userId,
            },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }

    async findById(searchId: number) {
        if (!searchId) {
            throw new BadRequestException('Missing search id');
        }

        return await this.prismaService.historySearch.findUnique({
            where: {
                id: searchId,
            },
        });
    }

    async findByContent(searchContent: string) {
        if (!searchContent) {
            throw new BadRequestException('Missing search content');
        }

        return await this.prismaService.historySearch.findFirst({
            where: {
                search_content: searchContent,
            },
        });
    }
}
