import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { toastVariants } from "./toast";

export interface ToastProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof toastVariants> {}

export interface ToastActionElement {
  altText?: string;
  action: React.ReactNode;
}

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};