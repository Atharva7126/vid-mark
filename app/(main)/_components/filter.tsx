"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, CheckCircle, StepForward } from "lucide-react"
import { FaStar } from "react-icons/fa";
import { LuLayoutGrid } from "react-icons/lu";

export function FilterToggle(
    {setFilter}:{setFilter: (val: "all" | "completed" | "watching" | "stared") => void}
) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Filter />
                    <span className="sr-only">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                    <LuLayoutGrid className="text-gray-500 w-4 h-4" />
                    All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("completed")}>
                    <CheckCircle className=" text-green-500 w-4 h-4" />
                    Completed
                </DropdownMenuItem>
                <DropdownMenuItem  onClick={() => setFilter("watching")}>
                    <StepForward className=" text-blue-500 w-4 h-4" />
                    Continue Watching
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("stared")}>
                    <FaStar className="text-yellow-500 w-4 h-4" />
                    Stared
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
