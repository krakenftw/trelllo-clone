"use client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import registerSchema from "./registerSchema";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof registerSchema>,
  ): Promise<void> {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        },
      );
      toast({ title: "Account created." });
      setUser({
        name: res.data.user.name,
        email: res.data.user.email,
        id: res.data.user.id,
      });
      router.push("/dashboard");
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Internal Server Error",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="w-full" placeholder="Enter Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="Enter Email"
                  {...field}
                />
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

        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? "Loading.." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
