import { OrderResponseType } from '@/apiRequests/order';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPrice } from '@/lib/utils';

type Props = {
    orders: OrderResponseType[];
};
export function RecentSales(props: Props) {
    const { orders } = props;
    return (
        <div className="space-y-8">
            {orders &&
                orders.map((order) => {
                    return (
                        <div key={order.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={order.avatar} alt="Avatar" />
                                <AvatarFallback>{order.name}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {order.name}
                                </p>
                                <p className="text-sm text-muted-foreground text-truncate me-4">
                                    {order.email}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-nowrap">
                                + {formatPrice(order.total_amount + order.fee)}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
