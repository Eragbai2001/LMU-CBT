// components/academic-select.tsx
import { FormControl, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, Control } from "react-hook-form";

interface AcademicSelectProps {
  name: "departmentId" | "levelId";
  control: Control<any>;
  label: string;
  placeholder: string;
  items: Array<{ id: string; name: string }>;
  description?: string;
}

export function AcademicSelect({
  name,
  control,
  label,
  placeholder,
  items,
  description
}: AcademicSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "_none_"} // Use value instead of defaultValue
          >
            <FormControl>
              <SelectTrigger className="bg-white dark:bg-gray-950">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="_none_">
                {`Select ${name === "departmentId" ? "Department" : "Level"}`}
              </SelectItem>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}