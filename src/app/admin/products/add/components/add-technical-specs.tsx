import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TechnicalSpecsItem } from '@/schemaValidations/product.schema';
import { Button } from '@/components/ui/button';

type Props = {
    handleAddTechnicalSpecs: (updatedSpecs: TechnicalSpecsItem[]) => void;
};

const specs = [
    'Màn hình',
    'Kích thước màn hình',
    'Hệ điều hành',
    'Camera trước',
    'Camera sau',
    'chip',
    'ram',
    'Dung lượng lưu trữ',
    'SIM',
    'Pin, sạc',
    'Cân nặng',
    'Kết nối',
];

const AddTechnicalSpecs = (props: Props) => {
    const { handleAddTechnicalSpecs } = props;
    const [editedSpecs, setEditedSpecs] = useState<TechnicalSpecsItem[]>([]);

    useEffect(() => {
        setEditedSpecs([...specs.map((spec) => ({ name: spec, value: '' }))]);
    }, []);

    const handleSpecChange = (name: string, value: string) => {
        const updatedSpecs = editedSpecs.map((spec) => {
            if (spec.name === name) {
                return { ...spec, value };
            }
            return spec;
        });
        setEditedSpecs(updatedSpecs);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Label htmlFor="technical-specs">Thông số kỹ thuật</Label>
                <Button
                    onClick={() => handleAddTechnicalSpecs(editedSpecs)}
                    size="sm"
                    className="min-w-[100px]"
                >
                    Lưu
                </Button>
            </div>
            {editedSpecs.map((spec) => (
                <div
                    key={spec.name}
                    className="flex gap-3 my-1 items-center justify-between"
                >
                    <Label
                        htmlFor={`technical-specs-${spec.name}`}
                        className="w-[30%]"
                    >
                        {spec.name}
                    </Label>
                    <Input
                        id={`technical-specs-${spec.name}`}
                        type="text"
                        autoComplete="off"
                        className="w-[70%]"
                        value={spec.value}
                        onChange={(e) =>
                            handleSpecChange(spec.name, e.target.value)
                        }
                    />
                </div>
            ))}
        </>
    );
};

export default AddTechnicalSpecs;
