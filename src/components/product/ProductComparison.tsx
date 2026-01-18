import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Brain, Watch, Cloud, Car, Heart, Satellite, GraduationCap, Landmark,
  Home, Glasses, Shield, Building2, X, Check, Plus, GitCompare
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Watch, Cloud, Car, Heart, Satellite, GraduationCap, Landmark,
  Home, Glasses, Shield, Building2
};

interface ProductComparisonProps {
  initialProduct?: Product;
  trigger?: React.ReactNode;
}

const ProductComparison = ({ initialProduct, trigger }: ProductComparisonProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    initialProduct ? [initialProduct] : []
  );
  const [isOpen, setIsOpen] = useState(false);

  const addProduct = (productId: string) => {
    if (selectedProducts.length >= 3) return;
    const product = products.find(p => p.id === productId);
    if (product && !selectedProducts.find(p => p.id === productId)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const availableProducts = products.filter(
    p => !selectedProducts.find(sp => sp.id === p.id)
  );

  // Get all unique specification labels
  const allSpecLabels = [...new Set(
    selectedProducts.flatMap(p => p.specifications.map(s => s.label))
  )];

  // Get all unique features
  const allFeatures = [...new Set(selectedProducts.flatMap(p => p.features))];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <GitCompare className="w-4 h-4" />
            Compare Products
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Product Comparison</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-6">
            {/* Product Selection */}
            <div className="flex flex-wrap gap-4 mb-8">
              {selectedProducts.map((product) => {
                const IconComponent = iconMap[product.icon];
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative glass-card rounded-xl p-4 pr-10 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                      {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                    </div>
                    <span className="font-medium">{product.name}</span>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
              
              {selectedProducts.length < 3 && (
                <Select onValueChange={addProduct}>
                  <SelectTrigger className="w-[200px] h-auto py-4">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <SelectValue placeholder="Add product" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => {
                      const IconComponent = iconMap[product.icon];
                      return (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {product.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedProducts.length === 0 ? (
              <div className="text-center py-16">
                <GitCompare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Selected</h3>
                <p className="text-muted-foreground">Select up to 3 products to compare their features and specifications.</p>
              </div>
            ) : (
              <AnimatePresence>
                {/* Comparison Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Product Headers */}
                  <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}>
                    <div className="font-semibold text-muted-foreground">Product</div>
                    {selectedProducts.map((product) => {
                      const IconComponent = iconMap[product.icon];
                      return (
                        <div key={product.id} className="text-center">
                          <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-3`}>
                            {IconComponent && <IconComponent className="w-10 h-10 text-white" />}
                          </div>
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-primary font-semibold mt-2">{product.price}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tagline */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}>
                      <div className="font-semibold text-muted-foreground">Tagline</div>
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="text-center text-sm">
                          {product.tagline}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h4 className="font-bold text-lg mb-4">Specifications</h4>
                    <div className="glass-card rounded-xl overflow-hidden">
                      {allSpecLabels.map((label, index) => (
                        <div
                          key={label}
                          className={`grid gap-4 p-4 ${index !== allSpecLabels.length - 1 ? 'border-b border-border' : ''}`}
                          style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}
                        >
                          <div className="font-medium text-muted-foreground">{label}</div>
                          {selectedProducts.map((product) => {
                            const spec = product.specifications.find(s => s.label === label);
                            return (
                              <div key={product.id} className="text-center font-semibold">
                                {spec?.value || "—"}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-bold text-lg mb-4">Features</h4>
                    <div className="glass-card rounded-xl overflow-hidden">
                      {allFeatures.map((feature, index) => (
                        <div
                          key={feature}
                          className={`grid gap-4 p-4 ${index !== allFeatures.length - 1 ? 'border-b border-border' : ''}`}
                          style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}
                        >
                          <div className="font-medium text-muted-foreground">{feature}</div>
                          {selectedProducts.map((product) => {
                            const hasFeature = product.features.includes(feature);
                            return (
                              <div key={product.id} className="flex justify-center">
                                {hasFeature ? (
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-primary" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                    <X className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparison;
