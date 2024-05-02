import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
type Props = {
    title: string;
    subtitle: string;
    description?: string;
};
const OrderStatisticCard = (props: Props) => {
    const { title, subtitle, description = '' } = props;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{subtitle}</CardDescription>
                <CardTitle className="text-4xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground">
                    {description}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderStatisticCard;
