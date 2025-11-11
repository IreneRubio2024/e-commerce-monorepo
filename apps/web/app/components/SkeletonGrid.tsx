import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function () {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-3 customGap p-4"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="space-y-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, ease: "easeInOut", duration: 0.4 }}
        >
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </motion.div>
      ))}
    </motion.div>
  );
}
