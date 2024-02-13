import React, { Dispatch, SetStateAction } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioGroupFormProps {
  setReportReason: Dispatch<SetStateAction<string>>;
}

const RadioGroupForm = ({ setReportReason }: RadioGroupFormProps) => {
  return (
    <RadioGroup
      defaultValue=""
      onValueChange={(value) => setReportReason(value)}
      className="mt-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Misinformation" id="option-one" />
        <Label htmlFor="option-one">Misinformation</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Harrassment or bullying" id="option-two" />
        <Label htmlFor="option-two">Harrassment or bullying</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Violent or hate speach" id="option-two" />
        <Label htmlFor="option-two">Violent or hate speech</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Spam" id="option-two" />
        <Label htmlFor="option-two">Spam</Label>
      </div>
    </RadioGroup>
  );
};

export default RadioGroupForm;
