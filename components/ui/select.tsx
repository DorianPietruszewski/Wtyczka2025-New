"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "../../lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:p-0",
        "focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        props.className
      )}
      {...props}
    />
  )
}

function SelectContent({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "animate-in slide-in-from-top-2 z-50 min-w-[8rem] overflow-hidden rounded-md border border-input bg-background text-sm shadow-md",
          props.className
        )}
        {...props}
      />
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className="py-1.5 px-3 text-xs font-semibold uppercase text-muted-foreground"
      {...props}
    />
  )
}

function SelectItem({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none",
        "data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
        "data-[state=hover]:bg-muted data-[state=hover]:text-muted-foreground",
        props.className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute left-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full",
          "data-[state=checked]:bg-accent data-[state=unchecked]:bg-transparent"
        )}
      >
        <CheckIcon className="h-3 w-3 shrink-0 text-accent-foreground" />
      </div>
      {props.children}
    </SelectPrimitive.Item>
  )
}

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem }
