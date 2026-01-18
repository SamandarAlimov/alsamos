import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Watch, Cloud, Car, Heart, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { products as allProducts } from "@/data/products";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Watch,
  Cloud,
  Car,
  Heart,
  Satellite,
};

const gradientMap: Record<string, string> = {
  "AI & Robotics": "from-purple-500 via-indigo-500 to-violet-600",
  "Consumer Electronics": "from-cyan-500 via-blue-500 to-purple-500",
  "Technology": "from-blue-500 via-purple-600 to-indigo-600",
  "Automotive": "from-green-500 via-emerald-500 to-teal-600",
  "Healthcare": "from-red-500 via-pink-500 to-rose-600",
  "Aerospace": "from-indigo-500 via-violet-500 to-purple-600",
};

// Use real products from data
const displayProducts = allProducts.slice(0, 6).map(product => ({
  id: product.id,
  name: product.name,
  tagline: product.tagline,
  description: product.description,
  icon: iconMap[product.icon] || Brain,
  gradient: gradientMap[product.category] || "from-primary via-primary-dark to-primary",
  features: product.features.slice(0, 4),
  href: `/products/${product.slug}`,
}));

const productContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const productItemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
    },
  },
};

export const ProductsShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-primary font-medium text-sm uppercase tracking-wider"
          >
            Latest Innovation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mt-4 mb-6"
          >
            Products That Define{" "}
            <span className="gradient-text">Tomorrow</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Experience our latest innovations designed to transform your life, 
            work, and the world around you.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="space-y-8 lg:space-y-16"
          variants={productContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={productItemVariants}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center",
                index % 2 === 1 && "lg:grid-flow-col-dense"
              )}
            >
              {/* Product Visual */}
              <motion.div
                style={{ y: index % 2 === 0 ? y : undefined }}
                className={cn(
                  "relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden",
                  index % 2 === 1 && "lg:col-start-2"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-20",
                  product.gradient
                )} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={cn(
                      "w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br flex items-center justify-center",
                      product.gradient
                    )}
                  >
                    <product.icon className="w-16 h-16 lg:w-24 lg:h-24 text-white" />
                  </motion.div>
                </div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute top-1/4 left-1/4 w-8 h-8 rounded-lg bg-primary/20 backdrop-blur-sm"
                />
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-full bg-accent-cyan/20 backdrop-blur-sm"
                />
              </motion.div>

              {/* Product Info */}
              <div className={cn(
                "space-y-6",
                index % 2 === 1 && "lg:col-start-1"
              )}>
                <div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "text-sm font-medium uppercase tracking-wider bg-gradient-to-r bg-clip-text text-transparent",
                      product.gradient
                    )}
                  >
                    {product.tagline}
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2"
                  >
                    {product.name}
                  </motion.h3>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground"
                >
                  {product.description}
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-3"
                >
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-4 py-2 rounded-full bg-surface-soft border border-border text-sm font-medium text-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 pt-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground"
                  >
                    <Link to={product.href}>
                      Explore Product
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="rounded-xl"
                  >
                    <Link to="/products">
                      View All Products
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
