import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Inject,
    BadRequestException,
} from '@nestjs/common';
import { Status } from '@prisma/client';

import { generateCode } from '@/common/utils';
import { VOUCHER_ORDER_SELECT, VoucherOrder, VoucherBasic } from '@/prisma/selectors';
import { ORDER_TOKENS } from '@v2/modules/order/constants';
import { IOrderQueryService } from '@v2/modules/order/interfaces';
import { VOUCHER_TOKENS } from '@v2/modules/voucher/constants';
import { CreateVoucherDto, UpdateVoucherDto } from '@v2/modules/voucher/dtos';
import {
    IVoucherCommandRepository,
    IVoucherCommandService,
    IVoucherQueryService,
} from '@v2/modules/voucher/interfaces';

@Injectable()
export class VoucherCommandService implements IVoucherCommandService {
    constructor(
        @Inject(VOUCHER_TOKENS.SERVICES.VOUCHER_QUERY_SERVICE)
        private readonly voucherQueryService: IVoucherQueryService,
        @Inject(VOUCHER_TOKENS.REPOSITORIES.VOUCHER_COMMAND_REPOSITORY)
        private readonly voucherCommandRepo: IVoucherCommandRepository,
        @Inject(ORDER_TOKENS.SERVICES.QUERY)
        private readonly orderQueryService: IOrderQueryService,
    ) {}

    async create(createVoucherDto: CreateVoucherDto): Promise<VoucherBasic> {
        let voucherCode: string;

        if (createVoucherDto?.code) {
            await this.voucherQueryService.findByVoucherCode(createVoucherDto?.code);
            voucherCode = createVoucherDto?.code;
        } else {
            voucherCode = generateCode(10);
        }

        const data = {
            ...createVoucherDto,
            code: voucherCode,
            status: Status.INACTIVE,
        };

        return this.voucherCommandRepo.create(data);
    }

    async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<VoucherBasic> {
        if (updateVoucherDto?.code) {
            await this.voucherQueryService.findFirst<VoucherBasic>({
                code: updateVoucherDto.code,
                id: { not: id },
            });
        }

        return this.voucherCommandRepo.update({ id }, updateVoucherDto);
    }

    async delete(id: string): Promise<boolean> {
        return this.voucherCommandRepo.delete(id);
    }

    async restore(id: string): Promise<boolean> {
        return this.voucherCommandRepo.restore(id);
    }

    async applyVoucherToOrder(orderId: string, voucherCode: string): Promise<boolean> {
        const voucher = await this.voucherQueryService.findFirst<VoucherOrder>(
            { code: voucherCode },
            VOUCHER_ORDER_SELECT,
        );

        if (voucher.order_vouchers.some(i => i.order_id === orderId)) {
            throw new ForbiddenException(`voucher '${voucherCode}' has already been used!`);
        }

        const order = await this.orderQueryService.findById(orderId);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.voucherQueryService.checkValidVoucher(order.user_id, {
            voucherCode,
            totalOrderPrice: order.total_amount,
        });

        const isCreated = await this.voucherCommandRepo.createOrderVoucher({
            order: { connect: { id: orderId } },
            voucher: { connect: { id: voucher.id } },
        });

        if (isCreated) {
            await this.voucherCommandRepo.update(
                { id: voucher.id },
                { quantity: { decrement: 1 } },
            );
        } else {
            throw new BadRequestException('Failed to apply voucher to order');
        }

        return true;
    }
}
