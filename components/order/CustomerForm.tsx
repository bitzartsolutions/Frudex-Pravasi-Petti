"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import {
  customerDetailsSchema,
  type CustomerDetailsFormValues,
} from "@/lib/validations/order";

export const CUSTOMER_FORM_ID = "petti-customer-form";

export function CustomerForm({
  onSubmit,
}: {
  onSubmit: (values: CustomerDetailsFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetailsFormValues>({
    resolver: zodResolver(customerDetailsSchema),
  });

  return (
    <div className="lg:col-span-7 space-y-space-md">
      <div>
        <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-widest">
          Direct Delivery Concierge
        </span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase">
          Almost Ready — Tell Us Where To Send Your Petti
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          We will compile a direct WhatsApp order for immediate packing.
        </p>
      </div>
      <form
        id={CUSTOMER_FORM_ID}
        className="space-y-space-md bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="space-y-1">
            <Label htmlFor="cust-name">Your Full Name *</Label>
            <Input
              id="cust-name"
              placeholder="e.g. Faisal Rahman"
              error={!!errors.customerName}
              {...register("customerName")}
            />
            {errors.customerName ? (
              <p className="text-error text-label-sm font-label-sm">
                {errors.customerName.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-phone">WhatsApp Number *</Label>
            <Input
              id="cust-phone"
              type="tel"
              placeholder="+91 98765 43210 or +971..."
              error={!!errors.whatsappNumber}
              {...register("whatsappNumber")}
            />
            {errors.whatsappNumber ? (
              <p className="text-error text-label-sm font-label-sm">
                {errors.whatsappNumber.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="cust-address-line">Villa/Flat &amp; Street *</Label>
          <Textarea
            id="cust-address-line"
            rows={2}
            placeholder="e.g. Villa 12, Al Wasl Road"
            error={!!errors.addressLine}
            {...register("addressLine")}
          />
          {errors.addressLine ? (
            <p className="text-error text-label-sm font-label-sm">{errors.addressLine.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <div className="space-y-1">
            <Label htmlFor="cust-city">City / District *</Label>
            <Input
              id="cust-city"
              placeholder="e.g. Kozhikode"
              error={!!errors.city}
              {...register("city")}
            />
            {errors.city ? (
              <p className="text-error text-label-sm font-label-sm">{errors.city.message}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-state">State *</Label>
            <Input
              id="cust-state"
              placeholder="e.g. Kerala"
              error={!!errors.state}
              {...register("state")}
            />
            {errors.state ? (
              <p className="text-error text-label-sm font-label-sm">{errors.state.message}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-pincode">PIN / Postal Code *</Label>
            <Input
              id="cust-pincode"
              placeholder="e.g. 673001"
              error={!!errors.pincode}
              {...register("pincode")}
            />
            {errors.pincode ? (
              <p className="text-error text-label-sm font-label-sm">{errors.pincode.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="cust-gift-msg" className="flex items-center justify-between">
            <span>Calligraphed Gift Note (Complimentary)</span>
            <span className="font-label-sm text-label-sm text-outline font-normal">Optional</span>
          </Label>
          <Textarea
            id="cust-gift-msg"
            rows={2}
            placeholder="Write a warm note for the greeting card inside the package..."
            {...register("customerMessage")}
          />
        </div>

        <div className="p-space-sm bg-surface-container rounded-xl flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
          <Icon name="verified_user" className="text-secondary" size={22} />
          <span>
            Your hamper will be securely packaged in food-safe, tamper-evident packaging.
          </span>
        </div>
      </form>
    </div>
  );
}
