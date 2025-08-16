
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { getGameRecommendations } from '../discover/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertCircle } from 'lucide-react';
import { Alert as AlertComponent, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  preferences: z.string().min(20, {
    message: 'Please describe your preferences in at least 20 characters.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: 'I enjoy open-world RPGs like The Witcher 3 and Skyrim. I\'m looking for a game with a strong story and deep character progression.',
    },
  });

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };
  
  const onSubmit = (values: FormData) => {
    setError(null);
    setStep(1); // Move to loading step

    startTransition(async () => {
      const { error } = await getGameRecommendations({
        preferences: values.preferences,
        playHistory: 'New user, no play history yet.',
        friendActivity: 'No friend activity yet.',
      });

      if (error) {
        setError(error);
        setStep(0); // Go back to form on error
      } else {
        setStep(2); // Move to success step
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome to Astra!</DialogTitle>
              <DialogDescription>
                To get you started, tell us what you like so our AI can find your next favorite game.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Gaming Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I love story-driven RPGs, fast-paced shooters, or relaxing puzzle games..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {error && (
                    <AlertComponent variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </AlertComponent>
                  )}
                <DialogFooter className="!mt-6 sm:justify-between gap-2">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                      Skip for Now
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Get AI Recommendations
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        {step === 1 && (
             <div className="flex flex-col items-center justify-center gap-4 p-8 text-center h-48">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="text-xl font-semibold">Analyzing your tastes...</h3>
                <p className="text-muted-foreground">Our AI is preparing your first batch of personalized game recommendations.</p>
            </div>
        )}
        {step === 2 && (
             <div className="flex flex-col items-center justify-center gap-4 p-8 text-center h-48">
                <Wand2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">You're All Set!</h3>
                <p className="text-muted-foreground">Your first set of recommendations are waiting for you on the Discover page. Enjoy your new gaming universe!</p>
                <DialogFooter className="!mt-6">
                    <Button onClick={handleClose}>
                        Start Exploring
                    </Button>
                </DialogFooter>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
