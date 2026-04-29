import { motion } from "framer-motion";
import { ArrowRight, Monitor, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-calisthenics.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Calisthenics athlete"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/40" />
        </div>

        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Calisthenics Training
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-foreground md:text-7xl">
              MASTER YOUR
              <br />
              <span className="text-primary text-glow">BODYWEIGHT</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Transform your physique with structured calisthenics programs.
              From basics to advanced skills — online or in-person.
            </p>
            <div className="mt-8 flex gap-4">
              <Button
                size="lg"
                className="font-display font-semibold tracking-wide"
                onClick={() =>
                  document
                    .getElementById("training-types")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                VIEW PLANS
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-display font-semibold tracking-wide border-border text-foreground hover:bg-secondary"
                onClick={() => navigate("/booking")}
              >
                GO TO BOOKING <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Training Types */}
      <section id="training-types" className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Choose Your Style
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            How Do You Want to Train?
          </h2>
          <p className="mt-4 mx-auto max-w-lg text-muted-foreground">
            We offer two training styles to fit your lifestyle. Pick what works
            best, then choose your plan.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Online Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-8 card-hover cursor-pointer overflow-hidden"
            onClick={() => navigate("/plans#online")}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <Monitor className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Online Training
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Train from anywhere in the world with live video coaching
                sessions. Get real-time feedback, custom programs, and flexible
                scheduling that fits your timezone.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Video call sessions",
                  "Flexible scheduling",
                  "Train from home",
                  "Lower cost",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 font-display text-sm font-semibold text-primary">
                Starting from ฿2,500
              </div>
              <Button
                className="mt-6 w-full font-display font-semibold tracking-wide"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/plans#online");
                }}
              >
                VIEW ONLINE PLANS <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Onsite Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col rounded-xl border-2 border-primary/40 border-glow bg-card p-8 card-hover cursor-pointer  overflow-y-visible"
            onClick={() => navigate("/plans#onsite")}
          >
            <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground z-0">
              MOST POPULAR
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Onsite Training
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Personal trainer comes to your location for hands-on coaching.
                Real-time form correction, spotting for advanced moves, and
                equipment provided.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "In-person coaching",
                  "Hands-on spotting",
                  "Equipment provided",
                  "Maximum results",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 font-display text-sm font-semibold text-primary">
                Starting from ฿3,500
              </div>
              <Button
                className="mt-6 w-full font-display font-semibold tracking-wide"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/plans#onsite");
                }}
              >
                VIEW ONSITE PLANS <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
