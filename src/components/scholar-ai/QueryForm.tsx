// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, MessagesSquare, Brain, Zap, Rocket, Lightbulb, SearchCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QueryFormProps {
  onQueriesFormulated: (queries: string[], question: string) => void;
  isBusy: boolean;
}

const initialState: FormulateQueryActionState = {
  success: false,
  message: '',
  formulatedQueries: null,
  errors: null,
};

const cardVariants = {
  initial: { opacity: 0, y: 100, rotateX: -45, scale: 0.8, filter: "blur(10px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15,
      duration: 1.2, // Slower, more grand entrance
      delay: 0.2
    } 
  },
  hover: {
    scale: 1.07, // Slightly more pronounced hover
    rotateX: -6, // More tilt
    rotateY: 10, // More tilt
    z: 50, // Lift further
    boxShadow: "0px 40px 70px -20px rgba(var(--primary-hsl), 0.3), 0px 0px 40px rgba(var(--accent-hsl),0.25)", // Deeper, more spread shadow
    transition: { type: "spring", stiffness: 350, damping: 12 }
  }
};


const formElementVariants = {
  initial: { opacity: 0, x: -60, scale: 0.75, filter: "blur(6px)", rotateY:25, originX:0 }, // More dramatic initial state
  animate: (i:number) => ({ 
    opacity: 1, x: 0, scale: 1, filter: "blur(0px)", rotateY:0,
    transition: { 
      type: "spring", stiffness: 100, damping: 14, duration: 0.9, delay: i * 0.2 + 0.5 // Stagger with more delay
    } 
  }),
};

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.25, delayChildren: 0.4 } }, // Increased stagger
};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto mt-4 text-lg py-3.5 px-8 shadow-xl hover:shadow-2xl transition-all duration-400 group bg-gradient-to-br from-accent via-accent/80 to-yellow-400/70 hover:from-accent/90 hover:to-yellow-400/60 text-accent-foreground active:scale-95" // Larger, more vibrant button
      aria-label="Formulate Queries"
      asChild
    >
      <motion.button
        whileHover={{
          scale: 1.12, // More pronounced scale
          y:-5,
          rotateZ: 2, 
          boxShadow: "0px 12px 30px rgba(var(--accent-hsl), 0.55), 0 0 15px rgba(255,215,0,0.6)", // Gold accent shadow
          transition: {type: "spring", stiffness: 280, damping: 9} // Bouncier
        }}
        whileTap={{ scale: 0.88, y:3, boxShadow: "0px 3px 10px rgba(var(--accent-hsl), 0.35)"}}
        transition={{ type: "spring", stiffness: 450, damping: 10 }} // Snappier tap
      >
        {pending ? (
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary-foreground" /> // Larger loader
        ) : (
          <Rocket className="mr-3 h-6 w-6 text-primary-foreground group-hover:scale-140 group-hover:rotate-[720deg] group-hover:text-yellow-200 transition-all duration-1200 ease-in-out transform-gpu" /> // More dramatic animation
        )}
        Launch AI Query Engine
      </motion.button>
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy }: QueryFormProps) {
  const [state, formAction, isPending] = useActionState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');


  React.useEffect(() => {
    if (state.message) {
      if (state.success && state.formulatedQueries) {
        toast({ title: "🚀 AI Engine Fired Up!", description: state.message, variant: 'default', duration: 6000 }); // Longer duration
        onQueriesFormulated(state.formulatedQueries, currentQuestion);
      } else if (!state.success) {
        let description = state.message;
        if (state.errors?.researchQuestion) {
          description += ` ${state.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "🚦 Engine Misfire!", description, variant: 'destructive', duration: 8000 }); // Longer duration
      }
    }
  }, [state, toast, onQueriesFormulated, currentQuestion]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const question = formData.get('researchQuestion') as string;
    setCurrentQuestion(question);
    // formAction will be called by the form's action prop
  };


  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ transformStyle: "preserve-3d", perspective: '1500px' }} // Increased perspective
      className="will-change-transform"
    >
      <Card className="w-full shadow-2xl border-2 border-primary/15 hover:border-accent/80 transition-all duration-500 rounded-3xl overflow-hidden bg-card/75 backdrop-blur-xl transform-gpu"> {/* More rounded, enhanced bg */}
        <CardHeader className="bg-gradient-to-tl from-primary/85 via-primary/95 to-primary p-10"> {/* Increased padding */}
           <motion.div variants={formElementVariants} custom={0} className="flex items-center space-x-4 mb-2"> {/* Increased spacing */}
             <Brain className="h-12 w-12 text-accent animate-pulse" style={{animationDuration: '1.2s', animationTimingFunction: 'ease-in-out'}}/> {/* Slower, smoother pulse */}
            <CardTitle className="text-4xl font-black text-primary-foreground tracking-tighter"> {/* Bolder, tighter tracking */}
              Launch Your Intellect
            </CardTitle>
          </motion.div>
          <motion.div variants={formElementVariants} custom={1}>
            <CardDescription className="text-primary-foreground/85 text-lg leading-relaxed"> {/* Larger, more relaxed leading */}
              Submit your intricate research inquiry. ScholarAI will deconstruct it into hyper-precise, actionable search vectors, paving the way for discovery.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="p-10"> {/* Increased padding */}
          <motion.form
            action={formAction}
            ref={formRef}
            className="space-y-10" // Increased spacing
            onSubmit={handleFormSubmit}
            variants={containerVariants} 
            initial="initial"
            animate="animate"
          >
            <motion.div variants={formElementVariants} custom={2} className="relative group/textarea">
              <Label htmlFor="researchQuestion" className="block text-lg font-bold mb-3.5 text-foreground/95 flex items-center"> {/* Bolder, larger label */}
                <Lightbulb className="h-6 w-6 mr-3 text-yellow-400"/> {/* Different Icon */}
                Your Central Research Hypothesis
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion"
                rows={7} 
                placeholder="e.g., Investigate the quantum entanglement phenomena in multi-dimensional photonic lattices and its potential applications in next-generation secure communication protocols, considering decoherence effects..."
                className="w-full border-input focus:border-accent focus:ring-2 focus:ring-accent/60 transition-all duration-350 rounded-xl shadow-inner text-lg bg-background/85 placeholder:text-muted-foreground/60 p-5 focus:shadow-accent/30 focus:shadow-xl transform-gpu" // Larger text, more padding, stronger focus
                required
                minLength={10}
                maxLength={700} 
                disabled={isBusy || isPending}
                aria-describedby="question-error"
              />
              <div className="absolute -bottom-3 -right-3 opacity-0 group-hover/textarea:opacity-100 group-focus-within/textarea:opacity-100 transition-opacity duration-400">
                <SearchCheck className="h-12 w-12 text-accent/35 -rotate-15" /> {/* Different icon, larger */}
              </div>
              {state.errors?.researchQuestion && (
                <motion.p
                  id="question-error"
                  initial={{opacity:0, y: -25, height:0, scaleX:0.7, rotateX: 15}} // More dynamic entry
                  animate={{opacity:1, y:0, height:'auto', scaleX:1, rotateX: 0}}
                  exit={{opacity:0, y:-20, height:0, scaleX:0.7, rotateX: -10}} // More dynamic exit
                  className="mt-3 text-md text-destructive font-semibold bg-destructive/15 p-3 rounded-lg border-2 border-destructive/40" // Enhanced error styling
                >
                  {state.errors.researchQuestion.join(' ')}
                </motion.p>
              )}
            </motion.div>
            <CardFooter className="flex justify-end p-0 pt-6"> 
              <motion.div variants={formElementVariants} custom={3} className="w-full sm:w-auto">
                 <SubmitButton />
              </motion.div>
            </CardFooter>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
