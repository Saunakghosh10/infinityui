'use client';

import { ClientWrapper } from '@/components/client-wrapper';
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenubarItem {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  items?: MenubarItem[];
  onClick?: () => void;
}

interface MenubarProps {
  items: {
    trigger: string;
    items: MenubarItem[];
  }[];
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none",
      "text-zinc-400 hover:text-zinc-100",
      "focus:bg-zinc-800 focus:text-zinc-100",
      "data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-100",
      className
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/90 p-1 backdrop-blur-sm shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "text-zinc-400 hover:text-zinc-100",
      "focus:bg-zinc-800 focus:text-zinc-100",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-zinc-800", className)}
    {...props}
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

export function MenubarDemo({ items }: MenubarProps) {
  return (
    <ClientWrapper>
      <Menubar>
        {items.map((menu) => (
          <MenubarMenu key={menu.trigger}>
            <MenubarTrigger>{menu.trigger}</MenubarTrigger>
            <MenubarContent>
              {menu.items.map((item, index) => (
                <React.Fragment key={item.label}>
                  <MenubarItem
                    disabled={item.disabled}
                    onClick={item.onClick}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {item.shortcut && (
                      <span className="text-xs text-zinc-500">{item.shortcut}</span>
                    )}
                  </MenubarItem>
                  {index < menu.items.length - 1 && <MenubarSeparator />}
                </React.Fragment>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </ClientWrapper>
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
};
