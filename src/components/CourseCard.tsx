import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  title: string;
  duration: string;
  price: number;
  purpose: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}

const CourseCard = ({ title, duration, price, purpose, features, popular, onSelect }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`relative flex flex-col rounded-lg border p-6 card-hover ${
        popular
          ? "border-primary/40 border-glow bg-card"
          : "border-border bg-card"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          MOST POPULAR
        </div>
      )}

      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{purpose}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-foreground">฿{price.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">/ package</span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>{duration}</span>
        </div>
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onSelect}
        className={`mt-8 w-full font-display font-semibold tracking-wide ${
          popular ? "" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
        }`}
        size="lg"
      >
        SELECT PLAN
      </Button>
    </motion.div>
  );
};

export default CourseCard;
