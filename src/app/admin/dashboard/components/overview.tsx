import { OrderResponseType } from '@/apiRequests/order';
import moment from 'moment';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type Props = {
    orders: OrderResponseType[];
};

type ChartColumn = {
    name: string;
    total: number;
};
export function Overview(props: Props) {
    const { orders } = props;

    const getTotalByMonth = (month: number) => {
        let total = 0;
        orders.map((order) => {
            if (
                moment(order.estimate_date).month() === month &&
                order.status === 2
            ) {
                total += order.total_amount + order.fee;
            }
        });
        return total;
    };

    const getData = (): ChartColumn[] => {
        const data: ChartColumn[] = Array.from({
            length: moment(new Date()).month() + 1,
        }).map((_, month) => {
            return {
                name: 'T' + (month + 1),
                total: getTotalByMonth(month),
            };
        });
        return data;
    };

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getData()}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                    className="mx-2"
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={true}
                    axisLine={true}
                    tickFormatter={(value) => `${value / 1000000}`}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                    minPointSize={1}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
