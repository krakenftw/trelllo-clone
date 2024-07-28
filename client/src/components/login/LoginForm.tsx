"use client"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import  loginSchema from "./loginSchema"



export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password:""
    },
  })


  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values)
  }

    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    )
}