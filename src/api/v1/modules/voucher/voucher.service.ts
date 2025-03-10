import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { VoucherType } from '@prisma/client';
import moment from 'moment';
import * as otpGenerator from 'otp-generator';

import { PrismaService } from '@/prisma/prisma.service';
import {
    VOUCHER_APPLY_SELECT,
    VOUCHER_BASIC_SELECT,
    VOUCHER_CHECK_SELECT,
    VOUCHER_ORDER_SELECT,
    VOUCHER_UPDATE_SELECT,
} from '@/prisma/selectors';
import { CheckValidVoucherDto } from '@v1/modules/voucher/dto/check-valid-voucher.dto';

import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VoucherService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createVoucherDto: CreateVoucherDto) {
        const type = createVoucherDto.type;
        if (!(type === VoucherType.FIXED || type === VoucherType.PERCENT)) {
            throw new BadRequestException('Invalid voucher type');
        }

        let voucherCode: string;
        if (createVoucherDto?.code) {
            const voucher = await this.prismaService.voucher.findFirst({
                where: { code: createVoucherDto?.code },
                select: { id: true },
            });
            if (voucher) {
                throw new ConflictException('Voucher code already exist!');
            }
            voucherCode = createVoucherDto?.code;
        } else {
            voucherCode = otpGenerator.generate(10, {
                specialChars: false,
                digits: true,
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
            });
        }

        return await this.prismaService.voucher.create({
            data: {
                ...createVoucherDto,
                code: voucherCode,
                status: 0,
            },
            select: VOUCHER_BASIC_SELECT,
        });
    }

    async checkValidVoucher(userId: string, checkValidVoucherDto: CheckValidVoucherDto) {
        const { voucherCode, totalOrderPrice } = checkValidVoucherDto;

        const voucher = await this.prismaService.voucher.findFirst({
            where: { code: voucherCode },
            select: VOUCHER_CHECK_SELECT,
        });
        if (!voucher) {
            throw new ForbiddenException('Invalid voucher code!');
        }

        if (voucher.status === 1) {
            throw new ForbiddenException('Voucher expired!');
        }

        const start_date = moment.utc(voucher.start_date, 'DD-MM-YYYY');
        const end_date = moment.utc(voucher.end_date, 'DD-MM-YYYY');
        const today = moment.utc();

        const isValidDate =
            today.isValid() &&
            start_date.isValid() &&
            end_date.isValid() &&
            start_date.isBefore(end_date) &&
            today.isBetween(start_date, end_date);

        if (!isValidDate) {
            throw new ForbiddenException('Invalid voucher date!');
        }

        const userOrderWithVoucher = await this.prismaService.order.findFirst({
            where: {
                user_id: userId,
                order_vouchers: { some: { voucher_id: voucher.id } },
            },
            select: { id: true },
        });
        if (userOrderWithVoucher) {
            throw new ForbiddenException(`voucher '${voucherCode}' has already been used!`);
        }

        if (voucher.available_quantity <= 0) {
            throw new ForbiddenException('Voucher is not available!');
        }

        const isValidVoucher = totalOrderPrice > voucher.min_order_value;
        if (!isValidVoucher) {
            throw new ForbiddenException('Total order value is not enough to activate voucher!');
        }

        return voucher;
    }

    async applyVoucherToOrder(orderId: string, voucherCode: string) {
        const voucher = await this.prismaService.voucher.findFirst({
            where: { code: voucherCode },
            select: VOUCHER_ORDER_SELECT,
        });

        if (!voucher) {
            throw new NotFoundException('Voucher not found');
        }

        if (voucher.order_vouchers.some(i => i.order_id === orderId)) {
            throw new ForbiddenException(`voucher '${voucherCode}' has already been used!`);
        }

        const order = await this.prismaService.order.findUnique({
            where: { id: orderId },
            select: {
                user_id: true,
                total_amount: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const isValid = await this.checkValidVoucher(order.user_id, {
            voucherCode,
            totalOrderPrice: order.total_amount,
        });

        if (!isValid) {
            throw new ForbiddenException('The order cannot apply the voucher code.');
        }

        const isCreated = await this.prismaService.orderVoucher.create({
            data: {
                order_id: orderId,
                voucher_id: voucher.id,
            },
            select: { id: true },
        });

        if (isCreated?.id) {
            await this.prismaService.voucher.update({
                where: { id: voucher.id },
                data: { available_quantity: voucher.available_quantity - 1 },
                select: VOUCHER_APPLY_SELECT,
            });
        }

        return voucher;
    }

    async findAll() {
        return await this.prismaService.voucher.findMany({
            select: VOUCHER_BASIC_SELECT,
        });
    }

    async findOne(id: string) {
        return await this.prismaService.voucher.findUnique({
            where: { id },
            select: VOUCHER_BASIC_SELECT,
        });
    }

    async update(id: string, updateVoucherDto: UpdateVoucherDto) {
        const type = updateVoucherDto?.type;
        if (type && !(type === VoucherType.FIXED || type === VoucherType.PERCENT)) {
            throw new BadRequestException('Invalid voucher type');
        }

        if (updateVoucherDto?.code) {
            const voucher = await this.prismaService.voucher.findFirst({
                where: {
                    code: updateVoucherDto.code,
                    id: { not: id },
                },
                select: { id: true },
            });
            if (voucher) {
                throw new ConflictException('Voucher code already exist!');
            }
        }

        if (updateVoucherDto.start_date && updateVoucherDto.end_date) {
            const start_date = moment.utc(updateVoucherDto.start_date.split('T')[0], 'DD-MM-YYYY');
            const end_date = moment.utc(updateVoucherDto.end_date.split('T')[0], 'DD-MM-YYYY');

            const isValidDate =
                start_date.isValid() && end_date.isValid() && start_date.isBefore(end_date);

            if (!isValidDate) {
                throw new ForbiddenException('Invalid voucher date!');
            }
        }

        return await this.prismaService.voucher.update({
            where: { id },
            data: { ...updateVoucherDto },
            select: VOUCHER_UPDATE_SELECT,
        });
    }

    async remove(id: string) {
        return await this.prismaService.voucher.update({
            where: { id },
            data: { status: 1 },
            select: VOUCHER_UPDATE_SELECT,
        });
    }

    async restore(id: string) {
        return await this.prismaService.voucher.update({
            where: { id },
            data: { status: 0 },
            select: VOUCHER_UPDATE_SELECT,
        });
    }
}
