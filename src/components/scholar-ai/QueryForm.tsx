// src/components/scholar-ai/QueryForm.tsx
'use client';

import React from 'react';
import { useActionState } from 'react'; // Ensure useActionState is from 'react'
import { useFormStatus } from 'react-dom'; // Ensure useFormStatus is from 'react-dom'
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { handleFormulateQueryAction, type FormulateQueryActionState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Rocket, Lightbulb, SearchCheck, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QueryFormProps {
  onQueriesFormulated: (queries: string[], question: string) => void;
  isBusy: boolean; // Prop to indicate if parent is busy
}

const initialState: FormulateQueryActionState = {
  success: false,
  message: '',
  formulatedQueries: null,
  errors: null,
};

const cardVariants = {
  initial: { opacity: 0, y: 120, rotateX: -50, scale: 0.7, filter: "blur(12px)", originZ: -300 },
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    filter: "blur(0px)",
    originZ: 0,
    transition: { 
      type: "spring", 
      stiffness: 70, // Softer spring
      damping: 20,   // More damping
      duration: 1.5, 
      delay: 0.25
    } 
  },
  hover: {
    scale: 1.05, 
    rotateX: -4, 
    rotateY: 8, 
    z: 60, 
    boxShadow: "0px 50px 80px -25px rgba(var(--primary-hsl), 0.35), 0px 0px 50px rgba(var(--accent-hsl),0.3)",
    transition: { type: "spring", stiffness: 380, damping: 10 }
  }
};

const formElementVariants = {
  initial: { opacity: 0, x: -70, scale: 0.6, filter: "blur(8px)", rotateY:30, originX:0 },
  animate: (i:number) => ({ 
    opacity: 1, x: 0, scale: 1, filter: "blur(0px)", rotateY:0,
    transition: { 
      type: "spring", stiffness: 90, damping: 15, duration: 1.0, delay: i * 0.22 + 0.6 
    } 
  }),
};

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.28, delayChildren: 0.5 } }, 
};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto mt-4 text-lg py-4 px-10 shadow-2xl hover:shadow-primary/40 transition-all duration-500 group bg-gradient-to-br from-accent via-accent/80 to-yellow-500/80 hover:from-accent/90 hover:to-yellow-500/70 text-accent-foreground active:scale-90 rounded-xl"
      aria-label="Formulate Queries"
      asChild
    >
      <motion.button
        whileHover={{
          scale: 1.1, 
          y:-6,
          rotateZ: 1.5, 
          boxShadow: "0px 15px 35px rgba(var(--accent-hsl), 0.6), 0 0 20px rgba(255,215,0,0.7)", 
          transition: {type: "spring", stiffness: 250, damping: 8} 
        }}
        whileTap={{ scale: 0.85, y:4, boxShadow: "0px 2px 8px rgba(var(--accent-hsl), 0.4)"}}
        transition={{ type: "spring", stiffness: 480, damping: 12 }} 
      >
        {pending ? (
          <Loader2 className="mr-3.5 h-7 w-7 animate-spin text-primary-foreground" /> 
        ) : (
          <Rocket className="mr-3.5 h-7 w-7 text-primary-foreground group-hover:scale-[1.7] group-hover:rotate-[1080deg] group-hover:text-yellow-100 transition-all duration-1500 ease-in-out transform-gpu" /> 
        )}
        Ignite Research Engine
      </motion.button>
    </Button>
  );
}

export default function QueryForm({ onQueriesFormulated, isBusy: parentIsBusy }: QueryFormProps) {
  const [state, formAction, formIsPending] = useActionState(handleFormulateQueryAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [currentQuestion, setCurrentQuestion] = React.useState('');

  // Combine parentIsBusy with formIsPending for the disabled state
  const isEffectivelyBusy = parentIsBusy || formIsPending;


  React.useEffect(() => {
    if (state.message) {
      if (state.success && state.formulatedQueries) {
        toast({ title: "🚀 AI Engine Ignited!", description: state.message, variant: 'default', duration: 7000 }); 
        onQueriesFormulated(state.formulatedQueries, currentQuestion);
        if (formRef.current) {
          formRef.current.reset(); // Reset form on success
          setCurrentQuestion(''); // Clear current question state
        }
      } else if (!state.success) {
        let description = state.message;
        if (state.errors?.researchQuestion) {
          description += ` ${state.errors.researchQuestion.join(' ')}`;
        }
        toast({ title: "🚦 Engine Stalled!", description, variant: 'destructive', duration: 9000 }); 
      }
    }
  }, [state, toast, onQueriesFormulated, currentQuestion]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const question = formData.get('researchQuestion') as string;
    setCurrentQuestion(question);
    // formAction is called by the form's action prop, no need to call it manually here.
  };


  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{ transformStyle: "preserve-3d", perspective: '2000px' }} 
      className="will-change-transform"
    >
      <Card className="w-full shadow-2xl border-2 border-primary/20 hover:border-accent/80 transition-all duration-600 rounded-[30px] overflow-hidden bg-card/60 backdrop-blur-2xl transform-gpu"> 
        <CardHeader className="bg-gradient-to-tl from-primary/70 via-primary/90 to-primary p-12"> 
           <motion.div variants={formElementVariants} custom={0} className="flex items-center space-x-5 mb-2.5"> 
             <Brain className="h-14 w-14 text-accent animate-pulse" style={{animationDuration: '1s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'}}/> 
            <CardTitle className="text-5xl font-black text-primary-foreground tracking-tighter">
              Initiate Inquiry
            </CardTitle>
          </motion.div>
          <motion.div variants={formElementVariants} custom={1}>
            <CardDescription className="text-primary-foreground/80 text-xl leading-relaxed">
              Input your complex research question. ScholarAI will meticulously deconstruct it into precise, actionable search vectors, catalyzing your discovery process.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="p-12"> 
          <motion.form
            action={formAction}
            ref={formRef}
            className="space-y-12" 
            onSubmit={handleFormSubmit}
            variants={containerVariants} 
            initial="initial"
            animate="animate"
          >
            <motion.div variants={formElementVariants} custom={2} className="relative group/textarea">
              <Label htmlFor="researchQuestion" className="block text-xl font-bold mb-4 text-foreground flex items-center"> 
                <Lightbulb className="h-7 w-7 mr-3.5 text-yellow-300"/>
                Your Core Research Postulate
              </Label>
              <Textarea
                id="researchQuestion"
                name="researchQuestion"
                rows={8} 
                placeholder="e.g., Evaluate the efficacy of novel CRISPR-Cas9 gene-editing techniques in mitigating neurodegenerative disorders, focusing on off-target effects and long-term therapeutic viability..."
                className="w-full border-input focus:border-accent focus:ring-4 focus:ring-accent/50 transition-all duration-400 rounded-2xl shadow-inner text-xl bg-background/90 placeholder:text-muted-foreground/50 p-6 focus:shadow-accent/40 focus:shadow-2xl transform-gpu" 
                required
                minLength={10}
                maxLength={1000} 
                disabled={isEffectivelyBusy}
                aria-describedby="question-error"
              />
              <div className="absolute -bottom-4 -right-4 opacity-0 group-hover/textarea:opacity-100 group-focus-within/textarea:opacity-100 transition-opacity duration-500">
                <SearchCheck className="h-16 w-16 text-accent/30 -rotate-12" /> 
              </div>
              {state.errors?.researchQuestion && (
                <motion.p
                  id="question-error"
                  initial={{opacity:0, y: -30, height:0, scaleX:0.6, rotateX: 20}} 
                  animate={{opacity:1, y:0, height:'auto', scaleX:1, rotateX: 0}}
                  exit={{opacity:0, y:-25, height:0, scaleX:0.6, rotateX: -15}} 
                  className="mt-4 text-lg text-destructive font-semibold bg-destructive/10 p-4 rounded-xl border-2 border-destructive/30 shadow-md" 
                >
                  {state.errors.researchQuestion.join(' ')}
                </motion.p>
              )}
            </motion.div>
            <CardFooter className="flex justify-end p-0 pt-8"> 
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
