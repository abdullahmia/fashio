"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateUserAction } from "../../../action";

const ZUpateName = z.object({
  name: z
    .string()
    .min(3, { message: "Name should be at least 3 characters long" }),
});

export default function AccountDetailsForm({ initialData }) {
  // Local State
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(ZUpateName),
    defaultValues: {
      name: initialData?.name,
    },
  });

  /**
   * HANDLERS
   */
  const handleOnSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUserAction(initialData.id, data);
      setLoading(false);
      toast.success("Account updated successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update account");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4">
      <div>
        <Label className="text-sm text-secondary font-medium block mb-1">
          Full name
        </Label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input className="text-sm text-secondary" {...field} />
          )}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors?.name?.message}</p>
        )}
      </div>

      <div>
        <Label className="text-sm text-secondary font-medium block mb-1">
          Email
        </Label>
        <Input value={initialData?.email} disabled />
      </div>

      <div className="pt-8">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
