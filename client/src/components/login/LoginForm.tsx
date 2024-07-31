"use client";
import { useState, useEffect } from "react";
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
import loginSchema from "./loginSchema";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";

export default function LoginForm() {
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof loginSchema>, e: any) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/login`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast({ title: "Logged in successfully." });
        setUser({
          name: res.data.user.name,
          email: res.data.user.email,
          id: res.data.user.id,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 400);
      } else {
        throw new Error("Login failed");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="w-full" type="submit">
          {isLoading ? "Logging in..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
