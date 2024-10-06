import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as otpGenerator from 'otp-generator';
import { VoucherType } from '@prisma/client';
import { CheckValidVoucherDto } from 'src/voucher/dto/check-valid-voucher.dto';
import * as moment from 'moment';

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
        });
    }

    async checkValidVoucher(
        userId: string,
        checkValidVoucherDto: CheckValidVoucherDto,
    ) {
        const { voucherCode, totalOrderPrice } = checkValidVoucherDto;

        const voucher = await this.prismaService.voucher.findFirst({
            where: { code: voucherCode },
        });
        if (!voucher) {
            throw new ForbiddenException('Invalid voucher code!');
        }

        if (voucher.status === 1) {
            throw new ForbiddenException('Voucher expired!');
        }

        const start_date = moment.utc(voucher.start_date, 'DD-MM-YYYY');
        const end_date = moment.utc(voucher.end_date, 'DD-MM-YYYY');
        const date = moment(new Date()).format('YYYY-DD-MM');
        const today = moment.utc(date);

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
        });
        if (userOrderWithVoucher) {
            throw new ForbiddenException(
                `voucher '${voucherCode}' has already been used!`,
            );
        }

        if (voucher.available_quantity <= 0) {
            throw new ForbiddenException('Voucher is not available!');
        }

        const isValidVoucher = totalOrderPrice > voucher.min_order_value;
        if (!isValidVoucher) {
            throw new ForbiddenException(
                'Total order value is not enough to activate voucher!',
            );
        }

        return voucher;
    }

    async applyVoucherToOrder(orderId: string, voucherCode: string) {
        const voucher = await this.prismaService.voucher.findFirst({
            where: { code: voucherCode },
            include: { order_vouchers: true },
        });

        if (!voucher) {
            throw new NotFoundException('Voucher not found');
        }

        if (voucher.order_vouchers.some((i) => i.order_id === orderId)) {
            throw new ForbiddenException(
                `voucher '${voucherCode}' has already been used!`,
            );
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
            throw new ForbiddenException(
                'The order cannot apply the voucher code.',
            );
        }

        const isCreated = await this.prismaService.orderVoucher.create({
            data: {
                order_id: orderId,
                voucher_id: voucher.id,
            },
        });

        if (isCreated?.id) {
            await this.prismaService.voucher.update({
                where: { id: voucher.id },
                data: { available_quantity: voucher.available_quantity - 1 },
            });
        }

        return voucher;
    }

    async findAll() {
        return await this.prismaService.voucher.findMany();
    }

    async findOne(id: string) {
        return await this.prismaService.voucher.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateVoucherDto: UpdateVoucherDto) {
        const type = updateVoucherDto?.type;
        if (
            type &&
            !(type === VoucherType.FIXED || type === VoucherType.PERCENT)
        ) {
            throw new BadRequestException('Invalid voucher type');
        }

        const voucher = await this.prismaService.voucher.findFirst({
            where: { code: updateVoucherDto?.code },
        });
        if (voucher) {
            throw new ConflictException('Voucher code already exist!');
        }

        const start_date = moment.utc(
            updateVoucherDto.start_date.split('T')[0],
            'DD-MM-YYYY',
        );
        const end_date = moment.utc(
            updateVoucherDto.end_date.split('T')[0],
            'DD-MM-YYYY',
        );

        const isValidDate =
            start_date.isValid() &&
            end_date.isValid() &&
            start_date.isBefore(end_date);

        if (!isValidDate) {
            throw new ForbiddenException('Invalid voucher date!');
        }

        return await this.prismaService.voucher.update({
            where: { id },
            data: { ...updateVoucherDto },
        });
    }

    async remove(id: string) {
        return await this.prismaService.voucher.update({
            where: { id },
            data: { status: 1 },
        });
    }

    async restore(id: string) {
        return await this.prismaService.voucher.update({
            where: { id },
            data: { status: 0 },
        });
    }
}
