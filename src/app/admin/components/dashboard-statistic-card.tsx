import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import React from 'react';

type Props = {
    title: string;
    subtitle: string;
    description: string;
    Icon: LucideIcon;
};
const DashboardStatisticCard = (props: Props) => {
    const { title, subtitle, description, Icon } = props;
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{subtitle}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};

export default DashboardStatisticCard;
