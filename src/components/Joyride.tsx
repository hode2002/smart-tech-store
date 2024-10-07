import React from 'react';
import Joyride from 'react-joyride';

const CustomJoyride = ({
    steps,
    run,
    setRun,
}: {
    steps: {
        target: string;
        content: string;
    }[];
    run: boolean;
    setRun: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <Joyride
            steps={steps}
            continuous={true}
            showSkipButton={true}
            run={run}
            showProgress={true}
            floaterProps={{
                autoOpen: true,
            }}
            styles={{
                options: {
                    zIndex: 10000,
                },
            }}
            callback={(data) => {
                const { status } = data;
                const finishedStatuses = ['finished', 'skipped'];
                if (finishedStatuses.includes(status)) {
                    setRun(false);
                }
            }}
        />
    );
};

export default CustomJoyride;
