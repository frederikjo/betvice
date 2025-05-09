import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Custom Section Header component
const SectionHeader = ({ title, icon: Icon, isOpen, onClick }) => (
  <div
    className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-[#F0F4F8] rounded-t-lg border border-gray-100 cursor-pointer hover:from-white hover:to-[#E8F0F8] transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center">
      {Icon && <Icon className="text-betvise-blue w-5 h-5 mr-3" />}
      <h2 className="text-betvise-blue-800 text-xl font-semibold">
        {title}
      </h2>
    </div>
    {isOpen ? (
      <ChevronUp className="text-betvise-blue w-5 h-5" />
    ) : (
      <ChevronDown className="text-betvise-blue w-5 h-5" />
    )}
  </div>
);

const StyledCollapsible = ({
  title,
  icon,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`mb-6 rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <CollapsibleTrigger asChild>
        <div className="w-full">
          <SectionHeader
            title={title}
            icon={icon}
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-white border border-t-0 border-gray-100 rounded-b-lg">
        <div className="p-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default StyledCollapsible;
