interface PriorityColorizer {
  getColor(priority: string): string;
}

const priorityColors: {
  [key: string]: string;
} = {
  low: "bg-green-600",
  medium: "bg-orange-500",
  urgent: "bg-red-600",
};
class DefaultPriorityColorizer implements PriorityColorizer {
  getColor(priority: string): string {
    return priorityColors[priority] || "bg-gray-200";
  }
}

const colorizer = new DefaultPriorityColorizer();
export const bgColorClass = (priority: string) => colorizer.getColor(priority);
