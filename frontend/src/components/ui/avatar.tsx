import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: AvatarPrimitive.AvatarProps) {
  return <AvatarPrimitive.Root className={cn("relative h-10 w-10 overflow-hidden rounded-full", className)} {...props} />;
}

export function AvatarImage(props: AvatarPrimitive.AvatarImageProps) {
  return <AvatarPrimitive.Image className="h-full w-full object-cover" {...props} />;
}

export function AvatarFallback({ className, ...props }: AvatarPrimitive.AvatarFallbackProps) {
  return <AvatarPrimitive.Fallback className={cn("flex h-full w-full items-center justify-center bg-muted text-xs", className)} {...props} />;
}